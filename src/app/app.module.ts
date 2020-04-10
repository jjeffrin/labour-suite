import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

// Components
import { AppComponent } from './app.component';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { AuthComponent } from './components/auth/auth.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LabourManagementComponent } from './components/labour-management/labour-management.component';

// Services
import { AuthService } from './services/auth.service';
import { ProfileComponent } from './components/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalNotesComponent } from './components/personal-notes/personal-notes.component';
import { AddNewComponent } from './components/labour-management/add-new/add-new.component';
import { MyPeopleComponent } from './components/labour-management/my-people/my-people.component';
import { ManageLabourComponent } from './components/labour-management/manage-labour/manage-labour.component';
import { MyGroupsComponent } from './components/labour-management/my-groups/my-groups.component';

@NgModule({
  declarations: [
    AppComponent,
    WrapperComponent,
    AuthComponent,
    NavbarComponent,
    LabourManagementComponent,
    ProfileComponent,
    PersonalNotesComponent,
    AddNewComponent,
    MyPeopleComponent,
    ManageLabourComponent,
    MyGroupsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'labour-suite'),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
