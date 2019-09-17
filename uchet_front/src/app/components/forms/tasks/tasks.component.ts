import {Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {IDevHist, IDevList, IList, ITask} from "../../../service/interfaces.service";
import {MatTableDataSource} from "@angular/material/table";
import {forkJoin, Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {RestapiService} from "../../../service/restapi.service";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  company = new FormControl('');
  address = new FormControl('');
  members: Array<any> =[];
  member = new FormControl('');
  cid: number;
  aid: number;
  status: string;
  statid: number;
  mid: number;
  taskId: number;
  taskTitle = new FormControl('');
  taskDesc = new FormControl('');
  dateLine = new FormControl('');
  dateTime = new FormControl('');
  deadLine = new FormControl('');
  deadTime = new FormControl('');
  taskTable: string[] = ['id', 'task', 'desc', 'company', 'address', 'identification', 'contact', 'position', 'phone',
    'create_time', 'deadline', 'status', 'author'];
  tasksSource: MatTableDataSource<ITask>;
  filteredCompany: Observable<IList[]>;
  filteredAddress: Observable<IList[]>;
  filteredMembers: Observable<IList[]>;
  isAddValid: boolean = true;
  isAdd: boolean = true;

  @Input() tasks: ITask[];
  @Input() companies: Array<any>;
  @Input() statuses: Array<any>;
  @Input() addresses: Array<any>;
  @Input() uID: number;
  @ViewChild(MatPaginator, {static: true}) paginatorTask: MatPaginator;
  @ViewChild(MatSort, {static: true}) sortTask: MatSort;
  @HostListener('click')
  handleValidate() {
    if (this.cid && this.statid && this.taskTitle) {
      this.isAddValid = false;
    }
  }

  constructor(private _req: RestapiService) {

  }

  ngOnInit() {
    this.getTasks();
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
  }

  applyTaskFilter(filterValue: string) {
    this.tasksSource.filter = filterValue.trim().toLowerCase();

    if (this.tasksSource.paginator) {
      this.tasksSource.paginator.firstPage();
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
    if(value) {
       const filretValue = value.toLocaleLowerCase();
      let arr: Array<IList> = [];
      this.members.forEach(val => {
        if(val['name'].toLocaleLowerCase().includes(filretValue)) {
          arr.push(val);
        }
      });
      return arr;
    }
  }


  getAddress(){
    this.address.reset('');
    this._req.getAddresses(this.cid).subscribe(res=>{
      this.addresses = res;
    })
  }

  getMember(){
    this.member.reset('');
    console.log(this.cid, this.aid);
    this._req.getMembers(this.cid, this.aid).subscribe(res => {
      this.members = res;
      console.log(this.members);
    });
  }

  getTasks(cid?, page?, cpp?) {
    this._req.getTasks(cid, page, cpp).subscribe(tasks=>{
      this.tasks = tasks;
      this.tasksSource = new MatTableDataSource<ITask>(this.tasks);
      this.tasksSource.paginator = this.paginatorTask;
      this.tasksSource.sort = this.sortTask;
    });
  }

  tableClick(e){
    console.log(e);
    this.taskId = e.id;
    this.taskTitle.setValue(e.task);
    this.taskDesc.setValue(e.desc);
    this.deadLine.setValue(e.deadline);
    this.deadTime.setValue('12:00');
    this.status = e.status;
    this.company.setValue(e.company);
    this.address.setValue(e.name);
    this.member.setValue(e.contact);
    this.companies.forEach(cid => {
      if(cid.name === e.company) {
        this.cid = cid.id;
        return;
      }
    });
    this.addresses.forEach(adr => {
      if (adr.name === e.name) {
        this.aid = e.id;
        return;
      }
    });
    this.members.forEach(m=>{
      if(m.name === e.name) {
        this.mid = e.id;
        return;
      }
    });
    this.statuses.forEach(s=>{
      if(s.name === e.name) {
        this.statid = e.id;
      }
    });
    this.isAdd = false;
  }

  onChange(e: string, val: any){
    switch (e) {
      case 'cid': this.cid = val; this.getAddress(); return;
      case 'aid': this.aid = val; this.getMember(); return;
      case 'mid': this.mid = val; return;
      case 'statid': this.statid = val; return;
      default: return;
    }
  }

  addTask(){
    const body = {
      task_title: this.taskTitle.value,
      company_id: this.cid,
      company_address_id: this.aid,
      author_id: this.uID,
      status_id: this.statid,
      company_member_id: this.mid,
      deadline: this.deadLine.value.format('YYYY-MM-DD')+'T'+this.deadTime.value+'Z',
      description: this.taskDesc.value,
      date_time: this.dateLine.value.format('YYYY-MM-DD')+'T'+this.dateTime.value+'Z'
    };
    console.log(body);
    this._req.putTask(body).subscribe(result=>{
      console.log(result);
    });
  }

  editTask(){
    if(this.taskId) {
      const body = {
        id: this.taskId,
        task_title: this.taskTitle.value,
        company_id: this.cid,
        company_address_id: this.aid,
        author_id: this.uID,
        status_id: this.statid,
        company_member_id: this.mid,
        deadline: this.deadLine.value.format('YYYY-MM-DD')+'T'+this.deadTime.value+'Z',
        description: this.taskDesc.value,
        date_time: this.dateLine.value.format('YYYY-MM-DD')+'T'+this.dateTime.value+'Z'
      };
      console.log(body);
      this._req.postTask(body).subscribe(result=>{
        console.log(result);
      });
    }
  }
  handleClear() {
    this.company.setValue('');
    this.address.setValue('');
    this.member.setValue('');
    this.taskTitle.reset();
    this.taskDesc.reset();
    this.dateLine.reset();
    this.dateTime.reset();
    this.deadLine.reset();
    this.deadTime.reset();
    this.statid = null;

  }
}
