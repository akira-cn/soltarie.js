(function(){

var soltarie = new Soltarie();

function getGameStr(){
	return JSON.stringify([soltarie.groups, soltarie.collections, soltarie.heap, soltarie.heapCursor]);
}

function drawStage(gameStr){
	var data = JSON.parse(gameStr);
	var groups = data[0],
		collections = data[1],
		heap = data[2],
		heapCursor = data[3],
		heapShows = soltarie.options.heapShows;

	PokerPlayer.drawCollections(collections);
	PokerPlayer.drawHeap(heap, heapCursor, heapShows);

	for(var i = 0; i < groups.length; i++){
		PokerPlayer.drawGroup(i, groups[i]);
	}	
}

W("#txtLogger").on('change', function(){
	drawStage(g(this).value);
});

soltarie.on('newGame', function(){
	console.log('Start Game: ' + Soltarie.showCards(soltarie.cards));
	var str = getGameStr();
	drawStage(str);
	g("txtLogger").options.length = 0;
	g("txtLogger").options.add(new Option('New Game', str));
	g("txtLogger").value = str;
});

soltarie.on('solved', function(evt){
	console.log("solve path success!");
	console.log(soltarie.showGame());
	var str = getGameStr();
	drawStage(str);
	//console.log(str);
	g("txtLogger").value = str;
});

soltarie.on('success', function(){
	console.log("win!");
	var str = getGameStr();
	drawStage(str);
	g("txtLogger").value = str;
});

soltarie.on('failed', function(){
	console.log("lose!");
	var str = getGameStr();
	drawStage(str);
	g("txtLogger").value = str;
});

soltarie.on('move', function(evt){
	var step = Soltarie.cardStr(evt.card) + '->' + (evt.to >= 0 ? 'group ' + evt.to : 'collection');
	console.log(step);
	var str = getGameStr();
	g("txtLogger").options.add(new Option(step, str));
});

W("#btnRandomGame").on("click", function(){
	var cards = Soltarie.cardRandomSort();
	W("#txtCards").val(JSON.stringify(cards));
	console.log('Create Random Game: ' + Soltarie.showCards(cards));
});

W("#selHeapShows").on("change", function(){
	var heapShows = g(this).value;
	soltarie.options.heapShows = heapShows - 0;
});

W("#btnNewGame").on("click", function(){
	var cards = W("#txtCards").val();
	if(!cards){
		alert("请先输入一个牌局");
		W("#btnSolve").attr("disabled", "disabled");
		W("#btnViewHeap").attr("disabled", "disabled");
	}
	else{
		cards = JSON.parse(cards);
		soltarie.init(cards);
		W("#btnSolve").attr("disabled", "");
		W("#btnViewHeap").attr("disabled", "");
	}
});

W("#btnSolve").on("click", function(){
	soltarie.solve();
});

(function(){
	var data, heap, startCursor, cursor, heapShows;
	W("#btnViewHeap").on("click", function(){		
		if(!W("#btnSolve").attr("disabled")){
			W("#btnNewGame").attr("disabled", "disabled");
			W("#txtLogger").attr("disabled", "disabled");
			W("#btnSolve").attr("disabled", "disabled");
			W("#btnResolveHeap").attr("disabled", "");

			data = JSON.parse(g("txtLogger").value),
			heap = data[2],
			startCursor = cursor = data[3],
			heapShows = soltarie.options.heapShows
		}
		cursor += heapShows;
		if(cursor - heapShows >= heap.length){
			cursor = -1;
		}
		PokerPlayer.drawMovingHeap(heap, cursor, heapShows);
	});

	W("#btnResolveHeap").on("click", function(){
		W("#btnNewGame").attr("disabled", "");
		W("#btnSolve").attr("disabled", "");
		W("#txtLogger").attr("disabled", "");
		W(this).attr("disabled", "disabled");
		PokerPlayer.drawHeap(heap, startCursor, heapShows);
	});
})();


})();