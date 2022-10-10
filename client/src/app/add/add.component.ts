import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Org } from '../models/org';
import { Player } from '../models/player';
import { warship, warshipGroup } from '../models/warship';
import { DataService } from "../services/service.service"
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  code: string = "";
  warshipJson:warship[] = [];
  warships = new FormControl([]);
  currentOrg: Org;
  playerName: string = "";
  playerCode: string = "";
  warshipList: warship[] = [];
  warshipGroup : warshipGroup[] = []
  constructor(private activeRoute: ActivatedRoute, private route: Router, private dataService : DataService) { 
    this.buildWarshipList();
    activeRoute.params.subscribe(x => { 
      this.code = x['code'];
    })

  }

  ngOnInit(): void {
  }

  buildWarshipList():void{
    this.warshipList = this.dataService.warshipList;
    this.warshipGroup = this.dataService.warshipGroup;
  }

  isClose: boolean = true;
  valueSelected: warship[] = [];
  warshipSelected(event:any) {
    this.isClose = false;
    if(!event) {
      this.isClose = true;
      this.warshipJson = this.warships.value;
    }
    
  }

  submit(): void {
    let player: Player = {
      id: this.playerCode.toString(),
      name: this.playerName,
      warships: this.warshipJson
    }
    this.dataService.savePlayerData(this.code, player).subscribe({
      next: x => {
        this.route.navigate(['/data', this.code])
      }, error: (err) => { alert(err.error.return); }
      });
    
  }
  
  return() {
    this.route.navigate(['/data', this.code])
  }
}
