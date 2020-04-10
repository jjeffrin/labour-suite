import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.css']
})
export class AddNewComponent implements OnInit {

  addNewForm: FormGroup;
  userAdded?: boolean;
  currentUser: any;
  groupId: string;
  showSuccessMsg: boolean = false;
  isLoading: boolean = false;
  constructor(
    private databaseService: DatabaseService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem("currentUser");
    this.route.paramMap.subscribe((data:Params) => {
      this.groupId = data.params.id;
      console.log(this.groupId);
    });
    this.addNewForm = new FormGroup({
      'labourName': new FormControl('', [Validators.required]),
      'payType': new FormControl('perDay'),
      'salary': new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      'advance': new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")])
    });
  }

  addNew() {
    this.isLoading = true;
    console.log(this.addNewForm);
    this.addNewForm.value.attendance = [{
      date: new Date().toDateString(),
      salary: false
    }];
    this.databaseService.addNewLabour(this.currentUser, this.groupId, this.addNewForm.value).then(() => {      
      this.addNewForm.reset();
      this.isLoading = false;
      this.showSuccessMsg = true;
      setTimeout(() => {
        this.showSuccessMsg = false;
      }, 3000);
    }).catch(() => {
      console.log("error");
    });
  }

  navigateToMyPeople() {
    this.location.back();
  }

}
