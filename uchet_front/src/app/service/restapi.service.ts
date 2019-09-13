import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {IDevHist, ITask} from "./interfaces.service";

@Injectable({
  providedIn: 'root'
})
export class RestapiService {
  url = environment.apiUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') })
  };
  params: string = '?';
  constructor(private http: HttpClient) {

  }
  paginate(page?, cpp?) {
    if(page) {
      this.params = this.params+'page='+page+'&';
    }
    if(cpp) {
      this.params = this.params+'cpp='+cpp+'&';
    }
    return this.params
  }
  getCompanies(): Observable<any[]> {
    return this.http.get<any>(this.url + 'company', this.httpOptions);
  }
  getAddresses(cid?): Observable<any[]> {
    if(cid){
      this.params += '?company_id='+cid
    }
    return this.http.get<any>(this.url + 'address'+this.params, this.httpOptions);
  }
  getMembers(cid, aid?): Observable<any[]> {
    this.params = "?company_id="+cid+'&';
    if(aid) {
      this.params += "address_id="+aid
    }
    return this.http.get<any>(this.url+'members'+this.params, this.httpOptions);
  }
  getStatus(): Observable<any[]> {
    return this.http.get<any>(this.url+'status', this.httpOptions);
  }
  getWorkList(): Observable<any[]> {
    return this.http.get<any>(this.url+'worklist', this.httpOptions);
  }
  getDeviceList(type?, page?, cpp?): Observable<any[]> {
    this.paginate(page, cpp);
    if (type) {
      this.params = '?type='+type;
    }
    return this.http.get<any>(this.url+'devicelist'+this.params, this.httpOptions);
  }
  getDevices(type?, page?, cpp?): Observable<any[]> {
    this.paginate(page, cpp);
    if (type) {
      this.params = '?type='+type;
    }
    return this.http.get<any>(this.url+'device'+this.params, this.httpOptions);
  }
  getEngineers(): Observable<any[]> {
    return this.http.get<any>(this.url+'engineers', this.httpOptions);
  }
  getTasks(cid?, page?, cpp?): Observable<ITask[]> {
    this.paginate(page, cpp);
    if(cid){
      this.params = '?company_id='+cid
    }
    return this.http.get<ITask[]>(this.url+'tasks'+this.params, this.httpOptions);
  }
  getDeviceHistory(cid?, page?, cpp?) :Observable<IDevHist[]> {
    this.paginate(page, cpp);
    if(cid){
      this.params = '?company_id='+cid
    }
    return this.http.get<IDevHist[]>(this.url+'dev-history'+this.params, this.httpOptions);
  }

  putDeviceHistory(body) :Observable<any[]>{
    return this.http.put<any>(this.url+'dev-history',body, this.httpOptions);
  }

  putTask(body) :Observable<any[]>{
    return this.http.put<any>(this.url+'task', body, this.httpOptions);
  }

  postTask(body) :Observable<any[]>{
    return this.http.post<any>(this.url+'task', body, this.httpOptions);
  }
}
