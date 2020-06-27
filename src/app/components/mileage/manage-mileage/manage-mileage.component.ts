import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-manage-mileage',
  templateUrl: './manage-mileage.component.html',
  styleUrls: ['./manage-mileage.component.css']
})
export class ManageMileageComponent implements OnInit {

  isLoading: boolean = false;
  currentUser: string;
  vehicleId: string;
  vehicleName: string;
  amount: number;
  reading: number;
  litre: number;
  records: any[] = [];

  constructor(
    private _router: Router,
    private _dbService: DatabaseService,
    private urlDetails: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem("currentUser");
    this.getVehicleIdFromURL();
    this.getVehicleName();
  }

  getVehicleIdFromURL() {
    this.urlDetails.params.subscribe((data: Params) => {
      this.vehicleId = data.id;
    });
  }

  getVehicleName() {
    this._dbService.getVehicleNameByMileageId(this.currentUser, this.vehicleId).subscribe((data: any) => {
      console.log(data);
      this.vehicleName = data.name;
      this.getAllRecords();
    });
  }

  getAllRecords() {
    this._dbService.getAllMileageRecordsByVehicleId(this.currentUser, this.vehicleId).subscribe((data: any[]) => {
      this.records = data;
      this.calculateMileage();
      console.log(this.records);
    });
  }

  addNewRecord() {
    this._dbService.addNewMileageRecord(this.currentUser, this.vehicleId, this.amount, this.reading, this.litre).then(() => {
      alert("Record added successfully.");
      this.amount = undefined;
      this.reading = undefined;
      this.litre = undefined;
    }).catch(() => {
      alert("Failed to add record.");
    });
  }

  goBack() {
    this._router.navigateByUrl('mileage');
  }

  checkAddButtonState() {
    if (this.amount == undefined || this.reading == undefined || this.litre == undefined || this.amount.toString() == '' || this.reading.toString() == '' || this.litre.toString() == '') {
      return true;
    }
    return false;
  }

  calculateMileage() {
    if (this.records.length > 1) {
      for (let index = 0; index < this.records.length-1; index++) {
        let kmDiff = this.records[index+1].reading - this.records[index].reading;
        console.log(kmDiff);
        this.records[index+1].mileage = Math.round(((kmDiff/this.records[index+1].litre) + Number.EPSILON) * 100) / 100;
      }
    }
  }

  calculateAvgMileage() {
    let avgVal = 0;
    if (this.records.length == 1) return 0;
    this.records.forEach(rec => avgVal += rec.mileage);
    let valToReturn = avgVal/(this.records.length-1);
    return Math.round((valToReturn + Number.EPSILON) * 100) / 100;
  }

  calculateTotalAmountSpentInFuel() {
    let totAmt = 0;
    this.records.forEach(rec => totAmt += rec.amount);
    return totAmt;
  }
}
