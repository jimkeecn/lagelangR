import { Injectable } from '@angular/core';
import { Org } from '../models/org';
import { environment  } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, merge, Observable ,tap} from 'rxjs';
import { Player } from '../models/player';
import { warship, warshipGroup } from '../models/warship';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  url = environment.url;
  constructor(private http:HttpClient) { }


  getPlayerData(orgId: string): Observable<any[]>{
    let url = `${this.url}/data/${orgId}`;
    return this.http.get<any[]>(url).pipe(map(x => { 
      let players = [];
      for (let key in x) {
        players.push(x[key])
      }
      return players;
    }));
  }

  getLogData(orgId: string,logId:string): Observable<any>{
    let url = `${this.url}/data/${orgId}/${logId}`;
    return this.http.get<any>(url);
  }

  getWarships(): Observable<any[]>{
    let url = `${this.url}/ships`;
    return this.http.get<any[]>(url);
  }

  savePlayerData(orgId: string, player: any): Observable<Player>{
    let passwordObj = this.getPasswordLocally();
    if (!passwordObj) {
      alert("你没有权限");
      return new BehaviorSubject<any>(null);
    }
    player.password = passwordObj.password;
    let url = `${this.url}/data/${orgId}/${player.id}`;
    return this.http.post<Player>(url,player);
  }

  editPlayerData(orgId: string, player: any): Observable<Player>{
    let passwordObj = this.getPasswordLocally();
    if (!passwordObj) {
      alert("你没有权限");
      return new BehaviorSubject<any>(null);
    }
    player.password = passwordObj.password;
    let url = `${this.url}/edit/${orgId}/${player.id}`;
    return this.http.post<Player>(url,player);
  }


  submitGuildInfo(password: string, guildInfo: any): Observable<any>{
    let url = `${this.url}/management/${password}`;
    return this.http.post<any>(url,guildInfo);
  }

  register(account: any): Observable<any>{
    let url = `${this.url}/createAccount`;
    return this.http.post<any>(url,account);
  }

  loginWithPassword(login: any): Observable<any>{
    let url = `${this.url}/loginWithPassword`;
    return this.http.post<any>(url, login);
  }

  getGuildCode(account: any): Observable<any>{
    let url = `${this.url}/getGuildCode`;
    return this.http.post<any>(url,account);
  }

  delelePlayer(orgId: string, player: any): Observable<any>{
    let passwordObj = this.getPasswordLocally();
    if (!passwordObj) {
      alert("你没有权限");
      return new BehaviorSubject<any>(null);
    }
    player.password = passwordObj.password;
    let url = `${this.url}/delete/${orgId}/${player.id}`;
    return this.http.post<any>(url,player);
  }

  setPasswordLocally(id, password): void{
    this.clearPasswordLocally();
    localStorage.setItem('Lagerang-password', JSON.stringify({ id: id, password: password }));
  }

  getPasswordLocally(): any{
    let data = localStorage.getItem('Lagerang-password');
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  clearPasswordLocally(): void{
    localStorage.removeItem('Lagerang-password');
  }

  warshipList: warship[] = [];
  warshipGroup : warshipGroup[] = [
    {
      disabled: false,
      name: 'hwj',
      namecn: '护卫舰',
      warships:[]
    },
    {
      disabled: false,
      name: 'qzj',
      namecn: '驱逐舰',
      warships:[]
    },
    {
      disabled: false,
      name: 'xyj',
      namecn: '巡洋舰',
      warships:[]
    },
    {
      disabled: false,
      name: 'hht',
      namecn: '护航艇',
      warships:[]
    },
    {
      disabled: false,
      name: 'zj',
      namecn: '战机',
      warships:[]
    },
    {
      disabled: false,
      name: 'hkmj',
      namecn: '航空母舰',
      warships:[]
    },
    {
      disabled: false,
      name: 'zyj',
      namecn: '支援舰',
      warships:[]
    },
    {
      disabled: false,
      name: 'zlxyj',
      namecn: '战列巡洋舰',
      warships:[]
    },
  ]
  
  buildWarshipList(){
     this.getWarships().subscribe(x => { 
      this.warshipList = x;
      x.forEach(x => { 
        let object = warship.buildWarShip(x);
        for (let n = 0; n < this.warshipGroup.length; n++){
          if (object.type == this.warshipGroup[n].name) {
            this.warshipGroup[n].warships.push(object);
          }
        }
      })
     })
  }
}
