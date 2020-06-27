import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../../services/database.service';

@Component({
  selector: 'app-rental-list',
  templateUrl: './rental-list.component.html',
  styleUrls: ['./rental-list.component.css']
})
export class RentalListComponent implements OnInit {

  currentUser: string;
  rentalList: any[] = [];
  isLoading: boolean = false;

  constructor(
    private _router: Router,
    private _dbService: DatabaseService
  ) { }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem("currentUser");
    this.getRentals();
  }

  toggleLoading(): void {
    this.isLoading = !this.isLoading;
  }

  navigateToAddNewRental(): void {
    this._router.navigateByUrl('rentals/add-rental');
  }

  getRentals() {
    this.toggleLoading();
    this._dbService.getAllRentals(this.currentUser).subscribe(data => {
      this.rentalList = data;
    });
    this.toggleLoading();
  }

  deleteRental(id: string) {
    this._dbService.deleteRentalById(this.currentUser, id).then(() => {
      console.log("Deleted")
    }).catch(() => {
      console.log("Delete Failed");
    });
  }

}
