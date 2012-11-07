//packaged application compatability code
if (typeof iconsDir == "undefined") {
	//temporary fix for packaged application compatability
	var iconsDir = __dirname + '/content/icons';
}
if (typeof app == "undefined") {
	var app = require('appjs');
	app.serveFilesFrom(__dirname + '/content');
}
console.log("running packaged app.js");

var window = app.createWindow({
  width  : 640,
  height : 460,
  icons  : iconsDir
});

window.on('create', function(){
  console.log("Window Created");
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
