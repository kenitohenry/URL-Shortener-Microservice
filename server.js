// server.js
// load the things we need
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URI||"mongodb://kenitohenry:drUmmond12@ds115214.mlab.com:15214/fccproject-url-shortener");
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("we need some hot stuff, Database connected");

});


const urlSchema = new mongoose.Schema({
  name: String,
  url:String,
  shortUrl:Number,
  gen:Number
 
});
const URLs = mongoose.model('URLs', urlSchema);

app.use(bodyParser.urlencoded({ extended: true }));

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
  URLs.find({gen:3},"-_id  -gen -__v" ,(err, data)=>{
    if (err){
      res.send('<h2>Error Page i hope never shows</h2>')
    }
    res.render('index',{data:data})
  })
    
});
app.get('/api/shorturl/:num', function(req,res){
  URLs.find({shortUrl:req.params.num},"-_id -name -gen -__v" ,(err, data)=>{
    if (err){
      res.send('<h2>Ooops Not Created yet try a lower number</h2>')
    }
    res.redirect(data[0].url);
  })
  
})

app.post("/api/shorturl/new", function(req,res){
 
  const regex=/https?\:\/\/.+\../;
 if(regex.test(req.body.url)){
  
   URLs.count({gen: 3}, function(err, c) {
    if (err) throw err;
    const u =new URLs({ name: req.body.name, url:req.body.url,shortUrl:c, gen:3  });
      u.save(function (err, url) {
        if (err){ return console.error(err)}
         else{ res.json({original:url.url,short:url.shortUrl,shortenedBy:"You"}); }
      });
});
 
  
} 
else{res.json({"error":"invalid URL"})}

});

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
