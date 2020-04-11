import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-add-new-source',
  templateUrl: './add-new-source.component.html',
  styleUrls: ['./add-new-source.component.css']
})
export class AddNewSourceComponent implements OnInit {

  showSuccessMsg: boolean = false;
  isLoading: boolean = false;
  addNewForm: FormGroup;
  currentUser: string;

  constructor(
    private _location: Location,
    private _databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem("currentUser");
    this.addNewForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'location': new FormControl('', [Validators.required]),
      'natureOfWork': new FormControl('', [Validators.required]),
      'advance': new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")])
    });
  }

  goBack(): void {
    this._location.back();
  }

  addNewSource(): void {
    this.isLoading = true;
    this._databaseService.addNewSourceByUserId(this.currentUser, this.addNewForm.value).then(() => {
      this.addNewForm.reset();
      this.isLoading = false;
      this.showSuccessMsg = true;
      setTimeout(() => {
        this.showSuccessMsg = false;
      }, 5000);
    }).catch(() => {
      console.log("Failed");
    });
  }

}
