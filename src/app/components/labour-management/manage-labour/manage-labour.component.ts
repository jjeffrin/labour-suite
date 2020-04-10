import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute, Params } from '@angular/router';
import { LabourType } from 'src/app/models/LabourType';

@Component({
  selector: 'app-manage-labour',
  templateUrl: './manage-labour.component.html',
  styleUrls: ['./manage-labour.component.css']
})
export class ManageLabourComponent implements OnInit {

  userId: string;
  groupId: string;
  labourId: string;
  labourData: LabourType;
  attendanceState: boolean;
  attendanceList: any[];
  balanceAmount: number;
  
  constructor(
    private databaseService: DatabaseService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {    
    this.userId = localStorage.getItem("currentUser");
    this.route.paramMap.subscribe((data: Params) => {
      console.log(data);
      this.groupId = data.params.id;
      this.labourId = data.params.labourId;
    });
    this.getLabourInfo();
    this.getLabourAttendanceDetails();
  }

  calculateBalanceDetails() {
    console.log("calculate balance")
    let balanceAmountToPay = 0;
    let salaryPaidDays = 0;
    this.attendanceList.forEach((data: any) => { if (data.salary) { salaryPaidDays++; } });
    balanceAmountToPay = (+this.labourData?.salary *( this.attendanceList?.length ?? 0 )) - (+this.labourData?.advance) - (+this.labourData?.salary *( salaryPaidDays ?? 0 ));
    this.balanceAmount = balanceAmountToPay;
    console.log("BALANCE TO PAY: " + balanceAmountToPay); 
  }

  getLabourInfo() {
    this.databaseService.getLabourData(this.userId, this.groupId, this.labourId).subscribe((data: any) => {
      this.labourData = data;
      console.log(data);
    });
  }

  getLabourAttendanceDetails() {
    this.databaseService.getLabourAttendanceInfo(this.userId, this.groupId, this.labourId).subscribe((data: any) => {
      this.attendanceList = data;
      if (this.attendanceList.length != 0) {
        this.checkIfAttendanceAlreadyAdded(data);
      }
      else {
        this.attendanceState = true;
        this.calculateBalanceDetails();
      }      
    }); 
  }

  checkIfAttendanceAlreadyAdded(attendanceData: any[]) {
    console.log(attendanceData);
    let latestAttendanceDate = attendanceData[0].attendanceDate;
    console.log(latestAttendanceDate.split(' ')[1]);
    if (this.labourData.payType == "perDay") {
      if (new Date().toDateString() == latestAttendanceDate) {
        this.attendanceState = false;
      }
      else {
        this.attendanceState = true;
      } 
    }
    else {
      if (this.getMonth(latestAttendanceDate.split(' ')[1]) == (new Date().getMonth()) + 1) {
        this.attendanceState = false;
      }
      else {
        this.attendanceState = true;
      } 
    }      
    this.calculateBalanceDetails();
  }

  addAttendance() {
    console.log("add");
    this.databaseService.addLabourAttendance(this.userId, this.groupId, this.labourId).then(() => {
      console.log("Updated");
    }).catch(() => {
      console.log("Failed");
    });
  }

  paySalary(dayId: string) {
    this.databaseService.paySalaryForDay(this.userId, this.groupId, this.labourId, dayId).then(() => {
      console.log("Updated");
    }).catch(() => {
      console.log("Failed");
    });
  }

  clearAdvance() {
    this.databaseService.clearLabourAdvance(this.userId, this.groupId, this.labourId).then(() => {
      console.log("Updated");
      this.calculateBalanceDetails();
    }).catch(() => {
      console.log("Failed");
    });
  }

  getMonth(month: string): number {
    switch(month) {
      case "Jan":
        return 1;
        break;
      case "Feb":
        return 2;
        break;
      case "Mar":
        return 3;
        break;
      case "Apr":
        return 4;
        break;
      case "May":
        return 5;
        break;
      case "Jun":
        return 6;
        break;  
      case "Jul":
        return 7;
        break;
      case "Aug":
        return 8;
        break;
      case "Sep":
        return 9;
        break;
      case "Oct":
        return 10;
        break;
      case "Nov":
        return 11;
        break;
      case "Dec":
        return 12;
        break;
    }
  }
}
