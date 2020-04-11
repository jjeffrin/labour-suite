import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Data } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { SourceType } from 'src/app/models/SourceType';

@Component({
  selector: 'app-manage-source',
  templateUrl: './manage-source.component.html',
  styleUrls: ['./manage-source.component.css']
})
export class ManageSourceComponent implements OnInit {

  sourceId: string;
  currentUser: string;
  sourceData: SourceType;
  sourceAdvance: string;

  constructor(
    private _location: Location,
    private _activatedRoute: ActivatedRoute,
    private _databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    this.getCurrentUserId();
    this.getSourceIdFromParams();
    this.getSourceDetails();
  }

  goBack() {
    this._location.back();
  }

  getCurrentUserId() {
    this.currentUser = localStorage.getItem("currentUser");
  }

  getSourceIdFromParams() {
    this._activatedRoute.params.subscribe((param: Params) => {
      this.sourceId = param.id;
    });
  }

  getSourceDetails() {
    this._databaseService.getSourceDetailsById(this.currentUser, this.sourceId).subscribe((data: SourceType) => {
      this.sourceData = data;
      this.sourceAdvance = data.advance;
    });
  }

}
