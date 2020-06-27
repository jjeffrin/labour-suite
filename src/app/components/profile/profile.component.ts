import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { VehicleType } from 'src/app/models/VehicleType';
import { VehicleRemainderType } from 'src/app/models/VehicleRemainderType';
import { RemainderType } from 'src/app/models/RemainderType';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userDetails: any;
  currentUser: string;
  currentUserName: string;
  currentUserImgUrl: string;
  remainderList: RemainderType[] = [];
  driverFee: number;

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getDataFromLocalStorage();
    this.getAllRemainders();
    this.getDriverFee();
  }

  getDataFromLocalStorage(): void {
    this.currentUser = localStorage.getItem("currentUser");
    this.currentUserName = localStorage.getItem("currentUserName");
    this.currentUserImgUrl = localStorage.getItem("currentUserImgUrl");
  }

  getAllRemainders() {
    this.databaseService.getRemainders(this.currentUser).subscribe((data: RemainderType[]) => {
      data.filter(remainder => { new Date(remainder.date) <= new Date() });
    });
  }

  signOut() {
    this.authService.signOut().then(() => {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentUserName");
      localStorage.removeItem("currentUserImgUrl");
      this.router.navigateByUrl('');
    });
  }

  updateRemainder(remainderId: string) {
    // Set active to false and increase the date by a year
    let remainderToUpdate = this.remainderList.filter((remainder) => remainder.id == remainderId);
    // Hard coding - remainderToUpdate[0] because the id of every remainder is unique 
    this.databaseService.updateRemainderById(this.currentUser, remainderToUpdate[0]).then(() => {
      console.log("Remainder updated.");
    }).catch((err) => {
      console.log("Remainder update failed.", err)
    });
  }

  updateDriverFee() {
    console.log(this.driverFee);
    if (this.driverFee == undefined || this.driverFee == null) {
      // Set Driver fee to 0
      this.databaseService.updateDriverFeeByUserId(this.currentUser, 0).then(() => {
        alert("Updated driver fee to " + 0 + " rupee.");
      }).catch(() => {
        alert("Driver fee update failed. Try again.");
      });
    }
    else {
      // Set desired driver fee
      this.databaseService.updateDriverFeeByUserId(this.currentUser, this.driverFee).then(() => {
        alert("Updated driver fee to " + this.driverFee + " rupee.");
      }).catch((err) => {
        alert("Driver fee update failed. Try again.");
        console.log(err);
      });
    }
  }

  getDriverFee() {
    this.databaseService.getDriverFeeByUserId(this.currentUser).subscribe((data: any) => {
      console.log(data);
      if (data == undefined) {
        this.driverFee = 0;
      }
      else {
        this.driverFee = data.value;
      }
    });
  }

}
