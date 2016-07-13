var Promise = require('es6-promise').Promise,
    express = require('express'),
    path = require('path'),
    fs = require('fs'),
    stylus = require('stylus'),
    bodyparser = require('body-parser'),

    // the port this app will be listening on
    port = process.argv[2] || 3000,

    // this has to be the fully-qualified path to a folder, typically "/public",
    // where public/static assets will be served from
    absolutePathToPublicAssets = path.join(__dirname, 'public'),

    // this has to be the fully-qualified path to a folder, typically "/templates",
    // where view templates will be found
    absolutePathToViewFolder = path.join(__dirname, 'views'),
    app = express();
    

app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(absolutePathToPublicAssets));
app.use(stylus.middleware(absolutePathToPublicAssets));
app.set('views', absolutePathToViewFolder);
app.set('view engine', 'jade');

app.get("/api/tags",function(req,res){
    var tags = [
        {id:1, name:'bogus one'},
        {id:2, name:'bogus two'}
    ];

    console.log("Sending back tags:\n" + JSON.stringify(tags) + "\n");
    res.json(tags);
});

app.get("/", function(req,res){
    res.render('index');
});

console.log('listening on port ' + port);
app.listen(port);
