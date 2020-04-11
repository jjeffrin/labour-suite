import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Data } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { SourceType } from 'src/app/models/SourceType';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RecordType } from 'src/app/models/RecordType';

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
    });
  }

  initializeNewRecordForm() {
    this.addNewForm = new FormGroup({
      'description': new FormControl('', [Validators.required]),
      'quantity': new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      'price': new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      'totalPrice': new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")])
    });
  }

  calculateTotalPriceInARecord() {
    let { quantity, price, totalPrice } = this.addNewForm.value;
    totalPrice = quantity * price;
    this.addNewForm.patchValue({ totalPrice: totalPrice });
    console.log(totalPrice);
  }

  clearFormValues() {
    this.addNewForm.reset();
  }

  saveSourceRecord() {
    console.log(this.addNewForm.value);
    this._databaseService.addNewSourceRecord(this.currentUser, this.sourceId, this.addNewForm.value).then(() => {
      console.log("Saved");
    }).catch(() => {
      console.log("Failed");
    });
  }

}
