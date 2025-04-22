import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { UserDashboardComponent } from './Components/user-dashboard/user-dashboard.component';
import { PostsListComponent } from './Components/posts-list/posts-list.component';
import { AddUserComponent } from './Components/add-user/add-user.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , LoginComponent , UserDashboardComponent , PostsListComponent , AddUserComponent,NgxSpinnerModule , TranslateModule],
  providers: [TranslateService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Dashboard';
  selectedLang: string = 'en'; 

  languages = [
    { code: 'en', label: 'English'},
    { code: 'ar', label: 'العربية'}, 
  ];

  constructor(private translate: TranslateService) {
    // Check for saved language in localStorage
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.selectedLang = savedLang;
    }

    // Initialize the translate service
    this.translate.addLangs(this.languages.map((lang) => lang.code));
    this.translate.setDefaultLang(this.selectedLang);
    this.translate.use(this.selectedLang);
  }

  // Method to change the language
  changeLanguage(lang: string): void {
    const langData = this.languages.find((l) => l.code === lang);
    if (langData) {
      this.selectedLang = langData.code;
      this.translate.use(langData.code);
      
      // Save the selected language to localStorage
      localStorage.setItem('language', langData.code);
    }
  }
}
