import { Component } from '@angular/core';
import { UserService } from '../../features/user/services/user-service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { M } from '@angular/cdk/keycodes';
import { Navbar } from "../navbar/navbar";

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, MatToolbarModule, Navbar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
  isLoggedIn = false;
  currentUser: any;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.isLoggedIn = true;
        this.currentUser = user;
        console.log(user);
      },
      error: (err) => {
        this.isLoggedIn = false;
        this.currentUser = null;
      }
    })
  }

  // logout() {
  //   this.authService.logout();
  //   this.router.navigate(['/auth/signin']);
  // }
}
