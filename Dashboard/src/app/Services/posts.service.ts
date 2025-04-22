import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private readonly baseUrl = 'http://localhost:3000/posts';

  constructor(private readonly http : HttpClient) { }

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getPostById(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  updatePost(id: any, post: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, post);
  }

  addPost(post: any): Observable<any> {
    return this.http.post(this.baseUrl, post);
  }

}
