import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-devices-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['./devices-list.component.scss']
})
export class DevicesListComponent implements OnInit {
  @Input() deviceList: Array<any>;
  @Output() item = new EventEmitter<any>();
  dId: number;
  device = new FormControl('');
  resource = new FormControl('');
  partcode = new FormControl('');
  price = new FormControl('');
  type = new FormControl('');
  deviceTitle: string[] = ['id', 'device_title', 'device_resource', 'device_partcode', 'device_price', 'device_type', 'action'];
  constructor() { }

  ngOnInit() {
  }

  handleEdit(item){
    this.dId = item.id;
    this.device.setValue(item.device_title);
    this.resource.setValue(item.device_resource);
    this.partcode.setValue(item.device_partcode);
    this.price.setValue(item.device_price);
    this.type.setValue(item.device_type);
  }

  handleAdd(){
    let body = [];
    body.push({method: 'add', init:'device', body: {
        device_title: this.device.value,
        device_resource: this.resource.value,
        device_partcode: this.partcode.value,
        device_price: this.price.value,
        device_type: this.type.value
      }});
    this.item.emit(body);
  }

  handleSave(){
    let body = [];
    body.push({method: 'save', init:'device', body: {
        id: this.dId,
        device_title: this.device.value,
        device_resource: this.resource.value,
        device_partcode: this.partcode.value,
        device_price: this.price.value,
        device_type: this.type.value
      }});
    this.item.emit(body);
  }

  handleDelete(id){
    let body = [];
    body.push({method: 'delete', init:'device', body: {
        id: id
      }});
    this.item.emit(body);
  }
}
