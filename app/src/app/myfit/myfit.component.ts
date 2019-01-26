import { Component, OnInit } from '@angular/core';
import { GoogleApiService } from 'ng-gapi';
import { UserService } from '../core/fit.service';
import { FitActivityType } from '../core/FitActivityEnum.enum';
import { MyFitResource } from './myfit.resource';

interface SleepSegment {
    start: number;
    end: number;
    type: FitActivityType;
}

@Component({
    selector: 'app-myfit',
    templateUrl: './myfit.component.html',
    styleUrls: ['./myfit.component.css']
})
export class MyfitComponent implements OnInit {

    // step data fields
    public stepsToday = 0;
    public stepData: any[] = [];

    // interval length for step data in days, default 7 (1 week)
    public dateDiff = 7;

    // sleep data fields
    public sleepDurationMin = 0;
    public sleepData: any[] = [];

    // hour when 'night starts' (default 18.00)
    public nightStart = 18;

    public stepErr;
    public sleepErr;

    public readonly sleepTypes: FitActivityType[] = [
        FitActivityType.LIGHT_SLEEP,
        FitActivityType.DEEP_SLEEP,
        FitActivityType.REM_SLEEP,
        FitActivityType.AWAKE_DURING_SLEEP_CYCLE
    ];

    // public to convert xticks from numbers to date times
    public sleepStart = 0;

    // chart properties
    public view: number[] = [800, 400];
    public showXAxis = true;
    public showYAxis = true;
    public gradient = false;
    public showXAxisLabel = true;
    public showYAxisLabel = true;
    public xAxisLabelSteps = 'Datum';
    public yAxisLabelSteps = 'Anzahl Schritte';
    public xAxisLabelSleep = 'Uhrzeit';
    public yAxisLabelSleep = 'Schlaftyp';
    public colorScheme = {
        domain: ['#A10A28']
    };

    // formatter for x axis, comverts milliseconds to local time
    public xAxisTickFormatting = (ev: number): string => {
        return new Date(this.sleepStart + ev).toLocaleTimeString('de-DE');
    }

    // formatter for y axis, converts Enum to Activity
    public yAxisTickFormatting = (t: FitActivityType): string => {
        return FitActivityType[t];
    }

    public onSelect = (ev): void => {
        console.log(ev);
    }

    constructor(private gapiService: GoogleApiService,
        private userService: UserService,
        private fitResource: MyFitResource) {
        this.gapiService.onLoad().subscribe();
    }

    ngOnInit() {

        // get fitness data on load
        if (this.isLoggedIn()) {
            this.getVitalData();
        }
    }

    public isLoggedIn(): boolean {
        return this.userService.isUserSignedIn();
    }

    public signIn(): void {

        // get fitness data after successfull login
        this.userService.signIn().then(() => {
            this.getVitalData();
        });
    }

    public signOut(): void {
        this.userService.signOut().then(() => {
            console.log('logged out');
        });
    }

    private handleStepError(errObj): void {
        const err = errObj.error.error;
        console.log(`API call failed: `, err);

        this.stepErr = `Could not get steps: ${err.message}`;
    }

    private handleSleepError(errObj): void {
        const err = errObj.error.error;
        console.log(`API call failed: `, err);

        this.sleepErr = `Could not get sleep data: ${err.message}`;
        console.log(this.sleepErr);
    }

    /**
     * Formats sleep time as readable string.
     */
    public formatSleepTime(): string {

        const s = Math.floor(this.sleepDurationMin / 60);
        const m = this.sleepDurationMin % 60;
        return `
        ${s > 0 ? `${s} Stunde${(s > 1 ? 'n' : '')}` : ''}
        ${(s > 0 && m > 0) ? ' und ' : ''}
        ${m > 0 ? `${m} Minute${(m > 1 ? 'n' : '')}` : ''}
        `.trim();
    }

    /**
     * Changes step data interval and reloads the data.
     */
    public switchType(val: string): void {

        switch (val) {

            case 'byweek':
                this.dateDiff = 7;
                break;

            case 'bymonth':
                this.dateDiff = 30;
                break;

            default:
                this.dateDiff = 7;
                break;
        }
        this.getSteps();
    }

