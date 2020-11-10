var express = require('express')
var app = express();
var spauth = require('node-sp-auth');  
var requestprom = require('request-promise');
var formidable = require('formidable');
var cors=require('cors');
var util = require('util');
app.use(cors())
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var site="";
var uname="";
var paswd=""; 
var listFields=[]; 
var listViewFields=[];
var listItems;

Object.defineProperty(exports, "__esModule", { value: true });
var sp_jsom_node_1 = require("sp-jsom-node");
var returnedItems;

var context;
var server = app.listen(8080, function () { 
var host = server.address().address
var port = server.address().port
console.log("Example app listening at http://%s:%s", host, port)

})

app.get('/', function (req, res)
{ 
    res.writeHead(200, {"Content-Type": "text/html"});
    console.log("server is started <---HTTP SERVER NODE--->");
    // write HTML over the browser 
    res.write("<p>Welcome</p>");
   // here create html form for file upload 
   res.write('<form action="/getlistitems" method="post">');
   res.write('Site: <input type="text" name="site"><br>');
   res.write('Username: <input type="text" name="name"><br>');
   res.write('Password: <input type="text" name="pwd"><br>');
   res.write('<input type="submit">');
   res.write('</form>');
    res.end();
})

app.post('/get', function (req, res) 
  
{ 
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if (err) {

      console.error(err.message);
      return;
    }
  // res.writeHead(200, {'content-type': 'text/plain'});
    res.setHeader('content-type','application/json');
   // res.write('received upload:\n\n');

    

    console.log(util.inspect({fields: fields, files: files}));
    site=String(fields.Site);
    uname=String(fields.Email);
    paswd=String(fields.Password);

console.log("Got a POST request for the homepage"); 
   
spauth.getAuth(site, {          
    username:uname,  
    password:paswd  
})  
.then(function(options){  
    // Headers  
    var headers = options.headers;  
    headers['Accept'] = 'application/json;odata=verbose';  
    // Pull the SharePoint list items  
    requestprom.get({  
        url: site+"/_api/web/lists",  
        headers: headers,  
        json: true  
    }).then(function(listresponse){  
        var items = listresponse.d.results;  
        var responseJSON = [];  
        // process  
        items.forEach(function(item) {  
            if(item.Title !=null){  
                responseJSON.push(item);  
            }                     
        }, this);  
        // Print / Send back the data  
        console.log(JSON.stringify(responseJSON));
        var response=JSON.stringify(responseJSON);
        //res.json(response);
        res.end(JSON.stringify(responseJSON));  
          
    });  
});  
});
})

app.post('/getlistitems', function (req, res) {
    var listName=req.body.item;
    var list_type=req.body.type;
    var option;
    spauth.getAuth(site, {          
        username:uname,  
        password:paswd  
    })  
    .then(function(options){ 
        option=options;
    listFields= getViewFields(site,options,listName,list_type)}).then(()=>{
        setTimeout(()=>{
            console.log(listFields);
            listViewFields=getAllFields(site,option,listName);
        },3000)
        
    }).then(()=>{
        setTimeout(()=>{
            console.log(listViewFields);
            authOptions1 = {
                "siteUrl": site,
                "strategy": "UserCredentials",
                "password": paswd,
                "username": uname,
                "online": true
            };
            var authContext = {
                siteUrl: authOptions1.siteUrl,
                authOptions: authOptions1
            };
            console.log(authContext);
            context = new sp_jsom_node_1.JsomNode().init(authContext).getContext();
            getlistitems(listName);
        },20000)
    }).then(()=>{
        setTimeout(()=>{
            console.log(listItems);
            res.end(JSON.stringify(listItems));
        },30000)
        
    })   
});

