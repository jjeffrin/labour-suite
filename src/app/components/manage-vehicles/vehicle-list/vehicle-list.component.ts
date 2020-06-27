import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { VehicleType } from 'src/app/models/VehicleType';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {

  isLoading: boolean = false;
  currentUser: string;
  vehicleList: VehicleType[] = [];

  constructor(
    private _router: Router,
    private _databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem("currentUser");
    this.getVehicleList();
  }

  private _toggleLoading(): void {
    this.isLoading = !this.isLoading;
  }

  goBack() {
    this._router.navigateByUrl('profile');
  }

  navigateToAddNewVehicle() {
    this._router.navigateByUrl('manage-vehicles/add-vehicle');
  }

  getVehicleList(): void {
    this._toggleLoading();
    this._databaseService.getAllVehiclesByUserId(this.currentUser).subscribe((data) => {
      console.log(data);
      this.vehicleList = data;
    });
    this._toggleLoading();
  }

  deleteVehicle(id: string) {
    this._databaseService.deleteVehicleByVehicleId(this.currentUser, id).then(() => {
      alert("Vehicle deleted");
    }).catch(() => {
      alert("Vehicle delete failed. Try again.");
    });
  }
}
