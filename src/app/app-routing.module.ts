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
            }
        ]
    }    
];

@NgModule({
    imports: [ RouterModule.forRoot(appRoutes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {

}