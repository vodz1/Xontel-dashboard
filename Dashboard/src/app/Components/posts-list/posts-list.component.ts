import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { PostsService } from '../../Services/posts.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WebSocketService } from '../../Services/web-socket.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';
declare const bootstrap: any;


@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [NavbarComponent ,
            SidebarComponent,
            CommonModule ,
            HttpClientModule ,
            FormsModule ,
            RouterModule , 
            NgxSpinnerModule,
            TranslateModule
  ],
  providers :[PostsService , WebSocketService],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.css'
})
export class PostsListComponent implements OnInit, OnDestroy {
  searchUserId: string = '';
  showUserIdCard: boolean = false;
  selectedPostId: number  = Infinity;
  posts: any[] = [];
  paginatedPosts: any[] = [];
  currentPage = 1;
  pageSize = 10;
  
  private subscription: Subscription | undefined;
  toastMessage = '';
  

  @ViewChild('toastEl', { static: true }) toastEl!: ElementRef;

  constructor(private postsService: PostsService , private wsService: WebSocketService,
    private readonly spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.subscription = this.wsService.getMessages().subscribe({
      next: (msg) => {
        console.log("msg" , msg);
        this.showNotification(msg)},
      error: (err) => console.error('WebSocket Error:', err),
    });
    this.loadPosts();
  }

  showNotification(message: string): void {
    this.wsService.getTranslatedMessage('toast.message') // Use a translation key here
    .subscribe((translatedMessage: string) => {
      this.toastMessage = `${translatedMessage}: ${message}`;
    })
    
    const toast = new bootstrap.Toast(this.toastEl.nativeElement, { delay: 10000 });
    toast.show();
  }

  sendReply(): void {
    this.wsService.replyMessage('Thanks for the message!');
  }

  loadPosts() {
    this.spinner.show()
    setTimeout(() => {
      this.postsService.getPosts().subscribe({
        next : (data) => {
          this.posts = data;
          this.updatePagination();
        },
        complete : () => {
          this.spinner.hide();
        }
      });
      
    }, 1000);
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedPosts = this.posts.slice(start, end);
  }

  nextPage() {
    if ((this.currentPage * this.pageSize) < this.posts.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }


  truncate(text: string, limit: number): string {
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  }

  applyUserIdFilter() {
    if (!this.searchUserId.trim()) {
      this.currentPage = 1;
      this.updatePagination();
    } else {
      const userId = +this.searchUserId;
      this.paginatedPosts = this.posts.filter(post => post.userId === userId);
      this.currentPage = 1;
    }
  
    this.showUserIdCard = false;
  }

  ResetFilter(){
    this.searchUserId = '';
    this.paginatedPosts = this.posts.slice(0, this.pageSize);
    this.currentPage = 1;
  }

  toggleUserIdCard() {
    this.showUserIdCard = !this.showUserIdCard;
  }

  confirmDelete(postId: number) {
    this.selectedPostId = postId;
  }

  get rangeEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.posts.length);
  }
  
  get rangeStart(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  deletePost(postId : number) {
    if (this.selectedPostId !== null) {
      this.postsService.deletePost(postId).subscribe({
        next: () => {
          this.posts = this.posts.filter(p => p.id !== this.selectedPostId);
          const totalPages = Math.ceil(this.posts.length / this.pageSize);
          if (this.currentPage > totalPages) {
            this.currentPage = totalPages;
          }
          this.updatePagination();

          const modalEl = document.getElementById('deleteModal');
        if (modalEl) {
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          modalInstance?.hide();
        }
        },
        error: (err) => {
          console.error('Failed to delete post:', err);
        }
      });
    }
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.wsService.close();
  }
}
