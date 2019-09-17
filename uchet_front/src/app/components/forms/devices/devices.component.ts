import {Component, HostListener, Input, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {IDevHist, IDevList, IList, ITask} from "../../../service/interfaces.service";
import {MatTableDataSource} from "@angular/material/table";
import {forkJoin, Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {RestapiService} from "../../../service/restapi.service";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {
  company = new FormControl('');
  address = new FormControl('');
  members: Array<any> =[];
  member = new FormControl('');
  deviceL = new FormControl('');
  deviceTypes: Array<string> = ['printer', 'cartridge', 'consumable'];
  workL = new FormControl('');
  works: string = '';
  devices: Array<any> =[];
  cid: number;
  aid: number;
  did: number;
  engid: number;
  statid: number;
  sn = new FormControl('');
  article = new FormControl('');
  invnum = new FormControl('');
  pageCount = new FormControl('');
  scanCount = new FormControl('');
  dateLine = new FormControl('');
  dateTime = new FormControl('');
  devHisTable: string[] = ['id','article','company','device','serial_number','inventory_number','print','scan','resource','partcode',
    'works','expense','summa','date','status','enginer'];
  devHisSource: MatTableDataSource<IDevHist>;
  totalSumma: number = 0;
  deviceExpense: string = '';
  expenseForm = new FormGroup({});
  expense = new FormControl('');
  expenseArr: Array<any> =[];
  expenseCounter = 1;
  formMain = new FormGroup({});
  filteredCompany: Observable<IList[]>;
  filteredAddress: Observable<IList[]>;
  filteredMembers: Observable<IList[]>;
  filteredDeviceList: Observable<IDevList[]>;
  filteredDeviceExpense: Observable<IDevList[]>;
  filteredWorkList: Observable<IList[]>;
  isAddValid: boolean = true;

  @Input() deviceHistory: IDevHist[];
  @Input() companies: Array<any>;
  @Input() statuses: Array<any>;
  @Input() addresses: Array<any>;
  @Input() workList: Array<any>;
  @Input() engineers: Array<any>;
  @Input() deviceList: Array<any>;
  @Input() uID: number;
  @Output() body = new EventEmitter<object>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @HostListener('click')
  handleValidate() {
    if (this.cid && this.did && this.statid && this.engid && (this.pageCount || this.scanCount || this.works)) {
      this.isAddValid = false;
    }
  }

  constructor(private _req: RestapiService) {
  }

  ngOnInit() {
    this.devHisSource = new MatTableDataSource<IDevHist>(this.deviceHistory);
    this.devHisSource.paginator = this.paginator;
    this.devHisSource.sort = this.sort;
    this.filteredCompany = this.company.valueChanges
      .pipe(
        startWith(''),
        map((c) => this._filter(c))
      );
    this.filteredAddress = this.address.valueChanges.pipe(
      startWith(''),
      map((adr) => this._afilter(adr))
    );
    this.filteredMembers = this.member.valueChanges.pipe(
      startWith(''),
      map((m) => this._mfilter(m))
    );
    this.filteredDeviceList = this.deviceL.valueChanges.pipe(
      startWith(''),
      map((dl)=>this._dlfilter(dl))
    );
    this.filteredWorkList = this.workL.valueChanges.pipe(
      startWith(''),
      map((wl)=>this._wfilter(wl))
    );
    this.filteredDeviceExpense = this.expense.valueChanges.pipe(
      startWith(''),
      map((dl)=>this._delfilter(dl))
    );
  }

  applyFilter(filterValue: string) {
    this.devHisSource.filter = filterValue.trim().toLowerCase();

    if (this.devHisSource.paginator) {
      this.devHisSource.paginator.firstPage();
    }
  }

  private _filter(value: string): IList[] {
    const filretValue = value.toLocaleLowerCase();
    let arr: Array<IList> = [];
    this.companies.forEach(val => {
      if(val['name'].toLocaleLowerCase().includes(filretValue)) {
        arr.push(val);
      }
    });
    return arr;
  }

  private _afilter(value: string): IList[] {
    const filretValue = value.toLocaleLowerCase();
    let adr: Array<IList> = [];
    this.addresses.forEach(val => {
      if(val['name'].toLocaleLowerCase().includes(filretValue)) {
        adr.push(val);
      }
    });
    return adr;
  }

  private _mfilter(value: string): IList[] {
    const filretValue = value.toLocaleLowerCase();
    let arr: Array<IList> = [];
    this.members.forEach(val => {
      if(val['name'].toLocaleLowerCase().includes(filretValue)) {
        arr.push(val);
      }
    });
    return arr;
  }

  private _dlfilter(value: string): IDevList[] {
    const filretValue = value.toLocaleLowerCase();
    let arr: Array<IDevList> = [];
    this.deviceList.forEach(val => {
      if(val['device_title'].toLocaleLowerCase().includes(filretValue) && val['device_type'] === 'printer') {
        arr.push(val);
      }
    });
    return arr;
  }

  private _delfilter(value: string): IDevList[] {
    const filretValue = value.toLocaleLowerCase();
    let arr: Array<IDevList> = [];
    this.deviceList.forEach(val => {
      if(val['device_title'].toLocaleLowerCase().includes(filretValue) && val['device_type'] !== 'printer') {
        arr.push(val);
      }
    });
    return arr;
  }

  private _wfilter(value: string): IList[] {
    const filretValue = value.toLocaleLowerCase();
    let arr: Array<IList> = [];
    this.workList.forEach(val => {
      if(val['name'].toLocaleLowerCase().includes(filretValue)) {
        arr.push(val);
      }
    });
    return arr;
  }

  getAddress(){
    this.address.reset('');
    this._req.getAddresses(this.cid).subscribe(res=>{
      this.addresses = res;
      this.address.setValue(this.addresses[0]['name']);
    })
  }

  getMember(){
    this.member.reset('');
    this._req.getMembers(this.cid, this.aid).subscribe(res => {
      this.members = res;
    });
  }

  getDeviceHistory(cid?, page?, cpp?) {
    this._req.getDeviceHistory(cid, page, cpp).subscribe(deviceHistory=>{
      this.deviceHistory = deviceHistory;
    });
  }

  addDeviceHistory(){
    let exp = [];
    this.expenseArr.forEach(el => {
      exp.push('"'+el.title+ ' ' +el.count+ 'шт. по ' +el.price + ' руб."');
    });
    const bObg = {
      company_id: this.cid,
      device_id: this.did,
      status_id: this.statid,
      service_engineer: this.engid,
      list_works: this.works,
      page_count: this.pageCount.value,
      scan_count: this.scanCount.value,
      total_summa: this.totalSumma,
      device_expense: exp,
      date_time: this.dateLine.value.format('YYYY-MM-DD')+'T'+this.dateTime.value+'Z'
    };
    this.body.emit(bObg);
  }

  setWorks(work) {
    if(this.works.length) {
      this.works += ',\n"'+work+'"';
    } else {
      this.works += '"'+work+'"';
    }

  }

  setExpense(title, price){
    if(price === null) {
      price = 0
    }
    this.expenseArr.push({control: 'expns'+this.expenseCounter, title: title, price: price, count: 1});
    this.expenseForm.addControl('expns'+this.expenseCounter, new FormControl(1));
    this.changeExpense('expns'+this.expenseCounter, 1);
    this.expenseCounter += 1;
  }

  changeExpense(control, n){
    this.expenseArr.forEach(el => {
      if(el.control === control) {
        el.count = n;
      }
    });
    let sum:number = 0;
    this.expenseArr.forEach(el=>{
      sum = sum + (parseInt(el.price) * parseInt(el.count));
      return sum;
    });
    this.totalSumma = sum;
  }

  tableClick(e){
    this.companies.forEach(c=>{
      if(c.name === e.company) {
        this.cid = c.id;
        return
      }
    });
    this.deviceList.forEach(d=>{
      if(d.name = e.device) {
        this.did = e.id;
        return
      }
    });
    this.company.setValue(e.company);
    this.getAddress();
    this.deviceL.setValue(e.device);
    this.sn.setValue(e.serial_number);
    this.article.setValue(e.article);
    this.invnum.setValue(e.inventory_number);
    this.pageCount.setValue(e.print);
    this.scanCount.setValue(e.scan);
  }

  onChange(e: string, val: any){
    switch (e) {
      case 'cid': this.cid = val; this.getAddress(); return;
      case 'aid': this.aid = val; this.getMember(); return;
      case 'did': this.did = val; return;
      case 'engid': this.engid = val; return;
      case 'statid': this.statid = val; return;
      default: return;
    }
  }

  onSubmit() {
    console.log(this.company.value);
  }

  handleClear(){
    this.company.setValue('');
    this.address.setValue('');
    this.member.setValue('');
    this.deviceL.setValue('');
    this.sn.reset();
    this.article.reset();
    this.invnum.reset();
    this.pageCount.reset();
    this.scanCount.reset();
    this.workL.setValue('');
    this.works = '';
    this.expense.setValue('');
    this.expenseForm.reset();
    this.totalSumma = 0;
  }
}
