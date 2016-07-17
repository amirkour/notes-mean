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

    db.Tag.findAll().then(function(tags){
        console.log("Sending back tags:\n" + JSON.stringify(tags) + "\n");
        res.json(tags);
    }).catch(function(err){
        console.log("got an error finding all tags: " + err);
        res.status(500).json(err);
    });

});
app.post("/api/tags",function(req,res){
    console.log("creating new tag");

    var tag = db.Tag.build({
        name: req.body.name
    });

    tag.save().then(function(tag){
        res.json(tag);
    }).catch(function(err){
        console.log("error creating new tag: " + err);
        res.status(500).json(err);
    });
});
app.put("/api/tags/:id", function(req,res){
    console.log("updating tag " + req.params.id);

    db.Tag.findById(req.params.id).then(function(tag){
        tag.name = req.body.name;
        return tag.save();
    }).then(function(updated){
        res.json(updated);
    }).catch(function(err){
        console.log("got an error: " + JSON.stringify(err));
        res.status(500).json(err);
    });
});
app.delete("/api/tags/:id", function(req,res){
    console.log("deleting tag " + req.params.id);

    db.Tag.destroy({where:{id:req.params.id}}).then(function(numDeleted){
        res.json(numDeleted);
    }).catch(function(err){
        res.status(500).json(err);
    });
});
app.post("/api/notes", function(req,res){
    if(!req.body.title){
        res.status(400).json({error: "Missing required title"});
        return;
    }

    var note = db.Note.build({
        title: req.body.title,
        body: req.body.body
    });

    note.save().then(function(note){
        res.json(note);
    }).catch(function(err){
        res.status(500).json(err);
    });
});
app.get("/api/notes", function(req,res){
    db.Note.findAll().then(function(notes){
        res.json(notes);
    }).catch(function(err){
        res.status(500).json(notes);
    });
});
app.delete("/api/notes/:id", function(req,res){
    db.Note.destroy({where: {id: req.params.id}}).then(function(numDeleted){
        res.json(numDeleted);
    }).catch(function(err){
        res.status(500).json(err);
    });
});
app.get("/api/notes/:id", function(req,res){
    db.Note.findById(req.params.id).then(function(note){
        res.json(note);
    }).catch(function(err){
        res.status(500).json(err);
    });
});
app.put("/api/notes/:id", function(req,res){
    db.Note.findById(req.params.id).then(function(note){
        note.set({
            title: req.body.title,
            body: req.body.body
        });
        return note.save();
    }).then(function(note){
        res.json(note);
    }).catch(function(err){
        res.status(500).json(err);
    });
});

app.get("/", function(req,res){
    res.render('index');
});

console.log('listening on port ' + port);
app.listen(port);
