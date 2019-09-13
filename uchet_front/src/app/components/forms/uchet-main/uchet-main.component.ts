import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {RestapiService} from "../../../service/restapi.service";
import {FormControl, FormGroup} from "@angular/forms";
import {forkJoin, Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";

import {IDevHist, IDevList, IList, ITask} from "../../../service/interfaces.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-uchet-main',
  templateUrl: './uchet-main.component.html',
  styleUrls: ['./uchet-main.component.scss']
})
export class UchetMainComponent implements OnInit {
  companies: Array<any> =[];
  addresses: Array<any> =[];
  members: Array<any> =[];
  statuses: Array<any> =[];
  deviceList: Array<any> =[];
  workList: Array<any> =[];
  devices: Array<any> =[];
  engineers: Array<any> =[];
  deviceHistory: IDevHist[];
  tasks: ITask[];
  uID:number = 1;
  isDevice: boolean = true;

  constructor(private _req: RestapiService) {
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
    ).subscribe(([companies,statuses,deviceList,workList,devices,engineers,deviceHistory,tasks]) =>{
      this.companies = companies;
      this.statuses = statuses;
      this.deviceList = deviceList;
      this.workList = workList;
      this.devices = devices;
      this.engineers = engineers;
      this.deviceHistory = deviceHistory;
      this.tasks = tasks;
    });
  }

  ngOnInit() {

  }


  handleToggle(e) {
    switch (e) {
      case 'dev-task': this.isDevice = !this.isDevice; return;
    }
  }

  addDeviceHistory(body){

    this._req.putDeviceHistory(body).subscribe(res=> {
      this._req.getDeviceHistory().subscribe(deviceHistory=>{
        this.deviceHistory = deviceHistory;
      });

    })
  }

}
