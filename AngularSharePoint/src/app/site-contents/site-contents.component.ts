import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {DataserviceService} from '../dataService.service';
import { Router,NavigationEnd  } from '@angular/router'; 
import { HomeComponent } from '../home/home.component';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-site-contents',
  templateUrl: './site-contents.component.html',
  styleUrls: ['./site-contents.component.css']
})
export class SiteContentsComponent implements OnInit {
  showres:any[];
  lists:string[]=[];
  doclibs:string[]=[];
  constructor(private router:Router,private _httpService:DataserviceService, private httpClient: HttpClient,
  private home:HomeComponent,private SpinnerService: NgxSpinnerService) { 

  }
  
  
  ngOnInit() {
    this.getData();
  }
  getData(){
    this.showres=this._httpService.res;
    this.showres.forEach(element => {
      if(element.BaseTemplate==100){
        this.lists.push(element.Title)
      }
      if(element.BaseTemplate==101){
        this.doclibs.push(element.Title)
      }
    });
  }

  onSelect(item,type){
    console.log(item);
    console.log(type);
    if(this.home.loadlistItems){
      this.home.loadlistItems=false;
    }
    this.SpinnerService.show();
    this._httpService.getlistItems(item,type).subscribe((res : any[])=>{
      console.log(res);
      this._httpService.list_item=res;
      if(this.home.loadlistItems){
        this.home.loadlistItems=false;
      }
     
      this.home.loadlistItems=true;
      this.SpinnerService.hide();
  });
}

}
