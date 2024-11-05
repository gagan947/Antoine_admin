import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userData: any;
  constructor(private router: Router) {
    const userData: any = localStorage.getItem('userData')
    this.userData = JSON.parse(userData)
  }
  logout() {
    localStorage.clear()
    this.router.navigate(['/'])
  }
}
