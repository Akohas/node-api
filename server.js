let express = require('express');
let bodyParser = require('body-parser');
let MongoClient = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID;
let morgan = require('morgan');

let mongoDBmodule = require('./custom_modules/mongo-require.js');
let app = express();
let db;

app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/static'));
app.use(morgan('combined'));

app.use(function(req, res, next){         
  console.log('%s %s', req.method, req.url);
  next();
});

app.get('/', function( req, res ){

  let data;

    db.collection('tasks').find().toArray(function(err, docs){
      if(err){
        data = 500;
        res.send('<h2> Ошибка 500 </h2>')
      }else{
        data = docs;

        res.render('index',{
          data
        });

      }
    });

  
});

app.post('/add', function( req, res ){

  [date, title, description, id] = 
  [req.body.date, req.body.title, req.body.description];

  if( !date || !title || !description ){
    return res.status( 400 ).send('Неправильно введёднные данные');
  }

  let task = {
    date,
    title,
    description,
    done: false
  };

  

  db.collection('tasks').insert( task, function(err, result){
    if(err){
      console.log( err );
      return res.sendStatus( 500 );
    }else{

      db.collection('tasks').find().toArray(function( err, docs ){
        if( err ){
          return res.sendStatus( 500 );
        }

        return res.send( docs );
      });

    }

  });

});

app.post('/del', function( req, res ){

  let idToDelete = req.body.id;

  if( !idToDelete ){
    return res.status( 400 ).send('Для удаление требуется ID');
  }

  db.collection('tasks').deleteOne({
    _id: ObjectID(idToDelete)
  }, function(err, result){
    if( err ){
      console.log( err );
      return res.sendStatus( 500 );
    }

    if( result ){

      db.collection('tasks').find().toArray(function( err, docs ){
        if( err ){
          return res.sendStatus( 500 );
        }

        return res.send( docs );
      });


    }
    
  });

});

  mongoDBmodule( app, MongoClient  )
    .then( function( database ){ return db = database; } )
    .catch( function error(err){ console.log(err) } );

