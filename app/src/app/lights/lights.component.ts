import { Component, OnInit } from '@angular/core';
import jsHue from 'jsHue';

const hue = jsHue();
const username = '';
const user: any = undefined;

@Component({
  selector: 'app-lights',
  templateUrl: './lights.component.html',
  styleUrls: ['./lights.component.css']
})

export class LightComponent implements OnInit {

  bridgeIPs = [];
  myUserName = username;
  user = user;

  constructor() { }

  ngOnInit() { }

  discoverBridges() {
    this.bridgeIPs = [];
    hue.discover().then(bridges => {
      if (bridges.length === 0) {
        console.log('No bridges found. :(');
      } else {
        bridges.forEach(b => {
          console.log('Bridge found at IP address %s.', b.internalipaddress);
          this.bridgeIPs.push(b.internalipaddress);
          console.log('Bridge in array %s.', this.bridgeIPs[0]);
        });
        this.user = hue.bridge(this.bridgeIPs[0]).user(this.myUserName);
        console.log(this.user);
      }
    }).catch(e => console.log('Error finding bridges', e));
  }

  initUser(ip) {
    const bridge = hue.bridge(ip);
    bridge.createUser('myApp#testdevice').then(data => {
      // extract bridge-generated username from returned data
      this.myUserName = data[0].success.username;

      console.log('New username:', this.myUserName);

      // instantiate user object with username
      this.user = bridge.user(this.myUserName);
    });
  }

  lightOn() {
    this.user.setLightState(1, { on: true }).then(data => {
      // process response data, do other things
      console.log(data);
    });
  }

  lightOff() {
    this.user.setLightState(1, { on: false }).then(data => {
      // process response data, do other things
      console.log(data);
    });
  }

}
