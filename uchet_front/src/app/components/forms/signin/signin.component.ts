import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../service/auth.service";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  singForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.auth.signin(this.singForm.value.email, this.singForm.value.password).subscribe(res => {

      localStorage.setItem('logedIn', 'true');
      localStorage.setItem('id', res.id.toString());
      localStorage.setItem('firstname', res.firstname);
      localStorage.setItem('lastname', res.lastname);
      localStorage.setItem('username', res.username);
      localStorage.setItem('email', res.email);
      localStorage.setItem('role', res.role_id.toString());

      document.location.reload(true);
    });
  }

}