function getAllFields(site,options,listName){
      console.log(site);
      var responseJSON=[];
        var headers = options.headers;  
        headers['Accept'] = 'application/json;odata=verbose';  
        // Pull the SharePoint list items  
        requestprom.get({  
            url: site+"/_api/web/lists/GetByTitle('"+listName+"')/fields",  
            headers: headers,  
            json: true  
        }).then(function(listresponse){  
            console.log("here");
            var fields = listresponse.d.results;
            
           fields.forEach(function(field) {
           if(listFields.includes(field.Title,0)){
              
            responseJSON.push([field.Title,field.TypeDisplayName]);
        }
        }, this);


    });
    return responseJSON;
}

function getViewFields(site,options,listName,list_type){
    var response=[];
    var headers = options.headers;  
    var rest_url="";
    if(list_type=="doc"){
        rest_url="/_api/web/lists/GetByTitle('"+listName+"')/Views/getbytitle('All Documents')/ViewFields";
    }
    else{
        rest_url="/_api/web/lists/GetByTitle('"+listName+"')/Views/getbytitle('All Items')/ViewFields";
    }
    headers['Accept'] = 'application/json;odata=verbose';  
    // Pull the SharePoint list items  
    requestprom.get({  
        url: site+rest_url,  
        headers: headers,  
        json: true  
    }).then(function(listresponse){  
        fields = listresponse.d.Items.results;  
       fields.forEach(function(field) {  
        response.push(field);
                            
     }, this); 
     });   
    return response;
     }


function getItems(site,options,select,expand,listName){
    var query;
    if(expand!=null){
     query="/_api/web/lists/GetByTitle('"+listName+"')/items?$select="+select+"&$expand="+expand
    }
    else{
        query="/_api/web/lists/GetByTitle('"+listName+"')/items?$select="+select
    }
    var responseJSON = [];  
     console.log(query);
    var headers = options.headers;  
    headers['Accept'] = 'application/json;odata=verbose';  
    // Pull the SharePoint list items  
    requestprom.get({  
        url: site+query,  
        headers: headers,  
        json: true  
    }).then(function(listresponse){  
        var items = listresponse.d.results;  
        // process  
        items.forEach(function(item) {  
            if(item !=null){  
                responseJSON.push(item);  
            }                     
        }, this);  
        // Print / Send back the data  
        
        //response=JSON.stringify(responseJSON);
        //res.json(response);
        //console.log(responseJSON);
          
    });   
    return responseJSON;
   }






function getlistitems(listName){

       
    var list = context.get_web().get_lists().getByTitle(listName);
    var caml = new SP.CamlQuery();
    caml.set_viewXml("<View><Query></Query></View>");
    returnedItems = list.getItems(caml);
    context.load(returnedItems);
    var response=[];
    response=context.executeQueryAsync(onSucceededCallback, onFailedCallback);
    console.log("Here"+ response);
    return response;

}
function onSucceededCallback(sender, args) {
    var enumerator = returnedItems.getEnumerator();
    //Formulate HTML from the list items   
    //var keys=["Project","Task"];
    var respose=[];
    //Loop through all the items   
    while (enumerator.moveNext()) {
        var listItem = enumerator.get_current();
       // var companyName = listItem.get_item("Task");
        //var Industry = listItem.get_item("Project").get_lookupValue();
        var obj={};
        listViewFields.forEach(element=>{
            if(element[1]=="Lookup"&&element[0]!="Modified"){
              obj[element[0]]=listItem.get_item(element[0]).get_lookupValue();
            }
            else if(element[1]=="Person or Group"){
                obj[element[0]]=listItem.get_item(element[0]).get_lookupValue();
              }
            else{
             obj[element[0]]=listItem.get_item(element[0]);
            }
         });
        obj["Title"]=listItem.get_item("Title");
        respose.push(obj);
    }
     console.log(respose);
    //Display the formulated HTML in the displayDiv element   
     listItems=respose;
     
}
//This function fires when the query fails   
function onFailedCallback(sender, args) {
    //Formulate HTML to display details of the error   
    var markup = '<p>The request failed: <br>';
    markup += 'Message: ' + args.get_message() + '<br>';
    //Display the details   
    console.log(markup);
}
 