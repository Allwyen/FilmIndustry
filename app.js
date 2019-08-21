const Express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const Mongoose = require('mongoose');

var app = new Express();

app.set('view engine','ejs');

app.use(Express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

Mongoose.connect("mongodb+srv://mongodb:mongodb@mycluster-ucvz5.mongodb.net/filmindustrydb?retryWrites=true&w=majority");

const MovieModel = Mongoose.model("movies",{
    mname:String,
    mproducer:String,
    mdirector:String,
    mactor:String,
    mactress:String,
    mryear:String,
    mlanguage:String,
    meditor:String,
    mcamera:String,
    mdistributer:String
});

app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/addmovie',(req,res)=>{
    res.render('addmovie');
})

app.post('/addAPI',(req,res)=>{
    var movie = new MovieModel(req.body);
    var result = movie.save((error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send("<script>alert('Movie Inserted')</script><script>window.location.href='/addmovie'</script>");
        }
    });
});

app.get('/movieall',(req,res)=>{

    var result = MovieModel.find((error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    });

});

const APIurl = "https://filmindustry-allwyen.herokuapp.com/movieall"

app.get('/viewmovie',(req,res)=>{
    request(APIurl,(error,response,body)=>{
        var data = JSON.parse(body);
        res.render('viewmovie',{data:data});
    });
});

app.listen(process.env.PORT || 3456,()=>{
    console.log('Server running in PORT:3456');
})