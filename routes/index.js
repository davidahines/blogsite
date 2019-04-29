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
            postsCollection.find({}).toArray(function(err, postDocs) {
                console.log("Printing Posts from Array");
                postDocs.forEach(function(post) {
                    postsArray.push(post);
                });
                response = {
                    "posts": postsArray
                };
                console.log(response);
                res.render('index', {
                    posts: postsArray
                });
                //res.end(JSON.stringify(response));
            });
        } else {
            console.log("error:" + err);
            res.end("error: " + err);
        }
    });

});

module.exports = router;
