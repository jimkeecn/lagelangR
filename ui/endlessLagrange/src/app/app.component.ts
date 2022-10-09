import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './services/service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '拉格朗日数据网 by Litteam';
  constructor(private dataService:DataService,private route:Router) {
    this.dataService.buildWarshipList();
    let data = this.dataService.getPasswordLocally();
    console.log('logon',data)
    if (data) {
      this.route.navigate(['/data', data.id])
    }
 }
}
