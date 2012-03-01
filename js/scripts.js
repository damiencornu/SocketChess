// Déclaration des variables globales
var canvas;
var cases = [];
var caseActive = [];
var posAutorisee = [];
var tourDesBlancs = true; // Les blancs commencent
var images = [];
var socket = io.connect(document.location);
var joueur = null;

var img11 = new Image();
img11.src = "/img/11.png";
images[11] = img11;
var img12 = new Image();
img12.src = "/img/12.png";
images[12] = img12;
var img13 = new Image();
img13.src = "/img/13.png";
images[13] = img13;
var img14 = new Image();
img14.src = "/img/14.png";
images[14] = img14;
var img15 = new Image();
img15.src = "/img/15.png";
images[15] = img15;
var img16 = new Image();
img16.src = "/img/16.png";
images[16] = img16;
var img21 = new Image();
img21.src = "/img/21.png";
images[21] = img21;
var img22 = new Image();
img22.src = "/img/22.png";
images[22] = img22;
var img23 = new Image();
img23.src = "/img/23.png";
images[23] = img23;
var img24 = new Image();
img24.src = "/img/24.png";
images[24] = img24;
var img25 = new Image();
img25.src = "/img/25.png";
images[25] = img25;
var img26 = new Image();
img26.src = "/img/26.png";
images[26] = img26;


function init() {

	
	$('#chat form').submit(function(event){
		if($('#chat').hasClass('pseudo')){
				socket.emit('set nickname', $('#pseudo').val());
				$('#pseudo').val('');
				$('#pseudo').attr({
					'id' : 'message',
					'name' : 'message',
					'placeholder' : 'Votre message'
				});
				$(this).find('input[type=submit]').val('Envoyer');
				$('#chat').removeClass('pseudo');
		} else {
			socket.emit('message', $('#message').val());
			$('#message').val('');
		}
		event.preventDefault();
	});
	
	canvas = document.getElementById('chess');
	context = canvas.getContext('2d');

	canvas.onmousedown = function(event){
		var x = parseInt((event.clientX - document.getElementById('chess').offsetLeft)/50);
		var y = parseInt((event.clientY - document.getElementById('chess').offsetTop)/50);

		var deplacement = false;

		// Etape 0 : déterminer si case cliquee est une position autorisée et déplacer du coup
		for (var i=0 ; i < posAutorisee.length ; i++) {
			if(x == posAutorisee[i][0] && y == posAutorisee[i][1]) {
				var pion = cases[caseActive[1]][caseActive[0]];
				cases[y][x] = pion;
				var img = new Image();
				img.src = '/img/'+pion+'.png';
				context.drawImage(img, x*50, y*50, 50,50);
				cases[caseActive[1]][caseActive[0]] = "0";

				caseActive = [];
				posAutorisee = [];
				deplacement = true;

				tourDesBlancs = !tourDesBlancs;

				//Envois des données à socket.io
				sendDatas();

			}
		} // End of for() : est ce une position autorisée ?


		if(!deplacement) {
			// Etape 1 : effacer le carré et redessiner la case
			drawBoard();
			drawPions();
			
			// Ne sélectionner que les cases de sa couleur et quand c'est son tour
			if((tourDesBlancs == true && joueur == "blanc") || (tourDesBlancs == false && joueur == "noir")) {
				
				// Etape 2 : Dessiner la case cliquée en rose
				if(cases[y][x] != '0') {
					if((tourDesBlancs == true && getCouleur(cases[y][x]) == 1) || (tourDesBlancs == false && getCouleur(cases[y][x]) == 2)) {
						caseActive = [x,y];
						context.fillStyle = "rgba(255,0,0,0.3)";
						context.fillRect(caseActive[0]*50,caseActive[1]*50,50,50);
						getAllowMoves(caseActive[0],caseActive[1]);
					}
				}
				
				
			}
		} // End of if() : pas de déplacement

	} // fin des actions au clic

} //init()

