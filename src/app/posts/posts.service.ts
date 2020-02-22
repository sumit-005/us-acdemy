import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Post } from './post.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/posts')
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              company: post.company,
              id: post._id,
              email: post.email,
              mblno: post.mblno,
              gender: post.gender,
              designation: post.designation,
              bday: post.bday,
              description: post.description,
              imagePath: post.imagePath
            };
        });
        })
      )
      .subscribe(transformPost => {
        this.posts = transformPost;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      company: string;
      email: string;
      mblno: string;
      gender: string;
      designation: string;
      bday: string;
      description: string;
      imagePath: string;
    }>('http://localhost:3000/posts/' + id);
  }

  addPost(
    title: string,
    company: string,
    email: string,
    mblno: string,
    gender: string,
    designation: string,
    bday: string,
    description: string,
    image: File
  ) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('company', company);
    postData.append('email', email);
    postData.append('mblno', mblno);
    postData.append('gender', gender);
    postData.append('designation', designation);
    postData.append('bday', bday);
    postData.append('description', description);
    postData.append('image', image);

    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/posts',
        postData
      )
      .subscribe(responseData => {
        const post: Post = {
          id: responseData.post.id,
          title,
          company,
          email,
          mblno,
          gender,
          designation,
          bday,
          description,
          imagePath: responseData.post.imagePath
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.toastr.success(`Data Added Succesfully `, 'Success');
        this.router.navigate(['/']);
      });
  }

  updatePost(
    id: string,
    title: string,
    company: string,
    email: string,
    mblno: string,
    gender: string,
    designation: string,
    bday: string,
    description: string,
    image: File | string
  ) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
       postData = new FormData();
       postData.append('id', id);
       postData.append('title', title);
       postData.append('company', company);
       postData.append('email', email);
       postData.append('mblno', mblno);
       postData.append('gender', gender);
       postData.append('designation', designation);
       postData.append('bday', bday);
       postData.append('description', description);
       postData.append('image', image);
    } else {
      postData = {
          id,
          title,
          company,
          email,
          mblno,
          gender,
          designation,
          bday,
          description,
          imagePath: image,
      };
    }
    this.http
      .put('http://localhost:3000/posts/' + id, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id,
          title,
          company,
          email,
          mblno,
          gender,
          designation,
          bday,
          description,
          imagePath: ''
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId) {
    this.http.delete('http://localhost:3000/posts/' + postId).subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }
}
