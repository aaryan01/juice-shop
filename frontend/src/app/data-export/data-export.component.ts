<<<<<<< HEAD
import { Component } from '@angular/core'
import { environment } from '../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators'
=======
import { Component, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { ImageCaptchaService } from '../Services/image-captcha.service'
import { DomSanitizer } from '@angular/platform-browser'
>>>>>>> upstream/develop

@Component({
  selector: 'app-data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.scss']
})
<<<<<<< HEAD
export class DataExportComponent {

  private hostServer = environment.hostServer
  private host = this.hostServer + '/api/Users'

  constructor (private http: HttpClient) { }

  export () {
    return this.http.get(this.hostServer + '/rest/exportProfile').pipe(map((response: any) => response), catchError((err) => { throw err }))
=======
export class DataExportComponent implements OnInit {

  public captchaControl: FormControl = new FormControl('', [Validators.required])
  public formatControl: FormControl = new FormControl('', [Validators.required])
  public captcha: any
  private dataRequest: any = undefined
  public confirmation: any
  public error: any
  public lastSuccessfulTry: any
  public presenceOfCaptcha: boolean = false
  public userData: any

  constructor (public sanitizer: DomSanitizer, private imageCaptchaService: ImageCaptchaService) { }
  ngOnInit () {
    this.needCaptcha()
    this.dataRequest = {}
  }

  needCaptcha () {
    let nowTime = new Date()
    let timeOfCaptcha = localStorage.getItem('lstdtxprt') ? new Date(JSON.parse(localStorage.getItem('lstdtxprt'))) : new Date(0)
    if (nowTime.getTime() - timeOfCaptcha.getTime() < 300000) {
      this.getNewCaptcha()
      this.presenceOfCaptcha = true
    }
  }

  getNewCaptcha () {
    this.imageCaptchaService.getCaptcha().subscribe((data: any) => {
      this.captcha = this.sanitizer.bypassSecurityTrustHtml(data.image)
    })
  }

  save () {
    if (this.presenceOfCaptcha) {
      this.dataRequest.answer = this.captchaControl.value
    }
    this.dataRequest.format = this.formatControl.value
    this.imageCaptchaService.dataExport(this.dataRequest).subscribe((data: any) => {
      this.error = null
      this.confirmation = data.confirmation
      this.userData = data.userData
      window.open('', '_blank', 'width=500').document.write(this.userData)
      this.lastSuccessfulTry = new Date()
      localStorage.setItem('lstdtxprt',JSON.stringify(this.lastSuccessfulTry))
      this.ngOnInit()
      this.resetForm()
    }, (error) => {
      this.error = error.error
      this.confirmation = null
      this.resetForm()
    })
  }

  resetForm () {
    this.captchaControl.markAsUntouched()
    this.captchaControl.markAsPristine()
    this.captchaControl.setValue('')
    this.formatControl.markAsUntouched()
    this.formatControl.markAsPristine()
    this.formatControl.setValue('')
>>>>>>> upstream/develop
  }
}
