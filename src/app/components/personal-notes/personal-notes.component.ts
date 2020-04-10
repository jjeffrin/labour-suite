import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-personal-notes',
  templateUrl: './personal-notes.component.html',
  styleUrls: ['./personal-notes.component.css']
})
export class PersonalNotesComponent implements OnInit {
  content: any;
  contentList: any;
  currentUser: any;

  constructor(
    private database: DatabaseService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem("currentUser");
    this.database.getPersonalContent(this.currentUser).subscribe(data => {
      this.contentList = data;      
    console.log(this.contentList);
    });
  }

  saveContent() {
    if(this.content != undefined && this.content.trim() != "") {
      this.database.savePersonalContent(this.currentUser, this.content).then(data => {
        console.log(data);
      })
    }
  }

}
