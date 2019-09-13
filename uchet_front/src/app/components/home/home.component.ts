import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isSignIn: boolean = false;

  constructor() {
    if(localStorage.getItem('logedIn') === 'true'){
      this.isSignIn = true
    }
  }

  ngOnInit() {
  }

}
