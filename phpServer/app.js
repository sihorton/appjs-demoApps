var app = module.exports = require('appjs')
	path = require("path")
	fs = require("fs")
	mime = require("mime")
;
var phpExe = "__path_to_php_executable__";

var phpRouter = function router(request, response, next){
	if (request.method === 'get') {
		console.log("request",request.pathname);
		var url = request.pathname === '/' ? '/index.html' : request.pathname;
		var mimetype = mime.lookup(url);
		if (path.extname(url) == '.php') {
			mimetype = "text/html";
			var exec = require('child_process').exec;
			var cmd = phpExe+' "'+__dirname+"/content/"+url.substring(1)+'"';
			console.log("running:"+cmd);
			exec(cmd,function(error,stdout,sterr) {
				if (error || sterr) {
					console.log(error||sterr);
					//response.send(500,'text/plain',new Buffer("500: Internal Server Error\n"+(error||sterr), "utf-8"));
				} 
				response.send(200,mimetype,stdout);
			});
		} else {
			//alternative is to call next() and let another router handle normal files.
			console.log('serving:'+'/content/'+url.substring(1));
			fs.readFile(__dirname+'/content/'+url.substring(1),function(err,buffer) {
				if (err) {
					response.send(500,'text/plain',new Buffer("500: Internal Server Error\n"+err, "utf-8"));
				} else {
					response.send(200,mimetype,buffer);
				}
			});
		}
	} else {
		next();
	}
};

app.router.use(phpRouter);

var window = app.createWindow({
  width  : 640,
  height : 460,
  icons  : __dirname + '/content/icons'
});

window.on('create', function(){
  window.frame.show();
  window.frame.center();
});

window.on('ready', function(){
  console.log("Window Ready");
  window.require = require;
  window.process = process;
  window.module = module;

  function F12(e){ return e.keyIdentifier === 'F12' }
  function Command_Option_J(e){ return e.keyCode === 74 && e.metaKey && e.altKey }

  window.addEventListener('keydown', function(e){
    if (F12(e) || Command_Option_J(e)) {
      window.frame.openDevTools();
    }
  });
});

window.on('close', function(){
  console.log("Window Closed");
});