import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, UserCredential, onAuthStateChanged, User, createUserWithEmailAndPassword,  sendEmailVerification, } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { from, Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
  import { sendPasswordResetEmail } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userRole: string = '';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userRole: string = '';
  currentUserRole: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private userService: UserService
  ) {
    // Restore role from localStorage on service creation
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      this.setRole(storedRole);
    }
  }

   resendVerificationEmail(user: User) {
    return sendEmailVerification(user);
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password).then(async cred => {
        const userDoc = await getDoc(doc(this.firestore, `users/${cred.user.uid}`));
        const role = userDoc.data()?.['role'];
        this.setRole(role);
        localStorage.setItem('role', role);

        if (role === 'admin') {
          this.router.navigate(['/adminDashboard']);
        } else if (role === 'student') {
          this.router.navigate(['/studentDashboard']);
        } else {
          alert('Unknown role!');
        }
        return cred;
      })
    );
  }

  setRole(role: string) {
    this.currentUserRole.next(role);
  }

  getRole(): Observable<string | null> {
    return this.currentUserRole.asObservable();
  }

  signup(email: string, password: string, fullName: string, role: 'student' | 'admin'): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(async userCredential => {
        await setDoc(
          doc(this.firestore, 'users', userCredential.user.uid),
          {
            email: email,
            fullName: fullName,
            role: role
          }
        );
        // Fetch the role and set it
        this.setRole(role);
        localStorage.setItem('role', role);

        // Redirect based on role
        if (role === 'admin') {
          this.router.navigate(['/adminDashboard']);
        } else if (role === 'student') {
          this.router.navigate(['/studentDashboard']);
        }
        return userCredential;
      })
    );
  }

  getUser(): Observable<User | null> {
    return new Observable(subscriber => {
      return onAuthStateChanged(this.auth, user => subscriber.next(user));
    });
  }

  logout(): Promise<void> {
    return this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }


forgotPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(this.auth, email);
}

googleLogin(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(this.auth, provider).then(async cred => {
    const userDocRef = doc(this.firestore, `users/${cred.user.uid}`);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      // default to student or ask user later
      await setDoc(userDocRef, {
        email: cred.user.email,
        name: cred.user.displayName,
        role: 'student'
      });
    }

    const role = (await getDoc(userDocRef)).data()?.['role'];
    this.setRole(role);
    localStorage.setItem('role', role);

    if (role === 'admin') {
      this.router.navigate(['/adminDashboard']);
    } else {
      this.router.navigate(['/studentDashboard']);
    }

    return cred;
  });
}


}
