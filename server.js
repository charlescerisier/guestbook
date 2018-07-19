let express = require('express'); 
let app =express(); 
let bodyParser = require('body-parser'); 
let session = require('express-session');


//Moteur de template
app.set('view-engine','ejs'); 

//Midllewares
app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json());

app.use(session({
    secret: 'lshdvklsdkvs', 
    resave : false, 
    saveUninitialized: true,
    cookie: {secure: false}

})); 

app.use(require('./middlewares/flash'));
let Message = require('./models/message.js');


app.get('/',function(request,response){
    
    Message.all(function (messages) {
    response.render('index.ejs', {messages: messages});
    })
    
}) ; 

app.post('/', function (request,response) {
    if(request.body.message === undefined ||request.body.message==="") {
        request.flash('error',"Vous n'avez pas rentré de message");
        response.redirect('/');
    } else {
        
        Message.create(request.body.message, function() {
        request.flash('success','Votre mesage a bien été envoyé');
        response.redirect('/');
        })

    }
    
}); 

app.get('/comment/:id', function(request,response){
    Message.find(request.params.id, function(message) {
        response.render('show.ejs',{message: message});
    });
});

app.listen(8080);