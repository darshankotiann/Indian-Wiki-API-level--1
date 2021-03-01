const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true,useUnifiedTopology: true});
const articleSchema={
    title:String,
    content:String
}

const Article=mongoose.model("Article",articleSchema);
//Reequest targeting all articles
//chaining mehtod
app.route("/articles")
.get(function(req,res){
    Article.find(function(err,foundArticles){
        if(!err){
        res.send(foundArticles);
        }else{
            res.send(err);
        }
    });
})
.post(function(req,res){
    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save(function(err){
        if (!err){
            res.send("Sucessfully send data")
        }else{
            req.send(err)
        }
    } );
    })
.delete(function(req,res){
        Article.deleteMany(function(err){
            if(!err){
                res.send("Sucessfully deleted the data")
            }else{
                res.send(err)
            }
        });
    });

//Request targeting a specific articles

app.route("/articles/:articleTitle")

.get(function(req,res){
Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
        res.send(foundArticle);
    }else{
        res.send("No articles matching that title.")
    }
});
})

.put(function(req,res){
Article.update(
    {title:req.params.articleTitle},//Conditon
    {title:req.body.title,content:req.body.content},//updating
    {overwrite:true},//important staement
    function(err){//Finally call the call back function 
    if(!err){
        res.send("Sucessfully send the Upadetd the data");
    }else{
        res.send(err)
    }
}
    );//end od update
})

.patch(function(req,res){
Article.update(
    {title:req.params.articleTitle},//condition
    {$set:req.body},//update
function(err){
    if(err){
        res.send("sucessfully send the data");
    }else{
        res.send(err);
}
}
    );

})

.delete(function(req, res){

  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    }
  );
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});