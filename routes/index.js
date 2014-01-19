exports.layout = function(req, res){
  res.render('layout')
}

exports.partials = function (req, res) {
  res.render('partials/' + req.params.name)
}

exports.auth = function(req, res) {
  res.render('partials/auth')
}