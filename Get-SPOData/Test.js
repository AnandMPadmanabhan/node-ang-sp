const JsomNode = require('sp-jsom-node').JsomNode;
let settings = require('./config/private.json');

let jsomNodeOptions = {
    siteUrl: settings.siteUrl,
    authOptions: {
        ...(settings)
    }
};

(new JsomNode(jsomNodeOptions)).init(); 
//new JsomNode().wizard().then((settings) => {

    // Here we are, ready fo JSOM

    const ctx = SP.ClientContext.get_current();
    const oWeb = ctx.get_web();

    ctx.load(oWeb);

    ctx.executeQueryAsync(() => {
        console.log(oWeb.get_title());
    }, (sender, args) => {
        console.log(args.get_message());
    });


//}).catch(console.log);