import { Component } from '@angular/core'
import { environment } from '../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators'

@Component({
  selector: 'app-data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.scss']
})
export class DataExportComponent {

  private hostServer = environment.hostServer
  private host = this.hostServer + '/api/Users'

  constructor (private http: HttpClient) { }

  export () {
    return this.http.get(this.hostServer + '/rest/exportProfile').pipe(map((response: any) => response), catchError((err) => { throw err }))
  }
}
