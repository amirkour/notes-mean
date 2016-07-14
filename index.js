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

    db = require('./notes-mysql/models/index.js'),
    app = express();
    

app.use(bodyparser.json()); // for parsing application/json
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(absolutePathToPublicAssets));
app.use(stylus.middleware(absolutePathToPublicAssets));
app.set('views', absolutePathToViewFolder);
app.set('view engine', 'jade');

app.get("/api/tags",function(req,res){

    db.Tags.findAll().then(function(tags){
        console.log("Sending back tags:\n" + JSON.stringify(tags) + "\n");
        res.json(tags);
    }).catch(function(err){
        console.log("got an error finding all tags: " + err);
        res.status(500).json(err);
    });

});
app.post("/api/tags",function(req,res){
    console.log("creating new tag");

    if(!req.body || !req.body.name){
        res.status(400).json({error: 'name required'});
        return;
    }

    db.Tags.create({name: req.body.name}).then(function(obj){
        console.log("successfully created new tag: " + obj);
        res.json(obj);
    }).catch(function(err){
        console.log("error creating new tag: " + err);
        res.status(500).json(err);
    });
});
app.put("/api/tags/:id", function(req,res){
    console.log("updating tag " + req.params.id);
    db.Tags.update({name: req.body.name}, {where: {id: req.params.id}})
           .spread(function(numAffected, rowsAffected){
                res.json(numAffected);
           })
           .catch(function(err){
                res.status(500).json(err);
           });
});
app.delete("/api/tags/:id", function(req,res){
    console.log("deleting tag " + req.params.id);

    db.Tags.destroy({where:{id:req.params.id}}).then(function(numDeleted){
        res.json(numDeleted);
    }).catch(function(err){
        res.status(500).json(err);
    });
});

app.get("/", function(req,res){
    res.render('index');
});

console.log('listening on port ' + port);
app.listen(port);
