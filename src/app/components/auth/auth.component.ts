import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(
    private route: Router,
    private authService: AuthService,
    private linkVisibility: DataService
    ) { }

  ngOnInit(): void {
    this.authService.checkIfUserLoggedIn().onAuthStateChanged((user) => {
      if (user) {
        this.route.navigateByUrl('profile');
      }
    });
  }

  loginWithGoogle() {
    this.authService.googleLogin().then((data) => {
      console.log(data.user);
      localStorage.setItem("currentUser", data.user.uid);
    });
  }

}
