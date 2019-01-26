import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'relaxful-home';
  constructor(private router: Router) { }

  ngOnInit() {
  }

  checkValues() {
    this.router.navigate(['/values']);
  }
  enableLights() {
    this.router.navigate(['/lights']);
  }
  checkSmartHomeValues() {
    this.router.navigate(['/smarthome']);
  }

  /**
   * add a route to the google fit page
   */
  checkFit() {
    this.router.navigate(['/myfit']);
  }

}
