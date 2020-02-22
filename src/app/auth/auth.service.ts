import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListner = new Subject<boolean>();
  private tokenTimer: any;
  private userId: string;
  private userName: string;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {}

  getToken() {
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getUserId() {
    return this.userId;
  }
  getUserName() {

  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  
  createUser(name: string, email: string, password: string) {
    const authData: AuthData = { name, email, password };
    this.http
      .post('http://localhost:3000/user/signup', authData)
      .subscribe(() => {
        this.toastr.success(`User Created Succesfully`, 'Success');
        this.router.navigate(['/login']);
      }, error => {
        this.authStatusListner.next(false);
        // this.router.navigate(['/signup']);
        this.toastr.error(`Your email id is already taken`, 'Error');

      });
  }
  login(email: string, password: string) {
    const authData: AuthData = { name, email, password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string  }>(
        'http://localhost:3000/user/login ',
        authData
      )
      .subscribe(response => {
        const token = response.token;

        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTime(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListner.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate, this.userId);
          this.toastr.success('hello'+ this.userId , 'Welcome');
          this.router.navigate(['/home']);
        }
      }, error => {
        this.authStatusListner.next(false);
        // this.router.navigate(['/login']);
        this.toastr.error(`Please check your email Id and Passsword`, 'Error');

      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTime(expiresIn / 1000);
      this.authStatusListner.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.toastr.success(`Logged Out Succesfull`, 'Logged Out');
    this.router.navigate(['/login']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('usedId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
      // tslint:disable-next-line: align
    }
    return {
      // tslint:disable-next-line: object-literal-shorthand
      token: token,
      expirationDate: new Date(expirationDate),
      // tslint:disable-next-line: object-literal-shorthand
      userId: userId
    };
  }

  private setAuthTime(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
