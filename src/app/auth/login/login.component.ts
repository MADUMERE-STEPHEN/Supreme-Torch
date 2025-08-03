import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';

@Component({
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';
  message = '';
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    public authService: AuthService // properly injected
  ) {}

 resendEmail() {
    const user = this.auth.currentUser;
    if (user) {
      this.authService.resendVerificationEmail(user).then(() => {
        this.message = 'Verification email resent!';
      }).catch(() => {
        this.message = 'Could not resend email. Please try again later.';
      });
    } else {
      this.message = 'No user found.';
    }
  }
  async login() {
    try {
      const cred = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      const userDocSnap = await getDoc(doc(this.firestore, `users/${cred.user.uid}`));
      if (!userDocSnap.exists()) {
        alert('User profile not found!');
        return;
      }
      // Navigate to dashboard after successful login
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      alert('❌ Login failed: ' + (err.message || err));
    }
  }
  onGoogleLogin() {
  this.authService.googleLogin().catch((error: any) => {
    console.log(error);
    alert('Google login failed');
  });
}

}
