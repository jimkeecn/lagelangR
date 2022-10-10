import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Org } from '../models/org';
import { Player } from '../models/player';
import { warship } from '../models/warship';
import { DataService } from '../services/service.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
  
export class TableComponent implements OnInit {

  selectValue: string = "";
  warshipJson: warship[] = [];
  selectedValue: Player[] = [];
  orginalValue: Player[] = [];
  editable: boolean = false;
  code: string = "";
  org:Org;
  constructor(private activeRoute : ActivatedRoute, private route:Router,private dataService:DataService) { 
    activeRoute.params.subscribe(x => { 
      this.code = x['code'];
      this.dataService.getPlayerData(this.code).subscribe(x => { 
        if (x && x.length > 0) {
          this.selectedValue = x;
          this.orginalValue = x;
        }
      });
    })
    let data = this.dataService.getPasswordLocally();
    if (data) {
      this.editable = true;
    }
  }

  ngOnInit(): void {
    console.log(this.code)
  }




  add():void {
    this.route.navigate(['add'], {relativeTo:this.activeRoute})
  }

  view(id):void {
    this.route.navigate(['edit',id],{relativeTo:this.activeRoute})
  }


  getImg(type): string{
    return `../../assets/img/${type}.svg`
  }

  getColor(points): string{
    if (points >= 100) {
      return "#f1c622"
    } else {
      return "#777777"
    }
  }

  getPoints(points): number{
    if (points > 999) {
      return 9999;
    } else {
      return points
    }
  }


  search() {
    console.log(this.selectValue);
    let found_value = this.orginalValue.filter(x =>
      x.id.includes(this.selectValue) || x.name.includes(this.selectValue) 
    )
    this.selectedValue = found_value;
    console.log(found_value);
  }

  edit(id) {
    
  }

  logout() {
    this.dataService.clearPasswordLocally();
    this.route.navigate(['/login'])
  }
}
