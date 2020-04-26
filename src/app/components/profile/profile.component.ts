import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

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

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUserName = localStorage.getItem("currentUserName");
    this.currentUserImgUrl = localStorage.getItem("currentUserImgUrl");
  }

  signOut() {
    this.authService.signOut().then(() => {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentUserName");
      localStorage.removeItem("currentUserImgUrl");
      this.router.navigateByUrl('');
    });
  }

}
