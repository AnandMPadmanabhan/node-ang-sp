import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {DataserviceService} from '../dataService.service'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  uploadForm:FormGroup;
  loadComponent:boolean=false;
  loadlistItems:boolean=false;
  constructor(private _httpService:DataserviceService,private formBuilder: FormBuilder, private httpClient: HttpClient) {
    this.uploadForm = this.formBuilder.group({
      Site:new FormControl(''), 
      Email:new FormControl(''), 
      Password:new FormControl('')
    }); 
   }

  ngOnInit() {
  }

  onSubmit(){
    const formData = new FormData();
    formData.append('Site', this.uploadForm.get('Site').value);
    formData.append('Email', this.uploadForm.get('Email').value);
    formData.append('Password', this.uploadForm.get('Password').value); 
    console.log(this.uploadForm.value);
    console.log(formData);
  


this._httpService.addlistDetails(formData).subscribe((res : any[])=>{
  console.log(res);
  this.loadComponent = true;
  this._httpService.res=res;
});
  }
}