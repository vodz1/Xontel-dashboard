import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PostsService } from '../../Services/posts.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [FormsModule , 
    NavbarComponent , 
    SidebarComponent , 
    ReactiveFormsModule ,
     RouterModule,
      HttpClientModule,
       CommonModule,
      TranslateModule
    ],
  providers : [PostsService],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent implements OnInit {
isEditMode: boolean = false;
postId : any ;
userIds: number[] = [];
allPosts: any[] = [];
post : any = {
  title : '',
  body : '',
  userId : ''
}

constructor(private readonly postsService : PostsService  , private router : Router
   , private activatedRouter : ActivatedRoute) { }

   postForm = new FormGroup({
    title : new FormControl(''),
    body : new FormControl(''),
    userId : new FormControl('')
   })

   ngOnInit() {
    this.postId = this.activatedRouter.snapshot.params['id'];
    
    
    this.postsService.getPosts().subscribe({
      next: (posts) => {
        this.allPosts = posts;
        this.userIds = [...new Set(posts.map((p: any) => p.userId))];

        if (this.postId) {
          this.isEditMode = true;
          this.loadPostDetails();
        }
      },
      error: (err) => console.error('Failed to load posts', err)
    });
  }



loadPostDetails() {
  this.postsService.getPostById(this.postId).subscribe({
    next: (data) => {
      this.post = data;
    },
    error: (error) => {
      console.error('Error fetching book details', error);
    }
  });
}

onSubmit(){
  const formValue = this.postForm.value;
  if(this.isEditMode){
    this.postsService.updatePost(this.postId , formValue).subscribe({
      next : (data)=>{
        this.router.navigate(['/posts'])
      },
      error : (error)=>{
        console.error('Error updating post', error);
      }
    })
  }else{
    const maxId = Math.max(...this.allPosts.map(p => +p.id));
    const newPost = {
      userId: Number(formValue.userId),       
      id: String(maxId + 1),                 
      title: formValue.title,
      body: formValue.body
    };
    this.postsService.addPost(newPost).subscribe({
      next : (data)=>{
        this.router.navigate(['/posts'])
      },
      error : (error)=>{
        console.error('Error adding post', error);
      }
    })
  }

}
}
