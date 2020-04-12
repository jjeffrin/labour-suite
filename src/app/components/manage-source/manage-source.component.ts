import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Data } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { SourceType } from 'src/app/models/SourceType';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RecordType } from 'src/app/models/RecordType';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

@Component({
  selector: 'app-manage-source',
  templateUrl: './manage-source.component.html',
  styleUrls: ['./manage-source.component.css']
})
export class ManageSourceComponent implements OnInit {

  sourceId: string;
  currentUser: string;
  sourceData: SourceType;
  sourceAdvance: string;
  addNewForm: FormGroup;
  updateForm: FormGroup;
  records: RecordType[];
  recordList: any;
  selectedRecordId: string;
  selectedDate: NgbDateStruct;

  constructor(
    private _location: Location,
    private _activatedRoute: ActivatedRoute,
    private _databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    this.getCurrentUserId();
    this.getSourceIdFromParams();
    this.getSourceDetails();
    this.getRecords();
    this.initializeNewRecordForm();
  }

  goBack() {
    this._location.back();
  }

  getCurrentUserId() {
    this.currentUser = localStorage.getItem("currentUser");
  }

  getSourceIdFromParams() {
    this._activatedRoute.params.subscribe((param: Params) => {
      this.sourceId = param.id;
    });
  }

  getSourceDetails() {
    this._databaseService.getSourceDetailsById(this.currentUser, this.sourceId).subscribe((data: SourceType) => {
      this.sourceData = data;
      this.sourceAdvance = data.advance;
    });
  }

  getRecords() {
    this._databaseService.getAllRecordsBySourceId(this.currentUser, this.sourceId).subscribe((data: RecordType[]) => {
      console.log(data);
      this.records = data;
      let grouped =  _.mapValues(_.groupBy(data, 'date'),
      clist => clist.map(car => _.omit(car, 'date')));
      this.recordList = grouped;
    });
  }

  initializeNewRecordForm() {
    this.addNewForm = new FormGroup({
      'description': new FormControl('', [Validators.required]),
      'quantity': new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      'price': new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      'totalPrice': new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")])
    });
    this.updateForm = new FormGroup({
      'description': new FormControl('', [Validators.required]),
      'quantity': new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      'price': new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      'totalPrice': new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")])
    });
  }

  calculateTotalPriceInARecord(form: FormGroup) {
    let { quantity, price, totalPrice } = form.value;
    totalPrice = quantity * price;
    form.patchValue({ totalPrice: totalPrice });
    console.log(totalPrice);
  }

  clearFormValues(form: FormGroup) {
    form.reset();
  }

  saveSourceRecord() {
    console.log(this.addNewForm.value);
    let date = "";
    if (this.selectedDate != null) {
      let { year, month, day } = this.selectedDate;
      date = new Date(year, month-1, day).toDateString();
    }   
    this._databaseService.addNewSourceRecord(this.currentUser, this.sourceId, this.addNewForm.value, date).then(() => {
      this.addNewForm.reset();
      console.log("Saved");
    }).catch(() => {
      console.log("Failed");
    });
  }

  calculatePerDayExpense(recordDate: string): number {
    let sum = 0;
    this.recordList[recordDate].forEach(element => {
      sum += element.totalPrice;
    });
    return sum;
  }

  calculateBalanceToPay(): string {
    let totalExpenses = 0;
    this.records?.forEach(record => {
      totalExpenses += record.totalPrice;
    });
    return Number(totalExpenses - +this.sourceAdvance).toLocaleString("en-IN");
  }

  fillDataInUpdatePopup(data: any): void {
    this.updateForm.setValue({
      description: data.description,
      quantity: data.quantity,
      price: data.price,
      totalPrice: data.totalPrice
    });
    this.selectedRecordId = data.id;
  }

  updateSourceRecord() {
    this._databaseService.updateSourceRecordByRecordId(this.currentUser, this.sourceId, this.selectedRecordId, this.updateForm.value).then(() => {
      console.log("Saved");
    }).catch(() => {
      console.log("Failed");
    });
  }

  deleteSourceRecord(recordId: string) {
    this._databaseService.deleteSourceRecordByRecordId(this.currentUser, this.sourceId, recordId).then(() => {
      console.log("Deleted")
    }).catch(() => {  
      console.log("Failed");
    });
  }
}
