import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {
  @Input() addresses: Array<any>;
  @Input() companies: Array<any>;
  @Output() item = new EventEmitter<any>();
  company = new FormControl('');
  address = new FormControl('');
  ident = new FormControl('');
  desc = new FormControl('');
  aID: number;
  addressTitle: string[] = ['id', 'name', 'company', 'ident', 'desc', 'action'];
  isValid: boolean = false;
  @HostListener('click')
  handleValidate() {
    if (this.address.value && this.company.value) {
      this.isValid = true;
    }
  }
  constructor() { }

  ngOnInit() {
  }

  handleEdit(item){
    console.log(item);
    this.aID = item.id;
    this.company.setValue(item.company_id);
    this.address.setValue(item.name);
    this.ident.setValue(item.identification);
    this.desc.setValue(item.description);
  }

  handleAdd(){
    let body = [];
    body.push({method: 'add', init:'address', body: {
        company_id: this.company.value,
        name: this.address.value,
        identification: this.ident.value,
        description: this.desc.value
      }});
    this.item.emit(body);
  }

  handleSave(){
    let body = [];
    body.push({method: 'save', init:'address', body: {
        id: this.aID,
        company_id: this.company.value,
        name: this.address.value,
        identification: this.ident.value,
        description: this.desc.value
      }});
    this.item.emit(body);
  }

  handleDelete(id){
    let body = [];
    body.push({method: 'delete', init:'address', body: {
        id: id
      }});
    this.item.emit(body);
  }

}
