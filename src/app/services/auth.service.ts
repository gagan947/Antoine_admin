import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs'
import { environment } from '../../environments/environment.development'


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.baseUrl

  private authState = new BehaviorSubject<{
    isLoggedIn: boolean
  }>({ isLoggedIn: this.isLogedIn() })
  authState$ = this.authState.asObservable()

  constructor(private http: HttpClient, private route: Router) { }

  setToken(token: string) {
    localStorage.setItem('AdminToken', token)
  }

  getToken() {
    return localStorage.getItem('AdminToken')
  }

  isLogedIn() {
    return this.getToken() !== null
  }

  updateAuthState(isLoggedIn: boolean) {
    this.authState.next({ isLoggedIn })
  }

  post(url: any, data: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Access-Control-Allow-Origin', '*')
    return this.http.post<any>(this.baseUrl + url, data, { headers: headers })
  }

  logout(): void {
    localStorage.clear()
    this.updateAuthState(false)
    this.route.navigate(['/'])
  }
}