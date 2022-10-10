import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

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
  
  constructor(private route:Router,private dataService:DataService) { }

  ngOnInit(): void {
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
        alert(err.error.return);
      }
    }
    )
  }

  findCode(): void{
    let form = this.codeForm.value;
    this.dataService.getGuildCode(form).subscribe({
      next: x => { alert('你的口令是:'+ x.return) },
      error: err => { alert(err.error.return )}
    })
  }
}
