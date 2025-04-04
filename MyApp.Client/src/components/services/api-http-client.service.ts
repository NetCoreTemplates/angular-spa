import { Injectable } from '@angular/core';
import { nameOf, combinePaths, HttpMethods, bytesToBase64, JSV, getMethod, sanitize, createErrorStatus, IReturn } from '@servicestack/client';
import { HttpClient, HttpContext, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiHttpClient extends HttpClient {
    private baseUrl: string = '/api/';

    api<T>(request: IReturn<T>, options?: {
        method?: string;
        headers?: HttpHeaders | Record<string, string | string[]>;
        context?: HttpContext;
        args?: Record<string, any>;
        params?: HttpParams;
        withCredentials?: boolean;
        transferCache?: {
            includeHeaders?: string[];
        } | boolean;
    }): Observable<T> {

        options ??= {};
        (options as any).responseType = 'json';
        (options as any).observe = 'response'

        const method = options.method ?? getMethod(request);
        options.withCredentials ??= true;

        const url = combinePaths(this.baseUrl, nameOf(request));
        let params = new HttpParams();

        if (!HttpMethods.hasRequestBody(method)) {
            for (let k in request) {
                if (request.hasOwnProperty(k)) {
                    let val = (request as any)[k]
                    if (typeof val == 'undefined' || typeof val == 'function' || typeof val == 'symbol') continue
                    params = params.set(k, qsValue(val))
                }
            }
        }        
        if (options.args) {
            for (let k in options.args) {
                if (options.args.hasOwnProperty(k)) {
                    let val = options.args[k]
                    if (typeof val == 'undefined' || typeof val == 'function' || typeof val == 'symbol') continue
                    params = params.set(k, qsValue(val))
                }
            }
        }
        if (options.params) {
            for (let k in options.params.keys()) {
                params = params.set(k, options.params.get(k)!)
            }
        }
        if (params.keys().length > 0) {
            options.params = params
        }

        function transformResponse(event: any) {
            if (event instanceof HttpResponse) {
                return event.body;
            }
            return event;
        }
        
        function transformError(error: HttpErrorResponse) {
            const errorDto = error.error && sanitize(error.error);
            if (errorDto?.responseStatus) {
                return throwError(() => errorDto.responseStatus);
            }
            return throwError(() => createErrorStatus(error.statusText));
        }

        switch (method!.toUpperCase()) {
            case 'GET':
                return this.get<T>(url, options).pipe(map(transformResponse), catchError(transformError));
              case 'POST':
                return this.post<T>(url, request, options).pipe(map(transformResponse), catchError(transformError));
              case 'PUT':
                return this.put<T>(url, request, options).pipe(map(transformResponse), catchError(transformError));
              case 'DELETE':
                return this.delete<T>(url, options).pipe(map(transformResponse), catchError(transformError));
              case 'PATCH':
                return this.patch<T>(url, request, options).pipe(map(transformResponse), catchError(transformError));
            default:
                return throwError(() => new Error(`Unsupported HTTP method: ${method}`));
        }
    }
}

function qsValue(arg: any) {
    if (arg == null)
        return ""
    if (typeof arg == "string")
        return arg
    if (typeof arg == "number" || typeof arg == "boolean")
        return arg.toString()
    if (typeof Uint8Array != "undefined" && arg instanceof Uint8Array)
        return bytesToBase64(arg as Uint8Array)
    return JSV.stringify(arg)
}
