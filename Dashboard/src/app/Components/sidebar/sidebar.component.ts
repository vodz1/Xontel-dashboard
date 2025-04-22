import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
declare const bootstrap: any;
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule , TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

constructor(private route : Router){}

logout(){
localStorage.removeItem('auth_token');
sessionStorage.removeItem('auth_token');
this.route.navigate(['/login']);
}


closeSidebarIfMobile() {
  const offcanvasEl = document.getElementById('mobileSidebar');
  if (offcanvasEl) {
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
  }
}

}
