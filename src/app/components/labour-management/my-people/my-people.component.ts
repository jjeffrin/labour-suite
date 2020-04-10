import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { LabourType } from '../../../models/LabourType';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-my-people',
  templateUrl: './my-people.component.html',
  styleUrls: ['./my-people.component.css']
})
export class MyPeopleComponent implements OnInit {

  labourList: LabourType[];
  isLoading: boolean;
  currentUser: any;
  groupId: string;
  groupName: string

  constructor(
    private databaseService: DatabaseService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {    
    this.currentUser = localStorage.getItem("currentUser");
    this.route.paramMap.subscribe((data:Params) => {
      this.groupId = data.params.id;
    });
    this.isLoading = true;
    this.databaseService.getPeopleList(this.currentUser, this.groupId).subscribe((data: LabourType[]) => {
      console.log(data);
      this.labourList = data;
      this.isLoading = false;
    });
    this.getGroupName();
  }

  getGroupName() {
    this.databaseService.getCurrentGroupName(this.currentUser, this.groupId).subscribe((data: any) => {
      console.log(data.name);
      this.groupName = data.name;
    });
  }

  deleteLabour(labourId: string) {
    this.databaseService.deleteLabourById(this.currentUser, this.groupId, labourId).then(() => {
      console.log("Deleted");
    }).catch(() => {
      console.log("Failed");
    });
  }

  deleteGroup() {
    this.databaseService.deleteGroupById(this.currentUser, this.groupId).then(() => {
      console.log("Deleted");      
      this.router.navigateByUrl('labour-management');
    }).catch(() => {
      console.log("Failed");
    });
  }

  navigateToLabourManagement() {
    this.router.navigateByUrl('labour-management');
  }
}
