import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DatabaseService } from '../../../services/database.service';
import { VehicleType } from '../../../models/VehicleType';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-rental-record',
  templateUrl: './add-rental-record.component.html',
  styleUrls: ['./add-rental-record.component.css']
})
export class AddRentalRecordComponent implements OnInit {

  currentUser: string;
  rentalId: string;
  vehicleList: VehicleType[] = [];
  vehicleNameList: string[] = [];
  vehiclePropertyList: any[] = [];
  isVehicleSelected: boolean = false;
  selectedVehicleName: string = 'default';
  selectedVehicleProperty: string = 'default';
  propertyAndPriceString: string;
  selectDate: boolean = false;
  selectedDate: NgbDateStruct;
  includeDriverFee: boolean = false;
  driverFee: number;

  constructor(
    private _router: Router,
    private _aRoute: ActivatedRoute,
    private _dbService: DatabaseService
  ) { }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem("currentUser");
    this.getRentalId();
    this.getAllVehicles();
    this.getDriverFee();
  }

  getDriverFee() {
    this._dbService.getDriverFeeByUserId(this.currentUser).subscribe((data: any) => {
      this.driverFee = data.value;
    });
  }

  getRentalId() {
    this._aRoute.params.subscribe((data: Params) => {
      this.rentalId = data.id;
    });
  }

  goBack() {
    this._router.navigateByUrl('rentals/manage-rental/' + this.rentalId);
  }

  getAllVehicles() {
    this._dbService.getAllVehiclesByUserId(this.currentUser).subscribe((data: VehicleType[]) => {
      this.vehicleList = data;
      this.getVehicleNameList(data);
    });
  }

  getVehicleNameList(vehicleDataList: VehicleType[]) {
    vehicleDataList.forEach((vehicle) => {
      this.vehicleNameList.push(vehicle.vehicleName);
    });
  }

  selectedVehicle(event) {
    console.log(event.target.value);
    this.selectedVehicleProperty = 'default';
    this.selectedVehicleName = event.target.value;
    this.getProperties(this.selectedVehicleName);
  }

  getProperties(vehicleName: string) {
    this.vehiclePropertyList = [];
    this.vehicleList.forEach((vehicle: VehicleType) => {
      if (vehicle.vehicleName == vehicleName) {
        vehicle.properties.forEach(prop => this.vehiclePropertyList.push(prop));
      }
    });
    console.log(this.vehiclePropertyList.length);
  }

  selectedProperty(event: any) {
    let selectedPropertyAndPriceString = event.target.value;
    console.log("STRING: ", selectedPropertyAndPriceString);
    this.propertyAndPriceString = selectedPropertyAndPriceString;
  }

  saveRentalRecord() {
    let newRecord = this.propertyAndPriceString.split(',');
    let property = newRecord[0];
    let price = +newRecord[1];
    let dateToSet = new Date().toDateString();
    if (this.selectedDate && this.selectedDate != undefined) {
      let { year, month, day } = this.selectedDate;
      dateToSet = new Date(year, month-1, day).toDateString();
    }
    if (this.includeDriverFee) {
      price = +price + +this.driverFee;
    }
    this._dbService.saveRentalRecordById(this.currentUser, this.rentalId, this.selectedVehicleName, property, price, dateToSet).then(() => {
      this.goBack();
    }).catch(() => {
      alert("Add failed. Try again.");
    });
  }

  toggleSelectDate() {
    this.selectDate = !this.selectDate;
  }
  toggleDriverFee() {
    this.includeDriverFee = !this.includeDriverFee;
  }

  getDate() {
    if (this.selectDate && this.selectedDate != undefined) {
      let { year, month, day } = this.selectedDate;
      let dateToReturn = new Date(year, month-1, day).toDateString();
      return dateToReturn;
    }
    else {
      return new Date().toDateString();
    }
  }
}
