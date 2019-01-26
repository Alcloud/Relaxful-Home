import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../core/fit.service';

interface AggregateOptions {
    startTimeMillis: number;
    endTimeMillis?: number;
    bucketDuration?: number;
    bucketByActivitySegment?: {
        minDurationMillis?: number,
        activityDataSourceId?: string
    };
    aggregateBy: {
        dataTypeName?: string;
        dataSourceId?: string;
    }[];
}

@Injectable()
export class MyFitResource {
    private readonly API_URL: string = 'https://www.googleapis.com/fitness/v1/users/me';

    constructor(private httpClient: HttpClient,
        private userService: UserService) {
    }

    /**
     * Retrieves all data sources. User has to
     * be signed in with Google.
     */
    public dataSources(): Observable<any> {
        return this.httpClient.get(`${this.API_URL}/dataSources/`, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.userService.getToken()}`
            })
        });
    }

    /**
     * Retrieves data source by id. User has to
     * be signed in with Google.
     * @param dataSourceId The data source to get
     */
    public dataSourceForId(dataSourceId: String): Observable<any> {
        return this.httpClient.get(`${this.API_URL}/dataSources/${dataSourceId}`, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.userService.getToken()}`
            })
        });
    }

    /**
     * Retrieve changes of data points for given dataSourceId. User has to
     * be signed in with Google.
     * @param dataSourceId The data source
     */
    public dataChangesForId(dataSourceId: String): Observable<any> {
        return this.httpClient.get(`${this.API_URL}/dataSources/${dataSourceId}/dataPointChanges`, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.userService.getToken()}`
            })
        });
    }

    /**
     * Retrieves datasets for given `dataSourceId` in the sepcified interval. User has to
     * be signed in with Google.
     * @param dataSourceId The data source
     * @param startTimeInNanos Start time in Nanoseconds (!) (Optional, defaults to 0)
     * @param endTimeInNanos End time in Nanoseconds (!) (Optional, defaults to `now`)
     */
    public datasetsForId(dataSourceId: String, startTimeInNanos: Number = 0, endTimeInNanos: Number = Date.now() * 1e3): Observable<any> {

        const datasetId = `${startTimeInNanos}-${endTimeInNanos}`;
        return this.httpClient.get(`${this.API_URL}/dataSources/${dataSourceId}/datasets${datasetId}`, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.userService.getToken()}`,
            })
        });
    }

    /**
     * Aggregates fitness data by type or datasource. User has to
     * be signed in with Google.
     * @param opts How to aggregate the data
     */
    public aggregate(opts: AggregateOptions): Observable<any> {

        return this.httpClient.post(`${this.API_URL}/dataset:aggregate`, opts, {
                headers: new HttpHeaders({
                    Authorization: `Bearer ${this.userService.getToken()}`
                })
            });
    }

    /**
     * Gets Mock Fitness data aggregated by type or datasource. Simulates {@link aggregate()}
     * by reading fake sleep data from a stored JSON file.
     */
    public mockAggregate(): Observable<any> {

        return this.httpClient.get(`../../assets/activityHealthBucketByActivitySEGMENT.json`);
    }

    /**
     * Retrieves all data sessions. User has to
     * be signed in with Google.
     */
    public sessions(): Observable<any> {
        return this.httpClient.get(`${this.API_URL}/sessions`, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.userService.getToken()}`
            })
        });
    }
}
