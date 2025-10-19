import { Component } from '@angular/core';
import { UserService } from '../../features/user/services/user-service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { M } from '@angular/cdk/keycodes';
import { Navbar } from "../navbar/navbar";
import { AuthService } from '../../features/auth/services/auth-api';


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
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.initialize()
    setTimeout(() => {
      console.log("p=>", Prism.plugins.autoloader)
      if (Prism && Prism.plugins.autoloader) {
        Prism.plugins.autoloader.languages_path = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/';
        Prism.highlightAll(); // Re-highlight all code blocks
      }
    }, 0);
  }
}
