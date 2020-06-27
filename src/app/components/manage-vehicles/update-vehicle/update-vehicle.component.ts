import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DatabaseService } from '../../../services/database.service';
import { VehicleType } from '../../../models/VehicleType';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { NgbDateStructAdapter } from '@ng-bootstrap/ng-bootstrap/datepicker/adapters/ngb-date-adapter';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { RemainderType } from '../../../models/RemainderType';

@Component({
  selector: 'app-update-vehicle',
  templateUrl: './update-vehicle.component.html',
  styleUrls: ['./update-vehicle.component.css']
})
export class UpdateVehicleComponent implements OnInit {

  currentUser: string;
  vehicleId: string;
  vehicleData: VehicleType;
  isLoading: boolean = false;
  vehicleForm: FormGroup;
  fcDateToSet: NgbDate;
  insuranceDateToSet: NgbDate;
  showSuccessMsg: boolean;
  formBuilder: FormBuilder = new FormBuilder();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _databaseService: DatabaseService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    // Toggle loading
    this.toggleLoading();
    // Initialise the form
    this.initialiseAddNewForm();
    // Get Current User Id
    this.getCurrentUserId();
    // Get vehicle Id from router params
    this.getVehicleIdFromRouterParams();
    // Get vehicle details from db
    this.getVehicleDetails();
    // Toggle loading
    this.toggleLoading();
  }

  initialiseAddNewForm(): void {
    this.vehicleForm = new FormGroup({
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

  readyDateValuesToSetInForm() {
    let fcDate = new Date(this.vehicleData.fcDate);
    let insuranceDate = new Date(this.vehicleData.insuranceDate);
    this.fcDateToSet = new NgbDate(fcDate.getFullYear(), fcDate.getMonth(), fcDate.getDate());
    this.insuranceDateToSet = new NgbDate(insuranceDate.getFullYear(), insuranceDate.getMonth(), insuranceDate.getDate());
  }

  setBasePropValuesToForm(): void {
    this.readyDateValuesToSetInForm();
    this.vehicleForm.patchValue({
      vehicleName: this.vehicleData.vehicleName,
      vehicleNumber: this.vehicleData.vehicleNumber,
      fcDate: this.fcDateToSet,
      insuranceDate: this.insuranceDateToSet
    });
    this.vehicleForm.setControl("properties", this.getPropertyValues(this.vehicleData));
    console.log((<FormArray>this.vehicleForm.get('properties')).controls);
  }

  getPropertyValues(vehicleData: VehicleType): FormArray {
    const formArray = new FormArray([]);
    vehicleData.properties.forEach(prop => {
      formArray.push(this.formBuilder.group({
        property: prop.property,
        price: prop.price
      }));
    });
    return formArray;
  }

  getCurrentUserId(): void {
    this.currentUser = localStorage.getItem("currentUser");
  }

  getVehicleIdFromRouterParams(): void {
    this._activatedRoute.params.subscribe((param: Params) => {
      this.vehicleId = param.vehicleId;
    });
  }

  getProperties() {
    return (<FormArray>this.vehicleForm.get('properties')).controls;
  }

  showDeleteButton(): boolean {
    if ((<FormArray>this.vehicleForm.get('properties')).length > 1) {
      return true;
    }
    else {
      return false;
    }
  }

  deleteProperty(index: number): void {
    console.log(index);
    (<FormArray>this.vehicleForm.get('properties')).removeAt(index);
  }

  addProperty(): void {
    const newPropertyControl = new FormGroup({
      'property': new FormControl('', Validators.required),
      'price': new FormControl('', Validators.required)
    });
    (<FormArray>this.vehicleForm.get('properties')).push(newPropertyControl);
  }

  getVehicleDetails(): void {
    this._databaseService.getVehicleDetailsById(this.currentUser, this.vehicleId).subscribe((data: VehicleType) => {
      this.vehicleData = data;
      console.log(this.vehicleData);
      // Fill vehicle details in form
      this.setBasePropValuesToForm();
    });
  }

  goBack(): void {
    this._location.back();
  }

  toggleLoading(): void {
    this.isLoading = !this.isLoading;
  }

  updateVehicle(): void {
    this.toggleLoading();
    let vehicleData = this.vehicleForm.value;
    let fcDate = new Date(vehicleData.fcDate.year, vehicleData.fcDate.month - 1, vehicleData.fcDate.day).toDateString();
    let insuranceDate = new Date(vehicleData.insuranceDate.year, vehicleData.insuranceDate.month - 1, vehicleData.insuranceDate.day).toDateString();
    this.vehicleForm.patchValue({
      fcDate: fcDate,
      insuranceDate: insuranceDate
    });
    this._databaseService.updateVehicleByUserId(this.currentUser, this.vehicleId, this.vehicleForm.value).then(() => {
      //this.updateVehileRemainders(this.currentUser, this.newVehicle);
      this.vehicleForm.reset();
      this.toggleLoading();
      this.showSuccessMsg = true;
      this.goBack();
      setTimeout(() => {
        this.showSuccessMsg = false;
      }, 5000);
    }).catch((err) => {
      console.log(err);
      this.toggleLoading();
    });
  }

  updateFormArrayState(): void {
    const formArray = <FormArray>this.vehicleForm.get('properties');
    console.log(formArray);
    formArray.markAsTouched();
    formArray.markAsDirty();
  }

  //updateVehicleRemainders(): void {
  //  // Get all remainders
  //  this._databaseService.getRemainders(this.currentUser).subscribe((remainders: RemainderType[]) => {
  //    remainders.forEach(remainder => {
  //      if (remainder.title.includes(this.ve))
  //    });
  //  });
  //  // Loop through and get the remainders assoc with vehicleId
  //  // Make update if the values are different
  //  // If differnet Save to db
  //}

}
