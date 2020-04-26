import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-vehicles',
  templateUrl: './manage-vehicles.component.html',
  styleUrls: ['./manage-vehicles.component.css']
})
export class ManageVehiclesComponent implements OnInit {

  isLoading: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // Show loading in UI
    this._toggleLoading();
    // Get all vehicles
    this.getVehicles();
    // Stop loading in UI
    this._toggleLoading();
  }

  private _toggleLoading(): void {
    this.isLoading = !this.isLoading;
  }

  getVehicles(): void {

  }
}
