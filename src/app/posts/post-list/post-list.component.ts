import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  userId: string;
  private authStatusSub: Subscription;
  private postsSub: Subscription;
  public userIsAuthenticated = false;
  userFilter: any = { title: '' };
  selected: string;
  modalRef: BsModalRef;
  form: FormGroup;
  constructor(
    public postsService: PostsService,
    private authService: AuthService,
    private modalService: BsModalService
  ) {}

  // posts = [
  //   {title: 'First Post', content: 'This is First Post Content'},
  //   {title: 'Second Post', content: 'This is Second Post Content'},
  //   {title: 'Third Post', content: 'This is Third Post Content'}
  // ];

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  ngOnInit() {

    this.form = new FormGroup({
      title: new FormControl(),
      email: new FormControl(),
      mblno: new FormControl(),
      company: new FormControl()

   });


    this.postsService.getPosts();
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListner()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }
  onAdd() {

    // console.log(this.form.value);
    // this.postsService.quickAdd(
    //   this.form.value.title,
    //   this.form.value.company,
    //   this.form.value.email,
    //   this.form.value.mblno,
    // );
   
  }
  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
