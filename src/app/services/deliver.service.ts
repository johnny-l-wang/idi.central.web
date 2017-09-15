import { Injectable } from '@angular/core';
import { Response, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { RESTService, Status } from '../core';

export interface IDeliver {
    id: string
    sn: string
    cn: string
}

@Injectable()
export class DeliverService extends RESTService {

    constructor(http: Http) { super(http) }

    // single(id: string): Observable<ICustomer> {
    //     return super.get(`/api/cust/${id}`).map((res: Response) => {
    //         var result = res.json();

    //         if (result.status == Status.Success)
    //             return result.data

    //         return null;
    //     });
    // }

    // all(): Observable<Array<ICustomer>> {

    //     return super.get('/api/cust/list').map((res: Response) => {

    //         var result = res.json();

    //         if (result.status == Status.Success)
    //             return result.data

    //         return new Array<ICustomer>()
    //     });
    // }

    // add(value: any): Observable<any> {
    //     return super.post('/api/cust', value).map((res: Response) => {
    //         return res.json();
    //     });
    // }

    // update(value: ICustomer): Observable<any> {
    //     return super.put(`/api/cust/${value.id}`, value).map((res: Response) => {
    //         return res.json();
    //     });
    // }

    // remove(id: string): Observable<any> {
    //     return super.delete(`/api/cust/${id}`).map((res: Response) => {
    //         return res.json();
    //     });
    // }
}