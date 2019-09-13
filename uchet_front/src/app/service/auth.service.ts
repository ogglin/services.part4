import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";

const url = environment.host;
export interface IUser {
  id: number,
  firstname: string,
  lastname: string,
  username: string,
  phone: string,
  email: string,
  password: string,
  position: string,
  last_login: string,
  status: number,
  role_id: number,
  token: string,
  ip: string,
  createdAt: string,
  updatedAt: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token$ = new BehaviorSubject<string>('');
  userData: IUser;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };
  constructor(private http: HttpClient) { }

  signin(email:string, password:string) :Observable<IUser> {
    const body = {
      email: email,
      password: password
    };
    var fetch:Observable<IUser> = this.http.post<IUser>(url+'signin', body, this.httpOptions);
    fetch.subscribe(res => {
      this.userData = res;
      localStorage.setItem('token', res.token);
      this.token$.next(res.token);
      return res;
    });
    return fetch;
  };

  signup(email, password) {
    const body = {
      email: email,
      password: password
    };
    var fetch:Observable<IUser> = this.http.post<IUser>(url+'signup', body, this.httpOptions);
    fetch.subscribe(res => {
      this.userData = res;
      localStorage.setItem('token', res.token);
      this.token$.next(res.token);
      return res;
    });
    return fetch;
  }
}
