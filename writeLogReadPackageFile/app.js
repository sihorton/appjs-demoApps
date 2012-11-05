if (!app) {
	var app = module.exports = require('appjs');
	app.serveFilesFrom(__dirname + '/content');
}

console.log("running writeLogReadPckageFile app.js");
console.log("running from:",__dirname);
//try reading a package file..
app.readPackageFile("packageFile.txt",function(err,buffer) {
	if (err) throw err;
	console.log("read packageFile.txt");
	console.log(buffer.toString());
	//try writing a log file..
	var fs=require('fs');
	fs.writeFile("application.running.log", "Still possible to write files from a packaged application\n"+buffer.toString(), function(err) {
			if(err) {
				console.log("error writing file:",err);
			} else {
				console.log("wrote file: application.running.log");
			}
	}); 
});