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
  constructor(private http: HttpClient) {

  }
  paginate(page?, cpp?) {
    let params: string = '?';
    if(page) {
      params = params+'page='+page+'&';
    }
    if(cpp) {
      params = params+'cpp='+cpp+'&';
    }
    return params
  }
  getCompanies(): Observable<any[]> {
    return this.http.get<any>(this.url + 'company', this.httpOptions);
  }
  getAddresses(cid?): Observable<any[]> {
    let params: string = '?';
    if(cid){
      params += 'company_id='+cid
    }
    return this.http.get<any>(this.url + 'address'+params, this.httpOptions);
  }
  getMembers(cid, aid?): Observable<any[]> {
    let params = "company_id="+cid+'&';
    if(aid) {
      params += "address_id="+aid
    }
    return this.http.get<any>(this.url+'members'+params, this.httpOptions);
  }
  getStatus(): Observable<any[]> {
    return this.http.get<any>(this.url+'status', this.httpOptions);
  }
  getWorkList(): Observable<any[]> {
    return this.http.get<any>(this.url+'worklist', this.httpOptions);
  }
  getDeviceList(type?, page?, cpp?): Observable<any[]> {
    this.paginate(page, cpp);
    let params: string = '?';
    if (type) {
      params = 'type='+type;
    }
    return this.http.get<any>(this.url+'devicelist'+params, this.httpOptions);
  }
  getDevices(type?, page?, cpp?): Observable<any[]> {
    this.paginate(page, cpp);
    let params: string = '?';
    if (type) {
      params = 'type='+type;
    }
    return this.http.get<any>(this.url+'device'+params, this.httpOptions);
  }
  getEngineers(): Observable<any[]> {
    return this.http.get<any>(this.url+'engineers', this.httpOptions);
  }
  getTasks(cid?, page?, cpp?): Observable<ITask[]> {
    this.paginate(page, cpp);
    let params: string = '?';
    if(cid){
      params = 'company_id='+cid
    }
    return this.http.get<ITask[]>(this.url+'tasks'+params, this.httpOptions);
  }
  getDeviceHistory(cid?, page?, cpp?) :Observable<IDevHist[]> {
    this.paginate(page, cpp);
    let params: string = '?';
    if(cid){
      params = 'company_id='+cid
    }
    return this.http.get<IDevHist[]>(this.url+'dev-history'+params, this.httpOptions);
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

  addCompany(body) :Observable<any[]>{
    return this.http.put<any>(this.url+'company', body, this.httpOptions);
  }
  editCompany(body) :Observable<any[]>{
    return this.http.post<any>(this.url+'company', body, this.httpOptions);
  }
  deleteCompany(id) :Observable<any[]>{
    return this.http.delete<any>(this.url+'company?id='+id, this.httpOptions);
  }

  addAddress(body) :Observable<any[]>{
    return this.http.put<any>(this.url+'address', body, this.httpOptions);
  }
  editAddress(body) :Observable<any[]>{
    return this.http.post<any>(this.url+'address', body, this.httpOptions);
  }
  deleteAddress(id) :Observable<any[]>{
    return this.http.delete<any>(this.url+'address?id='+id, this.httpOptions);
  }

  addMember(body) :Observable<any[]>{
    return this.http.put<any>(this.url+'members', body, this.httpOptions);
  }
  editMember(body) :Observable<any[]>{
    return this.http.post<any>(this.url+'members', body, this.httpOptions);
  }
  deleteMember(id) :Observable<any[]>{
    return this.http.delete<any>(this.url+'members?id='+id, this.httpOptions);
  }

  addStatus(body) :Observable<any[]>{
    return this.http.put<any>(this.url+'status', body, this.httpOptions);
  }

  addWork(body) :Observable<any[]>{
    return this.http.put<any>(this.url+'worklist', body, this.httpOptions);
  }

  addDeviceList(body) :Observable<any[]>{
    return this.http.put<any>(this.url+'devicelist', body, this.httpOptions);
  }
  editDeviceList(body) :Observable<any[]>{
    return this.http.post<any>(this.url+'devicelist', body, this.httpOptions);
  }
}
