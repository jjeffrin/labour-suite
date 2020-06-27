import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
import { AccountingComponent } from './components/accounting/accounting.component';
import { AddNewSourceComponent } from './components/add-new-source/add-new-source.component';
import { AccountingListComponent } from './components/accounting-list/accounting-list.component';
import { ManageSourceComponent } from './components/manage-source/manage-source.component';
import { ManageVehiclesComponent } from './components/manage-vehicles/manage-vehicles.component';
import { AddVehicleComponent } from './components/manage-vehicles/add-vehicle/add-vehicle.component';
import { VehicleListComponent } from './components/manage-vehicles/vehicle-list/vehicle-list.component';
import { UpdateVehicleComponent } from './components/manage-vehicles/update-vehicle/update-vehicle.component';
import { RentalsComponent } from './components/rentals/rentals.component';
import { RentalListComponent } from './components/rentals/rental-list/rental-list.component';
import { AddRentalComponent } from './components/rentals/add-rental/add-rental.component';
import { ManageRentalComponent } from './components/rentals/manage-rental/manage-rental.component';
import { AddRentalRecordComponent } from './components/rentals/add-rental-record/add-rental-record.component';
import { EditRentalRecordComponent } from './components/rentals/edit-rental-record/edit-rental-record.component';
import { MileageComponent } from './components/mileage/mileage.component';
import { MileageListComponent } from './components/mileage/mileage-list/mileage-list.component';
import { ManageMileageComponent } from './components/mileage/manage-mileage/manage-mileage.component';

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
    AccountingComponent,
    AddNewSourceComponent,
    AccountingListComponent,
    ManageSourceComponent,
    ManageVehiclesComponent,
    AddVehicleComponent,
    VehicleListComponent,
    UpdateVehicleComponent,
    RentalsComponent,
    RentalListComponent,
    AddRentalComponent,
    ManageRentalComponent,
    AddRentalRecordComponent,
    EditRentalRecordComponent,
    MileageComponent,
    MileageListComponent,
    ManageMileageComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
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
