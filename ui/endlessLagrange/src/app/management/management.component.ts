import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/service.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {

  password: string = "";
  guild_id: string = "";
  guild_password: string = "";
  guild_access_all: boolean = false;
  display: boolean = false;
  constructor(private dataService:DataService) { }

  ngOnInit(): void {
  }

  submitPassword() {
    if (this.password.length > 6) {
      this.display = true;
    } else {
      alert("Please enter correct password..")
    }
  }

  submitGuild() {
    let guild = {
      guildId: this.guild_id,
      guildPassword: this.guild_password,
      guildAccess:this.guild_access_all
    }

    this.dataService.submitGuildInfo(this.password, guild).subscribe(x => { 
      alert(x.return);
    })
    console.log(guild);
  }

}
