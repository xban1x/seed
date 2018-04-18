import { HttpError } from './http-error.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export type HttpErrorHandler = (error: HttpErrorResponse) => Observable<HttpError>;
