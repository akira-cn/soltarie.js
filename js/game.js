(function(){

var soltarie = new Soltarie();

function drawStage(str){
	var data = JSON.parse(str);
	var collections = data[0],
		heap = data[1],
		groups = data[2],
		openedHeapCards = data[3],
		heapShows = soltarie.options.heapShows;

	PokerPlayer.drawCollections(collections);
	PokerPlayer.drawHeap(heap, openedHeapCards);

	for(var i = 0; i < groups.length; i++){
		PokerPlayer.drawGroup(i, groups[i]);
	}	
}

W("#txtLogger").on('change', function(){
	drawStage(g(this).value);
});

soltarie.on('newGame', function(){
	console.log('Start Game: ' + Soltarie.showCards(soltarie.cards));
	var str = soltarie.readState();
	drawStage(str);
	g("txtLogger").options.length = 0;
	g("txtLogger").options.add(new Option('New Game', str));
	g("txtLogger").value = str;
});

soltarie.on('solved', function(evt){
	console.log("solve path success!");
	console.log(soltarie.showGame());
	var str = soltarie.readState();
	drawStage(str);
	g("txtLogger").value = str;
});

soltarie.on('success', function(){
	console.log("win!");
	var str = soltarie.readState();
	drawStage(str);
	g("txtLogger").value = str;
});

soltarie.on('failed', function(){
	console.log("lose!");
	var str = soltarie.readState();
	drawStage(str);
	g("txtLogger").value = str;
});

soltarie.on('move', function(evt){
	if(evt.card != '>'){
		var step = Soltarie.cardStr(evt.card) + '->' + (evt.to >= 0 ? 'group ' + evt.to : 'collection');
		console.log(step);
		g("txtLogger").options.add(new Option(step, soltarie.readState()));
	}
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
	var data, heap, openedHeapCards, heapShows, pos;
	W("#btnViewHeap").on("click", function(){		
		if(!W("#btnSolve").attr("disabled")){
			W("#btnNewGame").attr("disabled", "disabled");
			W("#txtLogger").attr("disabled", "disabled");
			W("#btnSolve").attr("disabled", "disabled");
			W("#btnResolveHeap").attr("disabled", "");

			data = JSON.parse(g("txtLogger").value),
			heap = data[1],
			openedHeapCards = data[3],
			heapShows = soltarie.options.heapShows;
			heap.unshift(null);
		}

		pos = heap.indexOf(openedHeapCards[openedHeapCards.length - 1]);
		if(pos == -1) pos = 0;
		openedHeapCards = heap.slice(pos, pos + heapShows + 1);

		if(pos >= heap.length - 1){
			openedHeapCards = [null];
		}
		console.log([pos, openedHeapCards])
		//console.log([pos, heap.slice(pos, pos+heapShows)]);
		PokerPlayer.drawHeap(heap, openedHeapCards);
	});

	W("#btnResolveHeap").on("click", function(){
		W("#btnNewGame").attr("disabled", "");
		W("#btnSolve").attr("disabled", "");
		W("#txtLogger").attr("disabled", "");
		W(this).attr("disabled", "disabled");
		PokerPlayer.drawHeap(heap, openedHeapCards);
	});
})();

window.$soltarie = soltarie;
})();