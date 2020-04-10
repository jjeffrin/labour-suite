import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.css']
})
export class MyGroupsComponent implements OnInit {

  groupName: string;
  groupList: any[] = [];
  currentUser: string;

  constructor(
    private databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem("currentUser");
    this.getGroups();
  }

  addGroup() {
    if(this.groupName != undefined || this.groupName.trim() != "") {
      this.databaseService.addNewGroup(this.currentUser, this.groupName).then(() => {
        console.log("created");
      }).catch(() => {
        console.log("failed");
      });
    }
  }

  getGroups() {
    this.databaseService.getGroupList(this.currentUser).subscribe(data => {
      this.groupList = data;
    });
  }

  getLabourCountInGroup(groupId: string) {
    return this.databaseService.getLabourCount(this.currentUser, groupId).subscribe(data => {
      console.log(data);
      return data.length;
    });
  }

  deleteGroup() {
    
  }


}
