import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { AuthComponent } from './components/auth/auth.component';
import { LabourManagementComponent } from './components/labour-management/labour-management.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PersonalNotesComponent } from './components/personal-notes/personal-notes.component';
import { MyPeopleComponent } from './components/labour-management/my-people/my-people.component';
import { AddNewComponent } from './components/labour-management/add-new/add-new.component';
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

const appRoutes: Routes = [
    {
        path: '',
        component: WrapperComponent,
        children: [
            {
                path: '',
                component: AuthComponent
            },
            {
                path: 'labour-management',
                component: LabourManagementComponent,
                children: [
                    {
                        path: '',
                        component: MyGroupsComponent
                    },
                    {
                        path: 'group/:id/add-new',
                        component: AddNewComponent
                    },
                    {
                        path: 'manage/:id',
                        component: ManageLabourComponent
                    },
                    {
                        path: 'group/:id',
                        component: MyPeopleComponent
                    },
                    {
                        path: 'group/:id/manage/:labourId',
                        component: ManageLabourComponent
                    }
                ]
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'personal-notes',
                component: PersonalNotesComponent
            },
            {
                path: 'accounting',
                component: AccountingComponent,
                children: [
                    {
                        path: '',
                        component: AccountingListComponent
                    },
                    {
                        path: 'add-new-source',
                        component: AddNewSourceComponent
                    },
                    {
                        path: 'manage-source/:id',
                        component: ManageSourceComponent
                    }
                ]
            },
            {
                path: 'manage-vehicles',
                component: ManageVehiclesComponent,
                children: [
                    {
                        path: '',
                        component: VehicleListComponent
                    },
                    {
                        path: 'add-vehicle',
                        component: AddVehicleComponent
                    },
                    {
                        path: 'update-vehicle/:vehicleId',
                        component: UpdateVehicleComponent
                    }
                ]
            },
            {
                path: 'rentals',
                component: RentalsComponent,
                children: [
                    {
                        path: '',
                        component: RentalListComponent
                    },
                    {
                        path: 'add-rental',
                        component: AddRentalComponent
                    },
                    {
                        path: 'manage-rental/:id',
                        component: ManageRentalComponent
                    },
                    {
                        path: 'manage-rental/:id/add-rental-record',
                        component: AddRentalRecordComponent
                    },
                    {
                        path: 'manage-rental/:id/edit-rental-record/:recordId',
                        component: EditRentalRecordComponent
                    },
                ]
            },
            {
                path: 'mileage',
                component: MileageComponent,
                children: [
                    {
                        path: '',
                        component: MileageListComponent
                    },
                    {
                        path: 'manage-mileage/:id',
                        component: ManageMileageComponent
                    }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
