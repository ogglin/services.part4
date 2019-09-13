import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";

export interface ISelect {
  id: number,
  value: string
}

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {
  @Input() data: Array<ISelect>;
  @Input() name: string;
  @Input() controlName:FormControl = new FormControl('');
  filteredOptions: Observable<string[]>;
  dataVals: Array<string> = [];
  constructor() {
  }

  ngOnInit() {
    this.filteredOptions = this.controlName.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  private _filter(value: string): string[] {
    const filretValue = value.toLocaleLowerCase();
    this.data.forEach(e=>{
      this.dataVals.push(e.value);
    });
    return this.dataVals.filter(val => val.toLocaleLowerCase().includes(filretValue));
  }
}
