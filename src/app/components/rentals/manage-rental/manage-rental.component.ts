import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RentalType } from '../../../models/RentalType';
import { DatabaseService } from '../../../services/database.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-manage-rental',
  templateUrl: './manage-rental.component.html',
  styleUrls: ['./manage-rental.component.css']
})
export class ManageRentalComponent implements OnInit {

  isLoading: boolean = false;
  currentUser: string;
  rentalId: string;
  rentalDetails: RentalType;
  rentalRecords: any;
  records: any[] = [];

  constructor(
    private _router: Router,
    private _aRoute: ActivatedRoute,
    private _dbService: DatabaseService
  ) { }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem("currentUser");
    this.getRentalId();
    this.getRentalRecords();
  }

  private _toggleLoading(): void {
    this.isLoading = !this.isLoading;
  }

  goBack() {
    this._router.navigateByUrl('rentals');
  }

  addNewRecord(): void {
    this._router.navigateByUrl('rentals/manage-rental/' + this.rentalId + '/add-rental-record');
  }

  getRentalId() {
    this._aRoute.params.subscribe((data: Params) => {
      this.rentalId = data.id;
      this.getRentalDetails();
    });
  }

  getRentalDetails() {
    this._dbService.getRentalInfoById(this.currentUser, this.rentalId).subscribe((data: RentalType) => {
      this.rentalDetails = data;
    });
  }

  getRentalRecords() {
    this._dbService.getRentalRecordsByRentalId(this.currentUser, this.rentalId).subscribe((data) => {
      this.records = data;
      let grouped =  _.mapValues(_.groupBy(data, 'recordDate'),
      clist => clist.map(car => _.omit(car, 'recordDate')));
      this.rentalRecords = grouped;
      console.log(this.rentalRecords);
    });
  }

  calculatePerDayExpense(recordDate: string): number {
    let sum = 0;
    this.rentalRecords[recordDate].forEach(element => {
      sum += element.price;
    });
    return sum;
  }

  deleteRentalRecord(recordId: string) {
    this._dbService.deleteRentalRecordById(this.currentUser, this.rentalId, recordId).then(() => {
      console.log("Deleted")
    }).catch(() => {  
      console.log("Failed");
    });
  }

  completeRentalRecord(recordId: string) {
    this._dbService.completeRentalRecordById(this.currentUser, this.rentalId, recordId).then(() => {
      alert("Updated.");
    }).catch(() => {
      alert("Update failed");
    });
  }

  calculatePendingAmount() {
    let sum = 0;
    this.records.forEach((rec) => {
      if (!rec.isComplete) {
        sum += rec.price;
      }
    });
    return sum;
  }


}
