import {Component, Input, OnInit} from '@angular/core';
import {RestapiService} from "../../../service/restapi.service";
import {forkJoin} from "rxjs";

import {IDevHist, ITask} from "../../../service/interfaces.service";

@Component({
  selector: 'app-uchet-main',
  templateUrl: './uchet-main.component.html',
  styleUrls: ['./uchet-main.component.scss']
})
export class UchetMainComponent implements OnInit {

  companies: Array<any> =[];
  addresses: Array<any> =[];
  statuses: Array<any> =[];
  deviceList: Array<any> =[];
  workList: Array<any> =[];
  devices: Array<any> =[];
  engineers: Array<any> =[];
  members: Array<any> =[];
  deviceHistory: IDevHist[];
  tasks: ITask[];
  cId: number;
  uID:number = 1;
  isDevice: boolean = true;
  isAdmin: boolean = false;
  isRole: boolean = false;

  constructor(private _req: RestapiService) {
    if(localStorage.getItem('role') === '1' || localStorage.getItem('role') === '2') {
      this.isRole = true;
    }
    _req.getDeviceHistory().subscribe(deviceHistory=>{
      this.deviceHistory = deviceHistory;
    });
    forkJoin(
      this._req.getCompanies(),
      this._req.getStatus(),
      this._req.getDeviceList(),
      this._req.getWorkList(),
      this._req.getDevices(),
      this._req.getEngineers(),
      this._req.getDeviceHistory(),
      this._req.getTasks(),
      this._req.getAddresses(),
    ).subscribe(([companies,statuses,deviceList,workList,devices,engineers,deviceHistory,tasks,addresses]) =>{
      this.companies = companies;
      this.statuses = statuses;
      this.deviceList = deviceList;
      this.workList = workList;
      this.devices = devices;
      this.engineers = engineers;
      this.deviceHistory = deviceHistory;
      this.tasks = tasks;
      this.addresses = addresses;
    });
  }

  ngOnInit() { }

  getMembers(cid){
    this.cId = cid;
    this._req.getMembers(cid).subscribe(result=>{
      this.members = result;
    });
  }

  handleToggle(e) {
    switch (e) {
      case 'dev-task': this.isDevice = !this.isDevice; return;
      case 'admin': this.isAdmin = !this.isAdmin; return;
      default: return;
    }
  }

  addDeviceHistory(body){
    this._req.putDeviceHistory(body).subscribe(res=> {
      this._req.getDeviceHistory().subscribe(deviceHistory=>{
        this.deviceHistory = deviceHistory;
      });
    })
  }

  handleItem(item){
    console.log(item[0]['method'], item[0]['init'], item[0]['body']);
    switch (item[0]['method']) {
      case ('delete'):
        switch (item[0]['init']) {
          case ('company'):
            this._req.deleteCompany(item[0]['body']['id']).subscribe(result=>{
              this._req.getCompanies().subscribe(res => {
                this.companies = res;
              });
            });
            return;
          case ('address'): this._req.deleteAddress(item[0]['body']['id']).subscribe(result=>{
            this._req.getAddresses().subscribe(res=>{
                this.addresses = res;
              });
            });
            return;
          case ('members'): this._req.deleteMember(item[0]['body']['id']).subscribe(result=>{
            this._req.getMembers(this.cId).subscribe(result=>{
                this.members = result;
              });
            });
            return;
          default: return
        }
      case ('add'):
        switch (item[0]['init']) {
          case ('company'):
            this._req.addCompany(item[0]['body']).subscribe(result=>{
              this._req.getCompanies().subscribe(res => {
                this.companies = res;
              });
            });
            return;
          case ('address'): this._req.addAddress(item[0]['body']).subscribe(result=>{
            this._req.getAddresses().subscribe(res=>{
              this.addresses = res;
            });
          });
            return;
          case ('members'): this._req.addMember(item[0]['body']).subscribe(result=>{
            this._req.getMembers(this.cId).subscribe(result=>{
              this.members = result;
            });
          });
            return;
          case ('status'): this._req.addStatus(item[0]['body']).subscribe(result=>{
            this._req.getStatus().subscribe(result=>{
              this.statuses = result;
            });
          });
            return;
          case ('works'): this._req.addWork(item[0]['body']).subscribe(result=>{
            this._req.getWorkList().subscribe(result=>{
              this.workList = result;
            });
          });
            return;
          case ('device'): this._req.addDeviceList(item[0]['body']).subscribe(result=>{
            console.log(item);
            this._req.getDeviceList().subscribe(result=>{
              this.deviceList = result;
            });
          });
            return;
          default: return
        }
      case ('save'):
        switch (item[0]['init']) {
          case ('company'):
            this._req.editCompany(item[0]['body']).subscribe(result=>{
              this._req.getCompanies().subscribe(res => {
                this.companies = res;
              });
            });
            return;
          case ('address'): this._req.editAddress(item[0]['body']).subscribe(result=>{
            this._req.getAddresses().subscribe(res=>{
              this.addresses = res;
            });
          });
            return;
          case ('members'): this._req.editMember(item[0]['body']).subscribe(result=>{
            this._req.getMembers(this.cId).subscribe(result=>{
              this.members = result;
            });
          });
            return;
          case ('device'): this._req.editDeviceList(item[0]['body']).subscribe(result=>{
            this._req.getDeviceList().subscribe(result=>{
              this.deviceList = result;
            });
          });
            return;
          default: return
        }
      default: return;
    }
  }

}
