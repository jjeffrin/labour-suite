import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mileage-list',
  templateUrl: './mileage-list.component.html',
  styleUrls: ['./mileage-list.component.css']
})
export class MileageListComponent implements OnInit {

  currentUser: string;
  vehicleList: any[] = [];
  vehicleNameList: any[] = [];
  selectedVehicle: string = "default";
  mileageList: any[] = [];

  constructor(
    private _dbService: DatabaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem("currentUser");
    this.getAllVehicleList();
    this.getMileageList();
  }

  getAllVehicleList() {
    this._dbService.getAllVehiclesByUserId(this.currentUser).subscribe((data: any) => {
      this.vehicleList = data;
      this.prepareVehicleNameList(data);
      console.log(data);
    });
  }

  prepareVehicleNameList(vehicles: any[]) {
    vehicles.forEach((vehicle) => {
      this.vehicleNameList.push(vehicle.vehicleName);
    });
    console.log(this.vehicleNameList);
  }

  getMileageList() {
    this._dbService.getAllMileageList(this.currentUser).subscribe((data: any) => {
      this.mileageList = data;
      //this.removeDuplicateVehicleNames();
      console.log(this.mileageList);
    });
  }

  removeDuplicateVehicleNames() {
    for(let index=0;index<this.vehicleNameList.length;index++) {
      for(let counter=0;counter<this.mileageList.length;counter++) {
        if (this.mileageList[counter].name == this.vehicleNameList[index]) {
          delete this.vehicleNameList[index];
        }
      }
    }
    console.log(this.vehicleNameList);
  }

  checkSelectedVehicleIsInMileageList(): boolean {
    let stateToReturn = false;
    for (let index = 0; index < this.mileageList.length; index++) {
      if (this.mileageList[index].name == this.selectedVehicle) {
        stateToReturn = true;
        break;
      }
    }
    return stateToReturn;
  }

  addMileage() {
    if (this.checkSelectedVehicleIsInMileageList()) {
      alert("This vehicle is already added in the mileage list!");
    }
    else {
      this._dbService.addToMileageList(this.currentUser, this.selectedVehicle).then(() => {
        alert("New vehicle added to mileage records");
        this.selectedVehicle = 'default';
      }).catch(() => {
        alert("Add failed. Try again");
      });
    }
  }

  navigateToManage(id: string) {
    console.log(id);
    // this.router.navigateByUrl('/manage-mileage/'+id);
  }

}
