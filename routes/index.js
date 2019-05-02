var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var database = require('../config/database');

/* GET home page. */
router.get('/', function(req, res, next) {
    var postsArray = [];
    MongoClient.connect(database.url, function(err, db) {
        var db = db.db(database.database);
        if (!err) {
            console.log("We are connected");
            var postsCollection = db.collection('posts');
            postsCollection.find().limit(1).sort({ $natural : -1 }).toArray(function(err, postDoc) {
                console.log("Printing Posts from Array");
                response = {
                    "post:": postDoc[0]
                };
                console.log(response);
                res.render('index', {
                    post: postDoc[0]
                });
                //res.end(JSON.stringify(response));
            });
        } else {
            console.log("error:" + err);
            res.end("error: " + err);
        }
    });
});


 router.post('/insert_post', function(req, res, next) {
    var postsArray = [];
    MongoClient.connect(database.url, function(err, db) {
        var db = db.db(database.database);
        if (!err) {
            console.log("We are connected");
            var postsCollection = db.collection('posts');
            console.log("request: "+JSON.stringify(req.body));
            var postObject = {
              title: req.body.title,
              body: req.body.body,
              author: {
                name: req.body.author_name,
                email: req.body.author_email
              }
            }
            postsCollection.insertOne(postObject, function(err, response) {
                console.log("Inserted Post: "+JSON.stringify(response.ops[0]));
                res.render('index', {
                    post: response.ops[0]
                });
            });
        } else {
            console.log("error:" + err);
            res.end("error: " + err);
        }
    });
});
module.exports = router;
