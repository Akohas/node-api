function mongoRequire( app, MongoClient ){

  let promise = new Promise(function(resolve, reject){

    MongoClient.connect('mongodb://localhost:27017/api', function(err, database){
      if( err ){
        reject( err )
      }else{
        app.listen(8000, function(){
          console.log('api started');
        });
        resolve( database );
      }

    })

  });

  return promise;

}

module.exports = mongoRequire;