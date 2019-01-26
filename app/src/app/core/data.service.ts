import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { Observable } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class DataService {
   private dynamodb;
   private docClient;
   private params = {
      TableName: 'Fragebogen'
   };
   private readObs = Observable.create(observer => {
      this.docClient.scan(this.params, (err, data) => {
         if (err) {
            observer.error(err);
         } else {
            observer.next(data.Items.map(item => {
               item.Id = new Date(item.Id);
               return item;
            }));
         }
      });
   });

   constructor() {
      // provide your access key and secret access key as obtained in the previous step
      AWS.config.credentials = new AWS.Credentials('AKIAJBIW4UX6CZRCDDDQ', 'vroqTNQtssthG771euWLlN/+u3Q+OCIt3Ftk2wLX', null);
      AWS.config.update({
         region: 'eu-west-1'
      });

      this.dynamodb = new AWS.DynamoDB();
      this.docClient = new AWS.DynamoDB.DocumentClient();
   }

   public getItems(): Observable<any[]> {
      return this.readObs;
   }
}