function drawBoard() {
	for(var i=0; i<64; i++) {
		if( (parseInt(i/8)+i%8) % 2 == 1) {
			context.fillStyle = "rgb(140,100,40)";
		} else {
			context.fillStyle = "rgb(210,160,70)";
		}
		context.fillRect((i%8)*50,parseInt(i/8)*50, 50, 50);
	}
}

function drawPions() {
	for(var i=0; i<64; i++) {
		if(cases[parseInt(i/8)][i%8] != '0') {
			context.drawImage(images[cases[parseInt(i/8)][i%8]], (i%8)*50, parseInt(i/8)*50, 50,50);
		}
	}
} //drawPions
   

function getAllowMoves(x,y) {
	var piece = cases[y][x];
	var type, couleur;
		type = piece % 10;
		couleur = getCouleur(piece);
		posAutorisee = [];
 
	if(type == 1) { // Pion
		if(couleur == 1) {
			if(cases[y-1][x] == "0") {
				posAutorisee.push([x,y-1]);
			}
			if(y==6 && cases[y-2][x] == "0" && cases[y-1][x] == "0") {
				posAutorisee.push([x,y-2]);
			}
			if(getCouleur(cases[y-1][x-1]) == 2) {
				posAutorisee.push([x-1,y-1]);
			}
			if(getCouleur(cases[y-1][x+1]) == 2) {
				posAutorisee.push([x+1,y-1]);
			}
		} // fin de pion blanc
		else {
			if(cases[y+1][x] == "0") {
				posAutorisee.push([x,y+1]);
			}
			if(y==1 && cases[y+2][x] == "0" && cases[y+1][x] == "0") {
				posAutorisee.push([x,y+2]);
			}
			if(getCouleur(cases[y+1][x-1]) == 1) {
				posAutorisee.push([x-1,y+1]);
			}
			if(getCouleur(cases[y+1][x+1]) == 1) {
				posAutorisee.push([x+1,y+1]);
			}
		}
	} // fin des pions
 
 if (type == 2 || type == 5 || type == 6) { // Tour (+une partie des dames +une partie des rois)
   var i = 1;
   var stop = false;
   while(stop == false) {
     if((x-i) < 0) {
       stop = true;
     }
     if( stop == false && cases[y][x-i] == 0 ) {
       posAutorisee.push([x-i,y]);
     }
     if( stop == false && cases[y][x-i] && cases[y][x-i] != 0 ) {
       stop = true;
       if (getCouleur(cases[y][x-i]) != couleur) {
         posAutorisee.push([x-i,y]);
       }
     }
     if(type == 6) {
       stop = true;
     }
     i++;
   }
   
   i = 1;
   stop = false;
   while(stop == false) {
     if((x+i) > 7) {
       stop = true;
     }
     if( stop == false && cases[y][x+i] == 0 ) {
       posAutorisee.push([x+i,y]);
     }
     if( stop == false && cases[y][x+i] && cases[y][x+i] != 0 ) {
       stop = true;
       if (getCouleur(cases[y][x+i]) != couleur) {
         posAutorisee.push([x+i,y]);
       }
     }
     if(type == 6) {
       stop = true;
     }
     i++;
   }
   
   
   i = 1;
   stop = false;
   while(stop == false) {
     if((y-i) < 0) {
       stop = true;
     }
     if( stop == false && cases[y-i][x] == 0 ) {
       posAutorisee.push([x,y-i]);
     }
     if( stop == false && cases[y-i][x] && cases[y-i][x] != 0 ) {
       stop = true;
       if (getCouleur(cases[y-i][x]) != couleur) {
         posAutorisee.push([x,y-i]);
       }
     }
     if(type == 6) {
       stop = true;
     }
     i++;
   }
   
   i = 1;
   stop = false;
   while(stop == false) {
     if((y+i) > 7) {
       stop = true;
     }
     if( stop == false && cases[y+i][x] == 0 ) {
       posAutorisee.push([x,y+i]);
     }
     if( stop == false && cases[y+i][x] && cases[y+i][x] != 0 ) {
       stop = true;
       if (getCouleur(cases[y+i][x]) != couleur) {
         posAutorisee.push([x,y+i]);
       }
     }
     if(type == 6) {
       stop = true;
     }
     i++;
   }
 }
 // Fin des Tours
 
 
 if (type == 3) { // Cavaliers
   if((x-2) >= 0) {
     if((y-1) >= 0) {
       if( cases[y-1][x-2] && getCouleur(cases[y-1][x-2]) != couleur ) {
         posAutorisee.push([x-2,y-1]);
       }
     }
     if((y+1) <= 7) {
       if( cases[y+1][x-2] && getCouleur(cases[y+1][x-2]) != couleur ) {
         posAutorisee.push([x-2,y+1]);
       }
     }
   }
   if((x-1)>=0) {
     if((y-2) >= 0) {
       if( cases[y-2][x-1] && getCouleur(cases[y-2][x-1]) != couleur ) {
         posAutorisee.push([x-1,y-2]);
       }
     }
     if((y+2) <= 7) {
       if( cases[y+2][x-1] && getCouleur(cases[y+2][x-1]) != couleur ) {
         posAutorisee.push([x-1,y+2]);
       }
     }
   }
   if((x+1) <= 7) {
     if((y-2) >= 0) {
       if( cases[y-2][x+1] && getCouleur(cases[y-2][x+1]) != couleur ) {
         posAutorisee.push([x+1,y-2]);
       }
     }
     if((y+2) <= 7) {
       if( cases[y+2][x+1] && getCouleur(cases[y+2][x+1]) != couleur ) {
         posAutorisee.push([x+1,y+2]);
       }
     }
   }
   if((x+2) <= 7) {
     if((y-1) >= 0) {
       if( cases[y-1][x+2] && getCouleur(cases[y-1][x+2]) != couleur ) {
         posAutorisee.push([x+2,y-1]);
       }
     }
     if((y+1) <= 7) {
       if( cases[y+1][x+2] && getCouleur(cases[y+1][x+2]) != couleur ) {
         posAutorisee.push([x+2,y+1]);
       }
     }
   }

 }
 // Fin des cavaliers 
 
 
 
 if (type == 4 || type == 5 || type == 6) { // Fous (+une partie des dames +une partie des rois)
   var i = 1;
   var stop = false;
   while(stop == false) {
     if((x-i) < 0 || (y-i) < 0) {
       stop = true;
     }
     if( stop == false && cases[y-i][x-i] == 0 ) {
       posAutorisee.push([x-i,y-i]);
     }
     if( stop == false && cases[y-i][x-i] && cases[y-i][x-i] != 0 ) {
       stop = true;
       if (getCouleur(cases[y-i][x-i]) != couleur) {
         posAutorisee.push([x-i,y-i]);
       }
     }
     if(type == 6) {
       stop = true;
     }
     i++;
   }
   
   i = 1;
   stop = false;
   while(stop == false) {
     if((x+i) > 7 || (y-i) < 0) {
       stop = true;
     }
     if( stop == false && cases[y-i][x+i] == 0 ) {
       posAutorisee.push([x+i,y-i]);
     }
     if( stop == false && cases[y-i][x+i] && cases[y-i][x+i] != 0 ) {
       stop = true;
       if (getCouleur(cases[y-i][x+i]) != couleur) {
         posAutorisee.push([x+i,y-i]);
       }
     }
     if(type == 6) {
       stop = true;
     }
     i++;
   }
   
   i = 1;
   stop = false;
   while(stop == false) {
     if((x-i) < 0 || (y+i) > 7) {
       stop = true;
     }
     if( stop == false && cases[y+i][x-i] == 0 ) {
       posAutorisee.push([x-i,y+i]);
     }
     if( stop == false && cases[y+i][x-i] && cases[y+i][x-i] != 0 ) {
       stop = true;
       if (getCouleur(cases[y+i][x-i]) != couleur) {
         posAutorisee.push([x-i,y+i]);
       }
     }
     if(type == 6) {
       stop = true;
     }
     i++;
   }
   
   i = 1;
   stop = false;
   while(stop == false) {
     if((x+i) > 7 || (y+i) > 7) {
       stop = true;
     }
     if( stop == false && cases[y+i][x+i] == 0 ) {
       posAutorisee.push([x+i,y+i]);
     }
     if( stop == false && cases[y+i][x+i] && cases[y+i][x+i] != 0 ) {
       stop = true;
       if (getCouleur(cases[y+i][x+i]) != couleur) {
         posAutorisee.push([x+i,y+i]);
       }
     }
     if(type == 6) {
       stop = true;
     }
     i++;
   }
 }
 // Fin des fous
 
 for(var i=0; i<posAutorisee.length; i++) {
   context.fillStyle = "rgba(0,255,0,0.3)";
   context.fillRect(posAutorisee[i][0]*50,posAutorisee[i][1]*50,50,50);
 }
 
} // fin de getAllowMoves

