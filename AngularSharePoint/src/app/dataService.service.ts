import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataserviceService {
  body:FormData;
  res:any[];
  list_item:any[];
  item:string;
  constructor(private http:HttpClient) { }
  getUserDetails(){
    return this.http.get("http://localhost:8081/getAll",
    {responseType: 'json'});
 
   }
   addlistDetails(body){
    return this.http.post("http://localhost:8080/get",body);
   }
   getlistItems(item,type){
    return this.http.post("http://localhost:8080/getlistitems",{item,type});
 
   }
   deleteUserDetails(id){
     return this.http.delete("http://localhost:8081/del_user/"+id);
   }
}
