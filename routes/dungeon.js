/*
 * GET home page.
 */

exports.get = function(req, res){
  var mongoose = require('mongoose')
, db = mongoose.createConnection('mongodb://localhost/dungeonCity');

  // console.log(req.query);

  // setup database & db entity schemas
  var dungeonSchema, Dungeon;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log('mongoose connection open!');

    dungeonSchema = new mongoose.Schema({
      // _id: ObjectId,
      name: String,
      type: String
    });

    Dungeon = db.model('Dungeon', dungeonSchema);

    Dungeon.find({
      _id: req.query['id']
    },function (err, dungeonMatches) {
      if (err) {
        console.log("Error getting dungeon: " + err); //handle the error
      } else {
        console.log(dungeonMatches);

        res.send(JSON.stringify(dungeonMatches));
      }
    });
  });

  function getNextSequence(name) {
   var ret = db.counters.findAndModify(
          {
            query: { _id: name },
            update: { $inc: { seq: 1 } },
            new: true
          }
   );

   return ret.seq;
}
  
          

  //res.render('index', { title: 'Express' });
  // res.render("index.html");
  // res.render(__dirname + "/../public/index.html");
};