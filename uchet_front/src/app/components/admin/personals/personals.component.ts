import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-personals',
  templateUrl: './personals.component.html',
  styleUrls: ['./personals.component.scss']
})
export class PersonalsComponent implements OnInit {
  @Input() companies: Array<any>;
  @Input() members: Array<any>;
  @Input() addresses: Array<any>;
  @Output() cid = new EventEmitter<number>();
  @Output() item = new EventEmitter<any>();
  membersTitle: string[] = ['id', 'name', 'position', 'phone', 'address', 'action'];
  fio = new FormControl('');
  address = new FormControl('');
  position = new FormControl('');
  phone = new FormControl('');
  cId: number;
  mID: number;
  isValid: boolean = false;
  @HostListener('click', ['$event.target'])
  handleValidate() {
    if (this.cId) {
      this.isValid = true;
    }
  }
  constructor() { }

  ngOnInit() {
  }

  handleAdd(){
    let body = [];
    body.push({method: 'add', init:'members', body: {
      name: this.fio.value,
      company_id: this.cId,
      position: this.position.value,
      phone: this.phone.value,
      address_id: this.address.value
    }});
    this.item.emit(body);
  }

  handleSave(){
    let body = [];
    body.push({method: 'save', init:'members', body: {
        id: this.mID,
        name: this.fio.value,
        company_id: this.cId,
        position: this.position.value,
        phone: this.phone.value,
        address_id: this.address.value
      }});
    this.item.emit(body);
  }

  handleDelete(id){
    let body = [];
    body.push({method: 'delete', init:'members', body: {
        id: id
      }});
    this.item.emit(body);
  }

  handleCompany(id: number){
    this.cId = id;
    this.cid.emit(id);
  }

  handlePerson(item){
    this.mID = item.id;
    this.fio.setValue(item.name);
    this.position.setValue(item.position);
    this.phone.setValue(item.phone);
    this.address.setValue(item.address_id);
  }
}
