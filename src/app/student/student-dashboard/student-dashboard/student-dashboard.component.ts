import { Component } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { user } from '@angular/fire/auth';
import { updateProfile, updateEmail } from 'firebase/auth';
import { OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-student-dashboard',
  imports: [RouterLink, RouterOutlet, CommonModule, FormsModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {
  currentUser: any ;
  editProfile = {
    fullName: '',
    email: ''
  };

  constructor(private firestore: Firestore, private auth: Auth, private router: Router) {}

  ngOnInit(): void {
    const unsub = user(this.auth).subscribe(userData => {
      if (userData) {
        this.currentUser = userData;
        // console.log(userData); // optional
      } else {
        this.router.navigate(['/login']); // not logged in, redirect
      }
    });
    // Load current user info
    // Set this.currentUser and this.editProfile accordingly
    // Example:
    // this.currentUser = ...;
    // this.editProfile.fullName = this.currentUser.displayName;
    // this.editProfile.email = this.currentUser.email;
  }

  async saveProfile() {
    const user = this.auth.currentUser;
    if (!user) return;

    // Update Firestore
    const userDocRef = doc(this.firestore, 'users', user.uid);
    await updateDoc(userDocRef, {
      fullName: this.editProfile.fullName,
      email: this.editProfile.email
    });

    // Optionally update Auth profile
    await updateProfile(user, { displayName: this.editProfile.fullName });
    await updateEmail(user, this.editProfile.email);

    // Close the Bootstrap modal
    const modalElement = document.getElementById('editProfileModal');
    if (modalElement) {
      // For Bootstrap 5
      const modalInstance = (window as any).bootstrap?.Modal.getInstance(modalElement)
        || new (window as any).bootstrap.Modal(modalElement);
      modalInstance.hide();
    }
  }
}