function getCouleur(piece) {
 if(parseInt(piece) == "0") {
   return false;
 }
 else { return Math.floor(piece / 10); }
}

function getTour() {
	if(tourDesBlancs) {
     document.getElementById("tour").innerHTML = "Tour des <strong>blancs</strong>";
   } else {
     document.getElementById("tour").innerHTML = "Tour des <strong>noirs</strong>";
   }
}

function sendDatas() {
	socket.emit('sendDatas', {'cases' : JSON.stringify(cases), 'tourDesBlancs' : JSON.stringify(tourDesBlancs)});
}

socket.on('getBoard', function(data) {
	if (!joueur) {
		$('#select-team').html('Je veux être :&nbsp;');
		if (data.blancPris == 0 ) {
			$('#select-team').append('<a href="javascript://" id="takeBlanc" style="margin-right:5px">les pions blancs</a>');
		}
		if (data.noirPris == 0 ) {
			$('#select-team').append('<a href="javascript://" id="takeNoir" style="margin-right:5px">les pions noirs</a>');
		}
		if (data.noirPris == 0 || data.blancPris == 0) {
			$('#select-team').append('<a href="javascript://" id="takeSpectateur" style="margin-right:5px">Spectateur</a>')
		}
		else {
			joueur = "0";
			$('#select-team').html('Les deux couleurs sont prises, vous êtes spectateur');
		}
		$('#takeSpectateur').click(function() {
			joueur = "0";
			clearSelectTeam();
		});
		$('#takeBlanc').click(function() {
			joueur = "blanc";
			socket.emit('blancOk');
			clearSelectTeam();
		});
		$('#takeNoir').click(function() {
			joueur = "noir";
			socket.emit('noirOk');
			clearSelectTeam();
		});
	} else {
		clearSelectTeam();
	}

	var casesTemp = (data.cases);
	var tourDesBlancsTemp = (data.tourDesBlancs);
	cases = casesTemp;
	tourDesBlancs = tourDesBlancsTemp;
	window.setTimeout('render()', 80);
	getTour();
});

function render() {
	drawBoard();
	drawPions();
}
function clearSelectTeam() {
	if(joueur == 0) {
		$('#select-team').html('Vous êtes spectateur');
	} else {
		$('#select-team').html('Vous jouez les ' + joueur);
	}
}

socket.on('updateClient',function(data) {
	var casesTemp = JSON.parse(data.cases);
	var tourDesBlancsTemp = JSON.parse(data.tourDesBlancs);
	cases = casesTemp;
	tourDesBlancs = tourDesBlancsTemp;
	drawBoard();
	drawPions();
	getTour();
});

socket.on('response', function(data){
	$('#chatMessages').prepend('<p><strong>'+data.from+' :</strong> '+data.data);
})