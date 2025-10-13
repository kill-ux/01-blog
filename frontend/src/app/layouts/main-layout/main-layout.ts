import { Component } from '@angular/core';
import { UserService } from '../../features/user/services/user-service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { M } from '@angular/cdk/keycodes';
import { Navbar } from "../navbar/navbar";


declare var Prism: any;

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, MatToolbarModule, Navbar],
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
    setTimeout(() => {
      console.log("p=>",Prism.plugins.autoloader)
      if (Prism && Prism.plugins.autoloader) {
        Prism.plugins.autoloader.languages_path = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/';
        Prism.highlightAll(); // Re-highlight all code blocks
      }
    }, 0);
    // this.userService.getProfile().subscribe({
    //   next: (user) => {
    //     this.isLoggedIn = true;
    //     this.currentUser = user;
    //     console.log(user);
    //   },
    //   error: (err) => {
    //     this.isLoggedIn = false;
    //     this.currentUser = null;
    //   }
    // })
  }

  // logout() {
  //   this.authService.logout();
  //   this.router.navigate(['/auth/signin']);
  // }
}
