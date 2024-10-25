import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'antoine-admin';

  constructor(private router: Router, public auth: AuthService) { }

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.loadExternalScript();
      }
    });
  }

  loadExternalScript() {
    const scriptElement = document.createElement('script');
    scriptElement.src = 'assets/js/main.js';
    scriptElement.onload = () => {
      // console.log('External script loaded');
    };
    document.body.appendChild(scriptElement);
  }
}
