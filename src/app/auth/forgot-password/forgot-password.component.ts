import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
email: string = '';
error: string = '';
message: string = '';

constructor(private authService: AuthService) {}

onSubmit() {
  this.authService.forgotPassword(this.email)
    .then(() => {
      this.message = 'Password reset link sent! Please check your inbox and spam folder.';
      this.error = '';
    })
    .catch(err => {
      this.error = err.message;
      this.message = '';
    });
}
}
