(function(){

var canvas, context;

var pokerSize = 120;

if (window.Poker) {
	canvas = document.getElementsByTagName('canvas')[0];
	context = canvas.getContext('2d');
	
	/*drawCollections({hearts:0, diamonds:3, spades:2, clubs:12});

	drawHeap([0,1,2,3,4,5,6], 2, 3);

	for(var i = 0; i < 7; i++){
		drawGroup(i, 
					[{card:12, visible:false},
					 {card:11, visible:false},
					 {card:10, visible:false},
					 {card:9, visible:true},
					 {card:8, visible:true},
					 {card:7, visible:true},
					 {card:6, visible:true},
					 {card:5, visible:true},
					 {card:4, visible:true},
					 {card:3, visible:true},
					 {card:2, visible:true},
					 {card:1, visible:true},
					 {card:0, visible:true}
					]);
	}

	drawGroup(0, [{card:33, visible:true}]);*/
}else{
	document.body.innerHTML = 'This browser does not support canvas.';
}

function drawCard(x, y, i){
	var card = Soltarie.cardsMap[i];
	context.drawPokerCard(x, y, pokerSize, card.suit, card.point);
}

function drawCollections(collections){
	
	var pos = [collections.hearts, collections.diamonds, collections.spades, collections.clubs];

	for(var i = 0; i < pos.length; i++){
		var x =  900 - pokerSize * 0.75 * (i + 1);
		if(!pos[i]){
			context.drawEmptyCard(x, 10, pokerSize);
		}else{
			drawCard(x, 10, i * 13 + pos[i] - 1);
		}
	}
}

function drawHeap(heap, openedCards){

	var x = 40 + pokerSize * 0.75;
	
	context.clearRect(10, 10, pokerSize * 3, pokerSize);

	context.drawEmptyCard(10, 10, pokerSize);
	
	var cursor = heap.indexOf(openedCards[openedCards.length - 1]);
	for(var i = cursor + 1; i < heap.length; i++){		
		if((i - cursor) % 2){
			context.drawPokerBack(10  + i - cursor, 10, pokerSize);
		}
	}	

	for(var i = 1; i < openedCards.length; i++){
		drawCard(x + (i-1) * pokerSize * 0.3, 10, openedCards[i]);
	}
}

function drawGroup(group, cards){
	var x = 30 + 130 * (6 - group);
	var offset = 0;

	context.clearRect(x, 140, pokerSize * 0.75, 900);

	for(var i = 0; i < cards.length; i++){
		var c = cards[i];

		if(!c.visible){
			if(!(i % 2)){
				offset+=2;
			}
			context.drawPokerBack(x, 140 + offset, pokerSize); //, c.card;
			
		}else{
			if(i > 0)
				offset += 24;
			drawCard(x, 140 + offset, c.card);
		}
	}
}

var Player = {
	drawGroup : drawGroup,
	drawHeap : drawHeap,
	drawCollections : drawCollections
};

window.PokerPlayer = Player;
})();