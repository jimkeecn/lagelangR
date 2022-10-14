import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { DataService } from '../services/service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private readonly notifier: NotifierService;
  isShow: boolean = false;
  code: string = "";
  codeCompleted:boolean = false;
  constructor(private dataService:DataService,private route:Router,notifierService: NotifierService) { this.notifier = notifierService;}

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    birthday: new FormControl(new Date(), [Validators.required]),
    password: new FormControl('', [Validators.required]),
    passwordRepeat: new FormControl('', [Validators.required])
  });
  
  ngOnInit(): void {
  }

  goBack(): void{
    this.route.navigate(['/login']);
  }

  register(): void{
    let account = this.registerForm.value;
    if (this.registerForm.valid) {
      if (account.password === account.passwordRepeat) {
        console.log(account);
        let input = {
          name: account.name,
          birthday: new Date(account.birthday),
          password:account.password
        }
        console.log(input);
        this.dataService.register(input).subscribe({
          next: (x) => { 
            this.codeCompleted = true;
            this.code = x.return;
          },
          error: (err) => { 
            console.log(err);
            //alert(err.error.return);
            this.notifier.notify('success',err.error.return)
          }
        })
      } else {
        //alert("两次密码输入不相同")
        this.notifier.notify('error','两次密码输入不相同')
      }
    } else {
      //alert('请输入符合规格的名字生日和密码');
      this.notifier.notify('error','清输入符合规格的名字和密码')
    }
  }

  getDateString(date:Date) {
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDay();
    let combine = `${year}${month}${day}`;
    console.log(combine);
    return combine;
  }
}
