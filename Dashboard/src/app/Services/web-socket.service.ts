import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, tap } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
private socket$ : WebSocketSubject<any>;
  constructor( private translate : TranslateService) {
    this.socket$ = webSocket({
      url: 'wss://ws.postman-echo.com/raw',
      openObserver: {
        next: () => {
          this.translate.get('webSocket.initialMessage').subscribe((translatedMessage) => {
            this.sendMessage(translatedMessage); 
          });
        }
      }
    });   }

   sendMessage(message: any){
    this.socket$.next(message);
   }

   replyMessage(message: any){
    if (typeof message === 'string') {
      this.translate.get('webSocket.reply').subscribe((translatedMessage) => {
        this.socket$.next(translatedMessage);
      });
    } else {
      this.socket$.next(message);
    }
   }

   getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }
  
   close(){
    this.socket$.complete();
   }

   getTranslatedMessage(messageKey: string): Observable<string> {
    return this.translate.get(messageKey);
  }
}
