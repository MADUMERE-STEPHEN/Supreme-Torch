import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  authService: any;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

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
}
