import { CRUDObject } from './crud-object.model';
import { HttpOptions } from './http-options.model';
import { catchError } from 'rxjs/operators/catchError';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Config } from '@seed/models';
import { Observable } from 'rxjs/Observable';
import { HttpError } from './http-error.model';
import { HttpErrorHandler } from './http-error-handler.model';
import { RestParams } from './rest-params.model';
import { of } from 'rxjs/observable/of';

const DEFAULT_ERROR_HANDLER = (error: HttpErrorResponse): Observable<HttpError> => {
  return of<HttpError>({
    code: error.status,
    message: error.error
  });
};

const DEFAULT_OPTIONS = {
  headers: new HttpHeaders().set('Content-Type', 'application/json')
};

const DEFAULT_REST_PARAMS = {
  page: 0,
  limit: 50
};

export abstract class HttpCRUDService<P extends CRUDObject> {
  constructor(
    protected readonly http: HttpClient,
    protected readonly config: Config,
    protected readonly url: string,
    protected readonly defaultOptions: HttpOptions = DEFAULT_OPTIONS,
    protected readonly defaultRestParams: RestParams = DEFAULT_REST_PARAMS,
    protected readonly defaultErrorHandler: HttpErrorHandler = DEFAULT_ERROR_HANDLER
  ) {
    if (!url.startsWith('http')) {
      this.url = config.apiUrl + (config.apiUrl.endsWith('/') || url.startsWith('/') ? '' : '/') + url;
    }
  }

  create(obj: P, urlParams?: string[]): Observable<P | HttpError> {
    if (!urlParams) {
      return this.createRequest(obj, this.url, this.defaultOptions, this.defaultErrorHandler);
    }
    return this.createRequest(obj, this.sanitizeURL(urlParams), this.defaultOptions, this.defaultErrorHandler);
  }

  read(obj: string, urlParams?: string[], params?: RestParams): Observable<P | HttpError> {
    if (!urlParams) {
      return this.readRequest(obj, params, this.url, this.defaultOptions, this.defaultErrorHandler);
    }
    return this.readRequest(obj, params, this.sanitizeURL(urlParams), this.defaultOptions, this.defaultErrorHandler);
  }

  readAll(urlParams?: string[], params?: RestParams): Observable<P[] | HttpError> {
    if (!urlParams) {
      return this.readAllRequest(params, this.url, this.defaultOptions, this.defaultErrorHandler);
    }
    return this.readAllRequest(params, this.sanitizeURL(urlParams), this.defaultOptions, this.defaultErrorHandler);
  }

  update(obj: P, urlParams?: string[]): Observable<P | HttpError> {
    if (!urlParams) {
      return this.updateRequest(obj, this.url, this.defaultOptions, this.defaultErrorHandler);
    }
    return this.updateRequest(obj, this.sanitizeURL(urlParams), this.defaultOptions, this.defaultErrorHandler);
  }

  delete(obj: P, urlParams?: string[]): Observable<boolean | HttpError> {
    if (!urlParams) {
      return this.deleteRequest(obj, this.url, this.defaultOptions, this.defaultErrorHandler);
    }
    return this.deleteRequest(obj, this.sanitizeURL(urlParams), this.defaultOptions, this.defaultErrorHandler);
  }

  protected createRequest(
    obj: P,
    url: string,
    options: HttpOptions,
    errorHandler: HttpErrorHandler
  ): Observable<P | HttpError> {
    return this.http.post<P | HttpError>(url, obj, options).pipe(catchError(errorHandler));
  }

  protected readRequest(
    obj: string,
    restParams: RestParams,
    url: string,
    options: HttpOptions,
    errorHandler: HttpErrorHandler
  ): Observable<P | HttpError> {
    console.log(url + (url.endsWith('/') ? '' : '/') + obj + this.sanitizeRestParams(restParams));
    return this.http
      .get<P | HttpError>(url + (url.endsWith('/') ? '' : '/') + obj + this.sanitizeRestParams(restParams), options)
      .pipe(catchError(errorHandler));
  }

  protected readAllRequest(
    restParams: RestParams,
    url: string,
    options: HttpOptions,
    errorHandler: HttpErrorHandler
  ): Observable<P[] | HttpError> {
    return this.http
      .get<P[] | HttpError>(url + this.sanitizeRestParams(restParams), options)
      .pipe(catchError(errorHandler));
  }

  protected updateRequest(
    obj: P,
    url: string,
    options: HttpOptions,
    errorHandler: HttpErrorHandler
  ): Observable<P | HttpError> {
    return this.http
      .patch<P | HttpError>(url + (url.endsWith('/') ? '' : '/') + obj.id, obj, options)
      .pipe(catchError(errorHandler));
  }

  protected deleteRequest(
    obj: P,
    url: string,
    options: HttpOptions,
    errorHandler: HttpErrorHandler
  ): Observable<boolean | HttpError> {
    return this.http
      .delete<boolean | HttpError>(url + (url.endsWith('/') ? '' : '/') + obj.id, options)
      .pipe(catchError(errorHandler));
  }

  protected sanitizeURL(urlParams: string[]): string {
    let buffer = this.url;
    for (let i = 0; i < urlParams.length; i++) {
      buffer = buffer.replace(':s' + i, urlParams[i]);
    }
    return buffer;
  }

  protected sanitizeRestParams(restParams: RestParams): string {
    if (!restParams) {
      return '';
    }
    let buffer = '?';
    for (const key of Object.keys(restParams)) {
      buffer += '&' + key + '=' + restParams[key];
    }
    return buffer;
  }
}
