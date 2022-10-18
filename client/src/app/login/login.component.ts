import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { DataService } from '../services/service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private readonly notifier: NotifierService;
  isError: boolean = false;
  isPassword: boolean = false;
  errorMessage: string = "";
  loginForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
    password: new FormControl('')
  });

  codeForm = new FormGroup({
    name: new FormControl(''),
    birthday: new FormControl(new Date())
  });

  isFindCode: boolean = false;
  
  constructor(private route: Router, private dataService: DataService, notifierService: NotifierService) { 
    this.notifier = notifierService;
  }

  userCount: number = 0;
  ngOnInit(): void {
    this.dataService.getUserCount().subscribe({
      next: (x) => {
        this.userCount = x.return;
      },
      error: (err) => { 
        //alert(err.error.return);
        this.notifier.notify('error','用户人数: ' + err.error.return)
      }
    })
  }

  login(): void{
    let form = this.loginForm.value;
    if (this.loginForm.invalid) {
      this.isError = true;
      this.loginForm.controls['code'].markAsDirty();
    } else {
      console.log(form.code)
      this.route.navigate(['/data', form.code])
    }
    
  }

  loginWithPassword(): void{
    let form = this.loginForm.value;
    this.dataService.loginWithPassword(form).subscribe({
      next: (x) => {
        console.log(x);
        this.dataService.setPasswordLocally(form.code, x.password);
        this.route.navigate(['/data', form.code])
      },
      error: (err) => { 
        //alert(err.error.return);
        this.notifier.notify('error',err.error.return)
      }
    }
    )
  }

  isFound: boolean = false;
  foundCode: any = null;
  findCode(): void{
    let form = this.codeForm.value;
    this.dataService.getGuildCode(form).subscribe({
      next: x => { this.foundCode = x.return },
      error: err => { this.notifier.notify('error',err.error.return) }
    })
  }
}
