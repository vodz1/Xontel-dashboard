import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule , RouterModule , CommonModule , TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  submitted = false;
  error = '';

  constructor(private router: Router) {  }

  loginForm = new FormGroup({
    email : new FormControl('' , [Validators.required , Validators.email]),
    password : new FormControl('' , [Validators.required , Validators.maxLength(16)]),
    remember: new FormControl(false)

  })


    get emailValid(){
    return this.loginForm.controls["email"].valid
    }

   get passwordValid(){
    return this.loginForm.controls["password"].valid
   }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) return;

    const { email, password, remember } = this.loginForm.value;

    if (email === 'admin@demo.com' && password === 'admin123') {
      const token = 'mock-token-123';
      if (remember) {
        localStorage.setItem('auth_token', token);
      } else {
        sessionStorage.setItem('auth_token', token);
      }
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Invalid email or password';
    }
  }


}
