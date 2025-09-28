import { Component } from '@angular/core';
import { Router } from 'express';
import { AuthService } from '../../features/auth/services/auth-api';

@Component({
  selector: 'app-main-layout',
  imports: [],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
  // isLoggedIn = false;
  // currentUser: any;

  // constructor(
  //   private authService: AuthService,
  //   private router: Router
  // ) { }

  // ngOnInit() {
  //   this.authService.currentUser$.subscribe(user => {
  //     this.isLoggedIn = !!user;
  //     this.currentUser = user;
  //   });
  // }

  // logout() {
  //   this.authService.logout();
  //   this.router.navigate(['/auth/signin']);
  // }
}
