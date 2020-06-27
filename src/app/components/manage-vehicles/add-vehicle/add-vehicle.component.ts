import { Component, OnInit } from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { VehicleType } from 'src/app/models/VehicleType';
import { DatabaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';
import { range } from 'rxjs';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {

  fcDateValue: NgbDateStruct;
  insuranceDateValue: NgbDateStruct;
  addNewVehicleForm: FormGroup;
  isLoading: boolean = false;
  currentUser: string;
  showSuccessMsg: boolean = false;
  newVehicle: VehicleType = {
    vehicleName: '',
    vehicleNumber: '',
    properties: [],
    fcDate: '',
    insuranceDate: ''
  };

  constructor(
    private _databaseService: DatabaseService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    // Show loading in UI
    this._toggleLoading();
    // Get current user ID
    this.currentUser = localStorage.getItem("currentUser");
    this.initialiseAddNewForm();
    // Stop loading in UI
    this._toggleLoading();
  }

  private _toggleLoading(): void {
    this.isLoading = !this.isLoading;
  }

  initialiseAddNewForm(): void {
    this.addNewVehicleForm = new FormGroup({
      'vehicleName': new FormControl('', [Validators.required]),
      'vehicleNumber': new FormControl('', [Validators.required]),
      'fcDate': new FormControl('', Validators.required),
      'insuranceDate': new FormControl('', Validators.required),
      'properties': new FormArray([
        new FormGroup({
          'property': new FormControl('', Validators.required),
          'price': new FormControl('', Validators.required)
        })
      ])
    });
  }

  addProperty(): void {
    const newPropertyControl = new FormGroup({
      'property': new FormControl('', Validators.required),
      'price': new FormControl('', Validators.required)
    });
    (<FormArray>this.addNewVehicleForm.get('properties')).push(newPropertyControl);
  }

  getProperties() {
    return (<FormArray>this.addNewVehicleForm.get('properties')).controls;
  }

  saveVehicle() {
    this._toggleLoading();
    let vehicleData = this.addNewVehicleForm.value;
    let fcDate = new Date(vehicleData.fcDate.year, vehicleData.fcDate.month-1, vehicleData.fcDate.day).toDateString();
    let insuranceDate = new Date(vehicleData.insuranceDate.year, vehicleData.insuranceDate.month-1, vehicleData.insuranceDate.day).toDateString();
    this.newVehicle.vehicleName = vehicleData.vehicleName;
    this.newVehicle.vehicleNumber = vehicleData.vehicleNumber;
    this.newVehicle.properties = vehicleData.properties;
    this.newVehicle.fcDate = fcDate;
    this.newVehicle.insuranceDate = insuranceDate;
    this._databaseService.saveVehicleByUserId(this.currentUser, this.newVehicle).then(() => {
      //this.addVehicleToRemainders(this.currentUser, this.newVehicle);
      this.addNewVehicleForm.reset();
      this._toggleLoading();
      this.showSuccessMsg = true;
      setTimeout(() => {
        this.showSuccessMsg = false;
      }, 5000);
    }).catch((err) => {
      console.log(err);
      this._toggleLoading();
    });
  }

  async addVehicleToRemainders(userId: string, vehicle: VehicleType) {
    let remainder = {
      title: "Today is FC Date for vehicle " + vehicle.vehicleName + "(" + vehicle.vehicleNumber + ")",
      date: vehicle.fcDate,
      active: false
    };
    await this._databaseService.saveRemainders(userId, remainder).then(() => {
      console.log("FC Remainder added.");
    }).catch((err) => {
      console.log("FC Remainder failed.")
    });
    remainder = {
      title: "Today is Insurance Date for vehicle " + vehicle.vehicleName + "(" + vehicle.vehicleNumber + ")",
      date: vehicle.insuranceDate,
      active: false
    };
    await this._databaseService.saveRemainders(userId, remainder).then(() => {
      console.log("Insurance Remainder added.");
    }).catch((err) => {
      console.log("Insurance Remainder failed.")
    });
  }

  deleteProperty(index: number): void {
    console.log(index);
    (<FormArray>this.addNewVehicleForm.get('properties')).removeAt(index);
  }

  showDeleteButton(): boolean {
    if ((<FormArray>this.addNewVehicleForm.get('properties')).length > 1) {
      return true;
    }
    else {
      return false;
    }
  }

  goBack(): void {
    this._router.navigateByUrl('manage-vehicles');
  }

}
