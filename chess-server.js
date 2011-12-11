var app = require('express').createServer()
  , io = require('socket.io').listen(app);
	
	app.listen(9000);

// Définition des liens
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.get('/js/scripts.js', function (req, res) {
  res.sendfile(__dirname + '/js/scripts.js');
});
app.get('/js/jquery.min.js', function (req, res) {
  res.sendfile(__dirname + '/js/jquery.min.js');
});
	app.get('/img/11.png', function (req, res) {
	  res.sendfile(__dirname + '/img/11.png');
	});
	app.get('/img/12.png', function (req, res) {
	  res.sendfile(__dirname + '/img/12.png');
	});
	app.get('/img/13.png', function (req, res) {
	  res.sendfile(__dirname + '/img/13.png');
	});
	app.get('/img/14.png', function (req, res) {
	  res.sendfile(__dirname + '/img/14.png');
	});
	app.get('/img/15.png', function (req, res) {
	  res.sendfile(__dirname + '/img/15.png');
	});
	app.get('/img/16.png', function (req, res) {
	  res.sendfile(__dirname + '/img/16.png');
	});
	app.get('/img/21.png', function (req, res) {
	  res.sendfile(__dirname + '/img/21.png');
	});
	app.get('/img/22.png', function (req, res) {
	  res.sendfile(__dirname + '/img/22.png');
	});
	app.get('/img/23.png', function (req, res) {
	  res.sendfile(__dirname + '/img/23.png');
	});
	app.get('/img/24.png', function (req, res) {
	  res.sendfile(__dirname + '/img/24.png');
	});
	app.get('/img/25.png', function (req, res) {
	  res.sendfile(__dirname + '/img/25.png');
	});
	app.get('/img/26.png', function (req, res) {
	  res.sendfile(__dirname + '/img/26.png');
	});
	
   var cases = [
     ['22','23','24','25','26','24','23','22'],
     ['21','21','21','21','21','21','21','21'],
     ['0','0','0','0','0','0','0','0'],
     ['0','0','0','0','0','0','0','0'],
     ['0','0','0','0','0','0','0','0'],
     ['0','0','0','0','0','0','0','0'],
     ['11','11','11','11','11','11','11','11'],
     ['12','13','14','15','16','14','13','12']
   ];
	var tourDesBlancs = true;
	
	var blanc = 0;
	var noir = 0;
	
	io.sockets.on('connection', function (socket) {
		
		socket.emit('getBoard', {'cases':cases, 'tourDesBlancs': tourDesBlancs, 'blancPris': blanc, 'noirPris': noir});
		socket.on('blancOk', function() {
			blanc = 1;
			io.sockets.emit('getBoard', {'cases':cases, 'tourDesBlancs': tourDesBlancs, 'blancPris': blanc, 'noirPris': noir});
		});
		socket.on('noirOk', function() {
			noir = 1;
			io.sockets.emit('getBoard', {'cases':cases, 'tourDesBlancs': tourDesBlancs, 'blancPris': blanc, 'noirPris': noir});
		});
		
		socket.on('sendDatas', function(data) {
			cases = (data.cases);
			tourDesBlancs = (data.tourDesBlancs);
			console.log("tourDesBlancs : " + tourDesBlancs);
			io.sockets.emit('updateClient', {'cases':cases, 'tourDesBlancs': tourDesBlancs});
			cases = JSON.parse(cases);
			tourDesBlancs = JSON.parse(tourDesBlancs);
		}); // End of socket.on('sendDatas', ....);
		
	}); // End of io.sockets.on('connection', ....);


function nouvellePartie() {
   var cases = [
     ['22','23','24','25','26','24','23','22'],
     ['21','21','21','21','21','21','21','21'],
     ['0','0','0','0','0','0','0','0'],
     ['0','0','0','0','0','0','0','0'],
     ['0','0','0','0','0','0','0','0'],
     ['0','0','0','0','0','0','0','0'],
     ['11','11','11','11','11','11','11','11'],
     ['12','13','14','15','16','14','13','12']
   ];
	var tourDesBlancs = true;
	
	var blanc = 0;
	var noir = 0;
}