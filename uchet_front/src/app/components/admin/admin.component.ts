import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RestapiService} from "../../service/restapi.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  @Input() companies: Array<any>;
  @Input() statuses: Array<any>;
  @Input() addresses: Array<any>;
  @Input() workList: Array<any>;
  @Input() engineers: Array<any>;
  @Input() deviceList: Array<any>;
  @Input() members: Array<any>;
  @Input() uID: number;
  @Output() elem = new EventEmitter<string>();
  @Output() cid = new EventEmitter<string>();
  curTab: string = '';
  constructor(private _req: RestapiService) { }

  ngOnInit() {
  }

  handleCompany(cid){
    this.cid.emit(cid);
  }

  handleElem(item){
    this.elem.emit(item);
  }

  handleTab(t){
    this.curTab = t;
  }
}
