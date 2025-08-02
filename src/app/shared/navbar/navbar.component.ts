import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  role: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe(user => {
      this.isLoggedIn = !!user;
      console.log('User:', user, 'isLoggedIn:', this.isLoggedIn);
    });

    this.authService.getRole().subscribe(role => {
      this.role = role;
      console.log('Navbar role:', this.role);
    });
  }

  logout() {
    this.authService.logout();
  }

  setRole(role: string) {
    console.log('Setting role in AuthService:', role);
    this.authService.setRole(role);
  }
}
