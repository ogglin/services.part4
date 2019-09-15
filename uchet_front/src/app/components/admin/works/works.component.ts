import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-works',
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.scss']
})
export class WorksComponent implements OnInit {
  @Input() workList: Array<any>;
  @Output() item = new EventEmitter<any>();
  workTitle: string[] = ['id', 'name', 'action'];
  work = new FormControl('');
  wID: number;
  constructor() { }

  ngOnInit() {
  }

  handleEdit(item){
    this.wID = item.id;
    this.work.setValue(item.name);
  }

  handleAdd(){
    let body = [];
    body.push({method: 'add', init:'works', body: {
        name: this.work.value,
      }});
    this.item.emit(body);
  }

  handleSave(){
    let body = [];
    body.push({method: 'save', init:'works', body: {
        id: this.wID,
        name: this.work.value,
      }});
    this.item.emit(body);
  }

  handleDelete(id){
    let body = [];
    body.push({method: 'delete', init:'works', body: {
        id: id
      }});
    this.item.emit(body);
  }

}
