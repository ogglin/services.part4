import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  @Input() companies: Array<any>;
  @Output() item = new EventEmitter<any>();
  company = new FormControl('');
  cId: number;
  companyTitle: string[] = ['id', 'name', 'action'];
  constructor() { }

  ngOnInit() {
  }

  handleEdit(item){
    this.cId = item.id;
    this.company.setValue(item.name);
  }

  handleAdd(){
    let body = [];
    body.push({method: 'add', init:'company', body: {
        name: this.company.value,
      }});
    this.item.emit(body);
  }

  handleSave(){
    let body = [];
    body.push({method: 'save', init:'company', body: {
        id: this.cId,
        name: this.company.value,
       }});
    this.item.emit(body);
  }

  handleDelete(id){
    let body = [];
    body.push({method: 'delete', init:'company', body: {
        id: id
      }});
    this.item.emit(body);
  }
}
