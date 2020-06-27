import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../../services/database.service';

@Component({
  selector: 'app-add-rental',
  templateUrl: './add-rental.component.html',
  styleUrls: ['./add-rental.component.css']
})
export class AddRentalComponent implements OnInit {

  currentUser: string;
  name: string;
  natureOfWork: string;
  location: string;

  constructor(
    private _router: Router,
    private _databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem("currentUser");
  }

  goBack() {
    this._router.navigateByUrl('rentals');
  }

  addRental() {
    if (this.name != undefined && this.natureOfWork != undefined && this.location != undefined) {
      if (this.name.trim() != '' && this.natureOfWork.trim() != '' && this.location.trim() != '') {
        this._databaseService.addNewRental(this.currentUser, this.name, this.natureOfWork, this.location).then(() => {
          this.goBack();
        }).catch(() => {
          alert("Failed to add.");
        });
      }
    }
    else {
      alert("All fields are required.");
    }
  }
}
