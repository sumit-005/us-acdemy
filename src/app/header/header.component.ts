import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public userIsAuthenticated = false;
  private authListnerSubs: Subscription;
  modalRef: BsModalRef;
  message: string;
  constructor(
    private authService: AuthService,
    private modalService: BsModalService
  ) {}
  x = 5;
  y = 1;

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  decline(): void {
    this.message = 'Declined!';
    this.x = 1;
    this.y = 1;
    this.modalRef.hide();
  }
  ngOnInit() {
    console.log(this.y);

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListnerSubs = this.authService
      .getAuthStatusListner()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }
  onLogout() {
    this.authService.logout();
    this.modalRef.hide();
    console.log(this.y);

    this.x = 1;
    this.y = 1;
  }

  ngOnDestroy() {
    this.authListnerSubs.unsubscribe();
  }
}