    /**
     * Gets the specified data (here, steps and sleep / fake sleep).
     */
    public getVitalData(): void {
        this.getSteps();
        // this.getHuaweiSleep();
        this.getMockHuaweiSleep();
    }

    /**
     * Queries the *GoogleFit API* for step data in a given interval.
     * The interval can be changed via `this.dateDiff`.
     */
    public getSteps(): void {

        this.stepData = [];
        this.stepErr = null;

        const now: number = Date.now();
        const start: Date = new Date(now - (this.dateDiff * 864e5));
        start.setHours(0, 0, 0, 0);

        // construct the request body
        const payload = {
            aggregateBy: [{
                dataTypeName: 'com.google.step_count.delta',
                dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
            }],
            bucketByTime: {
                durationMillis: 86400000
            },
            startTimeMillis: +start,
            endTimeMillis: now,
        };

        // perform the request
        this.fitResource.aggregate(payload)
            .subscribe(res => {

                const all: any[] = <any[]>res.bucket;

                if (!all || all.length === 0) {
                    console.log('no steps');
                    return;
                }

                // each 'bucket' equals one day
                all.forEach(b => {

                    const time: Date = new Date(+b.startTimeMillis);
                    let stepCount: number;

                    // lazy way to handle *undefined* and *null*
                    try {
                        stepCount = b.dataset[0].point[0].value[0].intVal;
                    } catch (e) {
                        stepCount = 0;
                    }

                    this.stepData.push({ name: time, value: stepCount });

                });
                // today's steps are in the last 'bucket'
                this.stepsToday = this.stepData[this.stepData.length - 1].value;

                // create new array to trigger chart redrawing (see https://github.com/swimlane/ngx-charts/issues/118)
                this.stepData = [... this.stepData];
            }, this.handleStepError);
    }

    /**
     * Queries the *GoogleFit API* for sleep data from last night.
     * The hour when the 'night' begins can be changed via `this.nightStart`.
     */
    public getHuaweiSleep(): void {

        // the chart data
        // (see https://github.com/swimlane/ngx-charts/blob/master/docs/examples/bar-charts/stacked-vertical-bar-chart.md#data-format)
        const results = [{
            'name': FitActivityType.LIGHT_SLEEP,
            'series': [],
            'extra': '#FFB500'
        }, {
            'name': FitActivityType.DEEP_SLEEP,
            'series': [],
            'extra': '#FF8400'
        }, {
            'name': FitActivityType.REM_SLEEP,
            'series': [],
            'extra': '#00f9c4'
        }, {
            'name': FitActivityType.AWAKE_DURING_SLEEP_CYCLE,
            'series': [],
            'extra': '#A10A28'
        }];

        this.sleepData = [];
        this.sleepErr = null;

        const now: number = Date.now();
        const start: Date = new Date(now - 864e5);
        start.setHours(this.nightStart, 0, 0, 0); // yesterday evening

        // construct the request body
        const payload = {
            aggregateBy: [{
                dataTypeName: 'com.google.activity.segment',
                dataSourceId: 'raw:com.google.activity.segment:com.huawei.health:'
            }],
            bucketByActivitySegment: {
                minDurationMillis: 60000,
                activityDataSourceId: 'derived:com.google.activity.summary:com.google.android.gms:aggregated'
            },
            startTimeMillis: +start,
            endTimeMillis: now,
        };

        // perform the request
        this.fitResource.aggregate(payload)
            .subscribe(res => {

                let huge: any[] = (<any[]>res.bucket)
                    .map(b => {
                        return <SleepSegment>{
                            start: +b.startTimeMillis,
                            end: +b.endTimeMillis,
                            type: b.activity
                        };
                    })
                    .filter(a => this.sleepTypes.includes(a.type));

                if (!huge || huge.length === 0) {
                    console.log('no sleeps');
                    return;
                }

                this.sleepStart = huge[0].start;

                // calculate and set sleep duration
                const sleepMillis: number = huge
                    .filter(a => a.type !== FitActivityType.AWAKE_DURING_SLEEP_CYCLE) // filter awake segments
                    .reduce((akk, cur) => akk + (cur.end - cur.start), 0); // sum duration of all segments

                this.sleepDurationMin = sleepMillis / 60000;

                // concatenate sleep segments of the same sleep type
                huge.forEach((_, i, a) => {
                    let c: number = i + 1;
                    while (a[i] && a[i].type === (a[c] || {}).type && a[i].end === (a[c] || {}).start) {
                        a[i].end = a[c].end;
                        a[c++] = null;
                    }
                });

                // remove null segments
                huge = huge.filter(a => !!a);

                let len = huge.length;

                // fill gaps between segments (necessary for the bar chart to work)
                for (let i = 0; i < len; i++) {

                    const e = huge[i];
                    const nextStart = (huge[i + 1] || {}).start;

                    // gap found, add invisible bar inbetween
                    if (nextStart && e.end !== nextStart) {
                        huge.splice(i + 1, 0, { start: e.end, end: nextStart });
                        len++;
                    }

                    // add bars to chart data
                    results.forEach(r => {
                        r.series.push({
                            'name': `Segment${i}`,
                            'value': e.end - e.start,
                            'opacity': (r.name === e.type) ? 1 : 0
                        });
                    });
                }

                // create new array to trigger redrawing
                this.sleepData = [...results];

            }, this.handleSleepError);
    }

