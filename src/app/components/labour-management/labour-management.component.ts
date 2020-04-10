import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-labour-management',
  templateUrl: './labour-management.component.html',
  styleUrls: ['./labour-management.component.css']
})
export class LabourManagementComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private linkVisibility: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  navigateToMyPeople() {
    this.router.navigateByUrl("labour-management");
  }

  navigateToAddNewGroup() {
    this.router.navigateByUrl("labour-management/add-new");
  }

}
