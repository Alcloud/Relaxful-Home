import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-smart-home',
  templateUrl: './smart-home.component.html',
  styleUrls: ['./smart-home.component.css']
})
export class SmartHomeComponent implements OnInit {

  temperature;
  humidity;
  air_quality;
  brightness;
  temp_array;
  hum_array;
  
  temp: any = [
    {
      "name": "Temp",
      "series": []
    }
  ];

  hum: any = [
    {
      "name": "Hum",
      "series": []
    }
  ];
  
  view: any[] = [];
  
  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }
    return value + '°C';
  }

  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = true;
  xAxisLabel = 'Zeit';
  showYAxisLabel = true;
  yAxisLabel = 'Wert';
  timeline = true;
  autoScale = true;
  
  colorScheme = {
    domain: ['#cc8400', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  
  constructor(private http: HttpClient) { 
    this.view = [innerWidth / 2.2, 400];
  }

  ngOnInit(): void {
    this.http.get('https://konepyatnas.feste-ip.net:43100/json.htm?username=MTIz&password=MTIz&type=devices&rid=51').subscribe(data => {
      let jsonObject = JSON.parse(JSON.stringify(data['result']));
      this.temperature = jsonObject[0].Temp;
    });
    this.http.get('https://konepyatnas.feste-ip.net:43100/json.htm?username=MTIz&password=MTIz&type=devices&rid=59').subscribe(data => {
      let jsonObject = JSON.parse(JSON.stringify(data['result']));
      this.humidity = jsonObject[0].Humidity;
    });
    this.http.get('https://konepyatnas.feste-ip.net:43100/json.htm?username=MTIz&password=MTIz&type=devices&rid=57').subscribe(data => {
      let jsonObject = JSON.parse(JSON.stringify(data['result']));
      this.air_quality = jsonObject[0].Data;
    });
    this.http.get('https://konepyatnas.feste-ip.net:43100/json.htm?username=MTIz&password=MTIz&type=devices&rid=58').subscribe(data => {
      let jsonObject = JSON.parse(JSON.stringify(data['result']));
      this.brightness = jsonObject[0].Data;
    });
    this.http.get('https://konepyatnas.feste-ip.net:43100/json.htm?username=MTIz&password=MTIz&type=graph&sensor=temp&idx=51&range=day').subscribe(data => {
      this.temp_array = JSON.parse(JSON.stringify(data['result']));
      var i:number; 
      if (this.temp_array != null) {
        
        for(i = 0; i<this.temp_array.length; i++) {
          this.temp[0].series.push({"name": new Date(this.temp_array[i].d), "value": this.temp_array[i].te});
       }
      }
      this.temp=[...this.temp];
    });
    this.http.get('https://konepyatnas.feste-ip.net:43100/json.htm?username=MTIz&password=MTIz&type=graph&sensor=temp&idx=59&range=day').subscribe(data => {
      this.hum_array = JSON.parse(JSON.stringify(data['result']));
      var i:number; 
      if (this.hum_array != null) {
        
        for(i = 0; i<this.hum_array.length; i++) {
          this.hum[0].series.push({"name": new Date(this.hum_array[i].d), "value": this.hum_array[i].hu});
       }
      }
      this.hum=[...this.hum];
    });
  }
}
