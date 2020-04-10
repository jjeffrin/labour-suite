import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import 'firebase/firestore';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private database: AngularFirestore,
    private authentication: AngularFireAuth
    ) { }

  checkIfUserLoggedIn() {
    return this.authentication;
  }

  currentUser() {
    return this.authentication.currentUser;
  }

  googleLogin() {
    return this.authentication.signInWithPopup(new auth.GoogleAuthProvider());
  }

  signOut() {
    return this.authentication.signOut();
  }
}
