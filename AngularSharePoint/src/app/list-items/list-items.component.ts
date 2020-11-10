import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {DataserviceService} from '../dataService.service';
import { Router,NavigationEnd  } from '@angular/router'; 
import { element } from 'protractor';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css']
})
export class ListItemsComponent implements OnInit {
  listItems:any[];
  listFields:string[]=[];
  constructor(private router:Router,private _httpService:DataserviceService, private httpClient: HttpClient,
    private SpinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.get_listitems();
  }
 get_listitems(){
 this.listItems=this._httpService.list_item;
 this.listItems.forEach(element=>{
  this.listFields=Object.keys(element);
 })
 }
}
