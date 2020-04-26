import { Component, OnInit } from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {

  fcDateValue: NgbDateStruct;
  insuranceDateValue: NgbDateStruct;
  addNewVehicleForm: FormGroup;
  addNewPropertyForm: FormGroup;
  isLoading: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // Show loading in UI
    this._toggleLoading();
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
    console.log(this.addNewVehicleForm);
  }

}
