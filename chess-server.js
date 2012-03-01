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
app.get('/css/master.css', function (req, res) {
  res.sendfile(__dirname + '/css/master.css');
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
		socket.set('couleur', '', function() {  });
		socket.on('set nickname', function (name) {
			socket.set('nickname', name, function () {  });
		});
		socket.on('message', function (msg) {
			socket.get('nickname', function (err, name) {
				io.sockets.emit('response',{from:name,data:msg});
			});
		});
		socket.emit('getBoard', {'cases':cases, 'tourDesBlancs': tourDesBlancs, 'blancPris': blanc, 'noirPris': noir});
		socket.on('blancOk', function() {
			blanc = 1;
			socket.get('nickname', function (err, name) {
				var nickname = name + ' (blanc)';
				socket.set('nickname', nickname, function () {  });
				socket.set('couleur', 'blanc', function() {  });
			});
			io.sockets.emit('getBoard', {'cases':cases, 'tourDesBlancs': tourDesBlancs, 'blancPris': blanc, 'noirPris': noir});
		});
		socket.on('noirOk', function() {
			noir = 1;
			socket.get('nickname', function (err, name) {
				var nickname = name + ' (noir)';
				socket.set('nickname', nickname, function () {  });
				socket.set('couleur', 'noir', function() {  });
			});
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
		
		socket.on('disconnect', function () {
			var couleur;
			socket.get('couleur', function(err, color) {
				couleur = color;
			});
			if(couleur == 'blanc' || couleur == 'noir') {
				io.sockets.emit('response',{from:'server',data:'Le joueur qui controlait les '+couleur+'s est parti'});
			}
			if (couleur=='blanc') {blanc = 0;}
			if (couleur=='noir') {noir = 0;}
			
			console.log("blanc : ");
			console.log(blanc);
			console.log("noir : ");
			console.log(noir);
			
		});
		
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