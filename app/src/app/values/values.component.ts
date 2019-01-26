import { Component } from '@angular/core';
import * as AWS from 'aws-sdk';
import { DateTime } from 'aws-sdk/clients/ram';

const fragebogenTable = 'Fragebogen';
const awsConfig = {
  'region': 'eu-west-1',
  'endpoint': 'http://dynamodb.eu-west-1.amazonaws.com/',
  'accessKeyId': 'AKIAJBIW4UX6CZRCDDDQ', 'secretAccessKey': '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'
};
let fir: any[] = [];
const time: Date[] = [];
let result: string;

@Component({
  selector: 'app-values',
  templateUrl: './values.component.html',
  styleUrls: ['./values.component.css']
})

export class ValuesComponent {

  resultArray = fir;
  timeArray = time;

  constructor() {
  }

  showValues() {
    AWS.config.update(awsConfig);
    const ddb = new AWS.DynamoDB.DocumentClient();

    const params = {
      TableName: fragebogenTable,
    };

    ddb.scan(params, onScan);

    // clear array by refreshing
    if (fir.length > 0) {
      fir = [];
    }

    function onScan(err, data) {
      if (err) {
        console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
      } else {
        console.log('Scan succeeded.');
        data.Items.forEach(item => {
          let element: any[] = [];
          const currentDate: Date = item.CurrDate;

          // calculate the result note and make 'diagnose'
          const temp: number = +item.PHQ_one + +item.PHQ_two + +item.PHQ_three + +item.PHQ_vier +
            +item.PHQ_five + +item.PHQ_six + +item.PHQ_seven + +item.PHQ_eight + +item.PHQ_nine - 9;

          if (temp < 5) {
            result = 'Gesund';
          } else if (temp > 4 && temp < 10) {
            result = 'Unauffällig';
          } else if (temp > 9 && temp < 15) {
            result = 'Leichtgradige Depression';
          } else if (temp > 14 && temp < 20) {
            result = 'Mittelgradige Depression';
          } else if (temp > 19 && temp < 28) {
            result = 'Schwergradige Depression';
          } else {
            result = 'Unklar';
          }

          element = [currentDate, result];
          fir.push(element);
        });
        console.log(' -', fir);
      }
    }

  }
}