    /**
     * Creates fake sleep data. (to be able to draw the chart when the user
     * has no Huawei data available from Google Fit.)
     */
    public getMockHuaweiSleep(): void {

        // the chart data
        // (see https://github.com/swimlane/ngx-charts/blob/master/docs/examples/bar-charts/stacked-vertical-bar-chart.md#data-format)
        const results = [{
            'name': FitActivityType.LIGHT_SLEEP,
            'series': [],
            'extra': '#FFB500'
        }, {
            'name': FitActivityType.DEEP_SLEEP,
            'series': [],
            'extra': '#FF8400'
        }, {
            'name': FitActivityType.REM_SLEEP,
            'series': [],
            'extra': '#00f9c4'
        }, {
            'name': FitActivityType.AWAKE_DURING_SLEEP_CYCLE,
            'series': [],
            'extra': '#A10A28'
        }];

        // perform the request
        this.fitResource.mockAggregate()
            .subscribe(res => {

                let huge: any[] = (<any[]>res.bucket)
                    .map(b => {
                        return <SleepSegment>{
                            start: +b.startTimeMillis,
                            end: +b.endTimeMillis,
                            type: b.activity
                        };
                    })
                    .filter(a => this.sleepTypes.includes(a.type))
                    .filter(a => a.start >= 1541696400000 && a.end <= 1541761200000); // Night 8-9.11
                // .filter(a => a.start >= 1541782800000 && a.end <= 1541851200000); // Night 9-10.11 (empty)
                // .filter(a => a.start >= 1541869200000 && a.end <= 1541952000000); // Night 10-11.11

                if (!huge || huge.length === 0) {
                    console.log('no sleeps');
                    return;
                }

                this.sleepStart = huge[0].start;

                // get sleep duration
                const sleepMillis: number = huge
                    .filter(a => a.type !== FitActivityType.AWAKE_DURING_SLEEP_CYCLE) // filter awake segments
                    .reduce((akk, cur) => akk + (cur.end - cur.start), 0); // sum duration of all segments

                this.sleepDurationMin = sleepMillis / 60000;

                // concatenate sleep segments
                huge.forEach((_, i, a) => {
                    let c: number = i + 1;
                    while (a[i] && a[i].type === (a[c] || {}).type && a[i].end === (a[c] || {}).start) {
                        a[i].end = a[c].end;
                        a[c++] = null;
                    }
                });

                // remove null segments
                huge = huge.filter(a => !!a);

                let len = huge.length;

                // fill gaps
                for (let i = 0; i < len; i++) {
                    const e = huge[i];
                    const nextStart = (huge[i + 1] || {}).start;

                    if (nextStart && e.end !== nextStart) {
                        huge.splice(i + 1, 0, { start: e.end, end: nextStart }); // no type since it was a gap
                        len++;
                    }
                    results.forEach(r => {
                        r.series.push({
                            'name': `Segment${i}`,
                            'value': e.end - e.start,
                            'opacity': (r.name === e.type) ? 1 : 0
                        });
                    });
                }
                // create new array to trigger redrawing
                this.sleepData = [...results];
            });
    }
}
