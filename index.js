var express = require('express')
var app = express()
var fs = require('fs')
var path = require('path')
var _ = require('lodash')
var engines = require('consolidate')
app.engine('hbs',engines.handlebars)
app.set('views','./views')
app.set('view engine','hbs')
app.use('/profile', express.static('images'))
app.get('/',function (req,res) {

  //build trigger
  var  users = []
  fs.readdir('users',function (err,files) {
    files.forEach(function (file) {
      fs.readFile(path.join(__dirname,'users',file),{encoding:'utf8'},function (err,data) {
        if(err) {
          throw err
        }
        var user = JSON.parse(data)
        user.name.full = _.startCase(user.name.first+' '+user.name.last)
        users.push(user)
        if(users.length === files.length) {
          res.render('index',{users:users})
        }
      })
    })
  })
})

app.get('/:username',function (req,res) {
  var user = getUser(req.params.username)
  res.render('user',{username: req.params.username})
})

function getUserFilePath(username) {
  return path.join(__dirname,'users',username+'.json')
}
function getUser(username) {
    var user = JSON.parse(fs.readFileSync(getUserFilePath(username),{encoding:'utf8'}))
    return user;
}

var server = app.listen(3020,function () {
    console.log('Sever running at http://localhost:'+server.address().port)
})
