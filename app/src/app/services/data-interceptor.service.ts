import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataInterceptor implements HttpInterceptor {

  // The intercept method catches any API request and adds meta data such as
  // headers to the request before sending it off to the server
  intercept(req: HttpRequest<any> , next: HttpHandler) : Observable<HttpEvent<any>>{
    // this is normally where the request headers would be updated.
    // Example: If the request requires a token

    // const jwt = this.authService.getToken();
    // req.headers.set({"authorization": `Bearer ${jwt}`});

    req = req.clone({
      headers: req.headers.set('Content-type', 'application/json')
    });

    return next.handle(req).pipe(
      tap({
        next: (event: any)=> {
          if (event instanceof HttpResponse) {
            if (event.status == 401) {
              // Display an error message that the request was unauthorized
              // In some cases it might be viable to attempt to re-authorise the user with a refresh token and reattempting the request.
            }
          }
          return event;
        },
        error: (error: any) => {
          if(error.status === 401) {
            // Display an error message that the request was unauthorized
            // In some cases it might be viable to attempt to re-authorise the user with a refresh token and reattempting the request.
          }
          else if(error.status > 500) {
            // If a server error occured, display a general error message and close any loaders still displaying to avoid infinite loading.
          }
        }
      })
    )
  }

  constructor() { }
}
