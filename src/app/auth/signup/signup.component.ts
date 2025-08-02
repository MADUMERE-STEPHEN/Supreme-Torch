import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { updateProfile, User } from '@angular/fire/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email = '';
  password = '';
  fullName = '';
  errorMsg = '';

  signupData: { role: 'student' | 'admin' } = {
    role: 'student'
  };

  adminPasscode = '';
  readonly ADMIN_PASSCODE = 'superadmin'; // Set your secret passcode here

  constructor(private auth: AuthService, private router: Router) {}

  signup() {
    if (!this.email || !this.password || !this.fullName) {
      this.errorMsg = 'All fields are required!';
      return;
    }
    if (this.signupData.role === 'admin' && this.adminPasscode !== this.ADMIN_PASSCODE) {
      this.errorMsg = 'Invalid admin passcode!';
      return;
    }
    this.auth.signup(this.email, this.password, this.fullName, this.signupData.role).subscribe({
      next: async (userCredential: { user: User }) => {
        if (userCredential && userCredential.user) {
          await updateProfile(userCredential.user, { displayName: this.fullName });
        }
        // Redirect based on role
        if (this.signupData.role === 'admin') {
          this.router.navigate(['/adminDashboard']);
        } else if (this.signupData.role === 'student') {
          this.router.navigate(['/studentDashboard']);
        } else {
          alert('Unknown role!');
        }
      },
      error: err => {
        this.errorMsg = err.message;
      }
    });
  }
}