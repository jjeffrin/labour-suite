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

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.checkIfUserLoggedIn().authState.subscribe(user => {
      console.log(user);
      this.userDetails = user;
    });
  }

  signOut() {
    this.authService.signOut().then(() => {
      this.router.navigateByUrl('');
    });
  }

}
