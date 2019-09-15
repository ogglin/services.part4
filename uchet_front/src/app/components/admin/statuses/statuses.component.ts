import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-statuses',
  templateUrl: './statuses.component.html',
  styleUrls: ['./statuses.component.scss']
})
export class StatusesComponent implements OnInit {
  @Input() statuses: Array<any>;
  @Output() item = new EventEmitter<any>();
  statusTitles: string[] = ['id', 'name', 'action'];
  sId: number;
  status = new FormControl('');
  constructor() { }

  ngOnInit() {
  }

  handleEdit(item){
    this.sId = item.id;
    this.status.setValue(item.status);
  }

  handleAdd(){
    let body = [];
    body.push({method: 'add', init:'status', body: {
        status: this.status.value,
      }});
    this.item.emit(body);
  }

  handleSave(){
    let body = [];
    body.push({method: 'save', init:'status', body: {
        id: this.sId,
        status: this.status.value,
      }});
    this.item.emit(body);
  }

  handleDelete(id){
    let body = [];
    body.push({method: 'delete', init:'status', body: {
        id: id
      }});
    this.item.emit(body);
  }

}
