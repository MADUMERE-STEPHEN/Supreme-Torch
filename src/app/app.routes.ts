import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AdmissionFormComponent } from './pages/admission-form/admission-form.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard/student-dashboard.component';
import { ResultCardComponent } from './shared/result-card/result-card.component';
import { ViewResultsComponent } from './student/view-results/view-results/view-results.component';
import { UploadResultsComponent } from './admin/upload-results/upload-results/upload-results.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard/admin-dashboard.component';
import { ManageResultsComponent } from './admin/manage-results/manage-results.component';
import { ClassTeacherComponent } from './admin/class-teacher/class-teacher.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'admission', component: AdmissionFormComponent},
  {path: 'about', component: AboutComponent},
  {path: 'signUp', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'studentDashboard', component: StudentDashboardComponent},
  {path: 'result-card', component: ResultCardComponent},
  {path: 'view-results', component: ViewResultsComponent},
  {path: 'upload-results', component: UploadResultsComponent},
{path: 'adminDashboard', component: AdminDashboardComponent},
{path: 'manage', component: ManageResultsComponent},
{path: 'classDashboard', component: ClassTeacherComponent},
  // fallback
  { path: '**', redirectTo: '' }
];
