import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { SourceType } from 'src/app/models/SourceType';

@Component({
  selector: 'app-accounting-list',
  templateUrl: './accounting-list.component.html',
  styleUrls: ['./accounting-list.component.css']
})
export class AccountingListComponent implements OnInit {

  currentUser: string;
  isLoading: boolean = false;
  sourceList: SourceType[];

  constructor(
    private _router: Router,
    private _databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem("currentUser");
    this.getAccountingList();
  }

  navigateToAddSource() {
    this._router.navigateByUrl('accounting/add-new-source');
  }

  getAccountingList() {
    this.isLoading = true;
    this._databaseService.getAccountingListByUserId(this.currentUser).subscribe((data: SourceType[]) => {
      console.log(data);
      this.sourceList = data;
      this.isLoading = false;
    });
  }

  deleteSource(sourceId: string) {
    this._databaseService.deleteSourceById(this.currentUser, sourceId).then(() => {
      console.log("Deleted");
    }).catch(() => {
      console.log("Failed");
    });
  }

}
