
/*
 * GET home page.
 */

exports.index = function(req, res){
  //res.render('index', { title: 'Express' });
  // res.render("index.html");
  res.render(__dirname + "/../public/index.html");
};