import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  private mode = 'create';
  private postId: string;
  public post: Post;
  form: FormGroup;
  imagePreview: string;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      company: new FormControl('', {
        validators: [Validators.required]
      }),
      description: new FormControl('', {
        validators: [Validators.required, Validators.minLength(50), Validators.maxLength(130)]
      }),
      email: new FormControl('', {
        validators: [Validators.required]
      }),
      mblno: new FormControl('', {
        validators: [Validators.required]
      }),
      bday: new FormControl('', {
        validators: [Validators.required]
      }),
      gender: new FormControl('', {
        validators: [Validators.required]
      }),
      designation: new FormControl('', {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),


    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = {
            id: postData._id,
            title: postData.title,
            company: postData.company,
            email: postData.email,
            mblno: postData.mblno,
            gender: postData.gender,
            designation: postData.designation,
            bday: postData.bday,
            description: postData.description,
            imagePath: postData.imagePath
          };
          this.form.setValue({
            title: this.post.title,
            company: this.post.company,
            email: this.post.email,
            mblno: this.post.mblno,
            gender: this.post.gender,
            designation: this.post.designation,
            bday: this.post.bday,
            description: this.post.description,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: file
    });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    console.log(file);
    
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  

  onSavePost() {

    // if (this.form.invalid) {
    //   return;
    // }

if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.company,
        this.form.value.email,
        this.form.value.mblno,
        this.form.value.gender,
        this.form.value.designation,
        this.form.value.bday,
        this.form.value.description,
        this.form.value.image,
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.company,
        this.form.value.email,
        this.form.value.mblno,
        this.form.value.gender,
        this.form.value.designation,
        this.form.value.bday,
        this.form.value.description,
        this.form.value.image,

      );
    }
  }
}
