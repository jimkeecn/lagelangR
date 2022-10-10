import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Org } from '../models/org';
import { Player } from '../models/player';
import { warship, warshipGroup } from '../models/warship';
import { DataService } from "../services/service.service"
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  code: string = "";
  logId: string = "";
  warshipJson:warship[] = [];
  warships = new FormControl([]);
  currentOrg: Org;
  playerName: string = "";
  playerCode: string = "";
  warshipList: warship[] = [];
  warshipGroup : warshipGroup[] = []
  constructor(private activeRoute: ActivatedRoute, private route: Router, private dataService : DataService) { 
    activeRoute.params.subscribe(x => { 
      this.code = x['code'];
      this.logId = x['id'];
      this.buildWarshipList();
    })

  }

  buildLog(data) {
    this.playerCode = data.id;
    this.playerName = data.name;
    this.warshipJson = data.warships;
    let selectValue = [];
    for (let x = 0; x < data.warships.length; x++) {
      selectValue.push(data.warships[x].id);
    }
    this.warships.setValue(selectValue);
  }
  ngOnInit(): void {
    this.dataService.getLogData(this.code, this.logId).subscribe({
      next: x => {  this.buildLog(x)}
    })
  }

  buildWarshipList():void{
    this.warshipList = this.dataService.warshipList;
    this.warshipGroup = this.dataService.warshipGroup;
  }

  buildWarship(id) {
    let found = this.dataService.warshipList.find(x =>  x.id == id );
    let object = warship.buildWarShip(found);
    return object;
  }

  isClose: boolean = true;
  valueSelected: warship[] = [];
  warshipSelected(event:any) {
    this.isClose = false;
    if(!event) {
      this.isClose = true;

      if (this.warships.value.length == 0) {
        this.warshipJson = [];
        return;
      }
      for (let x = 0; x < this.warships.value.length; x++) {
        let ws = this.buildWarship(this.warships.value[x]);
        let found = this.warshipJson.find(ship => ship.id == this.warships.value[x]);
        if (!found) {
          this.warshipJson.push(ws);
        }
        if (x == this.warships.value.length - 1) {
          let spliceIndexArray = [];
          for (let y = 0; y < this.warshipJson.length; y++){
            let sFound = this.warships.value.find(z => z == this.warshipJson[y].id);
            if (!sFound) {
              spliceIndexArray.push(y);
            }
          }
          spliceIndexArray.forEach((s,i) => { 
            this.warshipJson.splice(s - i, 1);
          })
        }
      }
    }
    
  }

  submit(): void {
    let player: Player = {
      id: this.playerCode.toString(),
      name: this.playerName,
      warships: this.warshipJson
    }
    this.dataService.editPlayerData(this.code, player).subscribe({
      next: x => {
        alert('修改成功');
        this.route.navigate(['/data', this.code])
      }, error: (err) => { alert(err.error.return); }
      });
    
  }
  
  return() {
    this.route.navigate(['/data', this.code])
  }

  delete() {
    let confirm = window.confirm("你确定要删除这个玩家的记录吗？");
    if (confirm) {
      let player: Player = {
        id: this.playerCode.toString(),
        name: this.playerName,
        warships: this.warshipJson
      }
      this.dataService.delelePlayer(this.code, player).subscribe({
        next: x => {
          alert('删除成功');
          this.route.navigate(['/data', this.code])
        }, error: (err) => { alert(err.error.return); }
        });
    }
  }

}
