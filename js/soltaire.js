/**
 * 扑克：接龙游戏
 */
(function(){

var mix = ObjectH.mix;

//扑克牌表
var cardsMap = [
	{suit:'hearts', point:'a' , value:1},
	{suit:'hearts', point:'2' , value:2},
	{suit:'hearts', point:'3' , value:3},
	{suit:'hearts', point:'4' , value:4},
	{suit:'hearts', point:'5' , value:5},
	{suit:'hearts', point:'6' , value:6},
	{suit:'hearts', point:'7' , value:7},
	{suit:'hearts', point:'8' , value:8},
	{suit:'hearts', point:'9' , value:9},
	{suit:'hearts', point:'10', value:10},
	{suit:'hearts', point:'j' , value:11},
	{suit:'hearts', point:'q' , value:12},
	{suit:'hearts', point:'k' , value:13},

	{suit:'diamonds', point:'a' , value:1},
	{suit:'diamonds', point:'2' , value:2},
	{suit:'diamonds', point:'3' , value:3},
	{suit:'diamonds', point:'4' , value:4},
	{suit:'diamonds', point:'5' , value:5},
	{suit:'diamonds', point:'6' , value:6},
	{suit:'diamonds', point:'7' , value:7},
	{suit:'diamonds', point:'8' , value:8},
	{suit:'diamonds', point:'9' , value:9},
	{suit:'diamonds', point:'10', value:10},
	{suit:'diamonds', point:'j' , value:11},
	{suit:'diamonds', point:'q' , value:12},
	{suit:'diamonds', point:'k' , value:13},

	{suit:'spades', point:'a' , value:1},
	{suit:'spades', point:'2' , value:2},
	{suit:'spades', point:'3' , value:3},
	{suit:'spades', point:'4' , value:4},
	{suit:'spades', point:'5' , value:5},
	{suit:'spades', point:'6' , value:6},
	{suit:'spades', point:'7' , value:7},
	{suit:'spades', point:'8' , value:8},
	{suit:'spades', point:'9' , value:9},
	{suit:'spades', point:'10', value:10},
	{suit:'spades', point:'j' , value:11},
	{suit:'spades', point:'q' , value:12},
	{suit:'spades', point:'k' , value:13},

	{suit:'clubs', point:'a' , value:1},
	{suit:'clubs', point:'2' , value:2},
	{suit:'clubs', point:'3' , value:3},
	{suit:'clubs', point:'4' , value:4},
	{suit:'clubs', point:'5' , value:5},
	{suit:'clubs', point:'6' , value:6},
	{suit:'clubs', point:'7' , value:7},
	{suit:'clubs', point:'8' , value:8},
	{suit:'clubs', point:'9' , value:9},
	{suit:'clubs', point:'10', value:10},
	{suit:'clubs', point:'j' , value:11},
	{suit:'clubs', point:'q' , value:12},
	{suit:'clubs', point:'k' , value:13},
];

//游戏管理对象
function Soltarie(options){
	
	options = options || {};
	
	this.options = ObjectH.mix(
		options, {
			heapShows : 3 	//每次翻3张牌
		}
	);

	CustEvent.createEvents(this);
}

/**
 * 一些通用的方法
 */
mix(Soltarie, {
	/**
	 * 卡片的字符串表示，便于调试和Log
	 */
	cardStr : function(card){
		card = cardsMap[card];
		var str = '';
		switch(card.suit){
			case 'hearts' :
				str += '♥';
				break;
			case 'diamonds':
				str += '♦';
				break;
			case 'spades':
				str += '♠';
				break;
			case 'clubs':
				str += '♣';
		}
		str += card.point.toUpperCase();
		return str;
	},
	/**
	 * 得到卡片的花色
	 */
	cardSuit : function(card){
		card = cardsMap[card];
		return card.suit;
	},
	/**
	 * 得到卡片的值
	 */
	cardValue : function(card){
		card = cardsMap[card];
		return card.value;
	},
	/**
	 * 得到卡片的颜色
	 */
	cardColor : function(card){
		card = cardsMap[card];
		return (card.suit == "spades" || card.suit == "clubs")?"black":"red";
	},
	/**
	 * 根据当前卡片得到相同颜色的另一张卡片
	 */
	getTwinCard : function(card){
		if(card < 13) return card + 13;
		if(card >= 13 && card < 26) return card - 13;
		if(card >= 26 && card < 39) return card + 13;
		if(card >= 39) return card - 13;
	},
	/**
	 * 根据当前卡片得到不同颜色的另外两张卡片
	 * 如果当前卡片为空，得到4张K
	 */
	getOppCards : function(card){
		if(card < 26){	
			card += 26;
		}
		else{
			card -= 26;
		}
		return [card, Soltarie.getTwinCard(card)];
	},
	/**
	 * 根据接龙规则得到可以接龙于当前卡片的卡片
	 */
	getChildCards : function(card){
		var value;
		if(!card){
			//四张 K
			return [12, 25, 38, 51]; 
		}
		else if((value = Soltarie.cardValue(card)) > 1){
			return Soltarie.getOppCards(card - 1);
		}
		return [];
	},
	/**
	 * 得到两张卡片中间的距离
	 * 如果卡片不可以被接龙，返回null 
	 */
	cardDistance : function(src, des){
		if(!des){
			return 14 - Soltarie.cardValue(src);
		}
		
		var dis = Soltarie.cardValue(des) - Soltarie.cardValue(src);

		if(dis <= 0 || !((dis % 2) ^ (Soltarie.cardColor(src) == Soltarie.cardColor(des)))){
			return null;
		}else{
			return dis;
		}
	},
	/**
	 * 判断两张卡片是否可以被接龙（符合接龙规则）
	 */
	canJoinCard : function(src, des){
		return Soltarie.cardDistance(src, des) == 1;
	},
	/**
	 * 随机洗牌算法 (STL标准版)
	 */
	cardRandomSort : function(){
		var cards = [];
		for (var i = 0; i < cardsMap.length; i++){
			cards[i] = i;
		}
		for (var i = 1; i < cards.length; i++){
			var r = Math.floor((i+1) * Math.random());
			var tmp = cards[r];
			cards[r] = cards[i];
			cards[i] = tmp;
		}

		return cards;					
	},
	showCards : function(cards){
		var ret = [];
		for(var i = 0; i < cards.length; i++){
			ret.push(Soltarie.cardStr(cards[i]));
		}
		return ret.toString();
	}
});

/**
 * 通用的与牌局相关的函数
 */
mix(Soltarie.prototype, {
	/**
	 * 初始化函数
	 */
	init : function(cards){
		
		if(!cards){
			cards = Soltarie.cardRandomSort();
		}

		this.cards = cards;

		this.heap = [];	//牌堆
		this.groups = [[],[],[],[],[],[],[]];	//牌组
		this.heapCursor = -1; //牌堆的指针
		this.collections = {
			'hearts' : 0,
			'diamonds' : 0,
			'spades' : 0,
			'clubs' : 0
		};	//整理区

		//发牌
		var k = 0;
		//先发牌组
		for (var i = 0; i < this.groups.length; i++){
			for(j = 0; j <= i; j++){
				this.groups[i].push({card:this.cards[k++], visible:(j==i)});
			}
		}

		this.groups.reverse();	//把牌多的存在后面
		this.heap = this.cards.slice(k);
		this.saveStack = [];
		
		this.fire("newGame");
	},
	/**
	 * 保存当前牌局状态
	 */
	save : function(name){
		this.saveStack.push(JSON.stringify([this.collections, this.heap, this.groups, this.heapCursor, name]));
	},
	/**
	 * 恢复当前牌局状态到某个save
	 */
	restore : function(name){
		var data = JSON.parse(this.saveStack.pop());
		this.collections = data[0];
		this.heap = data[1];
		this.groups = data[2];
		this.heapCursor = data[3];
		if(name != null && data[4] != name){
			this.restore(name);
		}
	},
	/**
	 * 不恢复，但是把之前的save抛弃掉
	 */
	dropRestore : function(){
		this.saveStack.pop();
	}
});

/**
 * 与牌相关的函数
 */
mix(Soltarie.prototype, {
	//为牌寻找可以移动的目标
	//返回 0-6 组牌区
	//返回 -1 整理
	//返回 null 无法移动
	findTarget : function(card){
		//如果比整理区最小牌大2以内，优先移动到整理区
		if(this.isSaveToCollection(card))
			return -1;

		//否则考虑接龙
		for(var i = 0; i < this.groups.length; i++){
			if(Soltarie.canJoinCard(card, this.getLastCardInGroup(i)))
				return i;
		}

		//否则考虑进整理区
		if(this.canMoveToCollection(card))
			return -1;

		return null;
	},
	/**
	 * 查找指定的牌，返回被查找牌所在的位置
	 */
	findCard : function(card){
		var r = {
			card: card,
			group: -1,
			heap: this.heap.indexOf(card),
			collection: false,
			visible: false
		};

		//在牌堆中
		if(r.heap >= 0){
			r.visible = this.isHeapVisible(r.heap);	//判断当前堆是否可以操作（可见）	
			return r;
		}
		
		//看看是不是在整理区内
		var _c = cardsMap[card];
		var collection = this.collections[_c.suit];
		if(collection >= _c.value){
			r.collection = true;
			r.visible = (collection == _c.value);
			return r;
		}

		//在组牌中查找
		for(var i = 0; i < this.groups.length; i++){
			var group = this.groups[i];
			for(var j = 0; j < group.length; j++){
				var p = group[j];
				if(p.card == card){
					r.visible = p.visible;
					r.group = i;
					return r;
				}
			}
		}
	}	
});

/**
 * 和整理区有关的函数
 */
mix(Soltarie.prototype, {
	isSaveToCollection : function(card){
		card = cardsMap[card];
		var min = 0;
		for(var i in this.collections){
			min = Math.max(this.collections[i], min);
		}
		var collection = this.collections[card.suit];
		return card.value == collection + 1 && card.value <= min + 2;
	},
	addToCollection : function(card){
		card = cardsMap[card];
		var collection = this.collections[card.suit];
		if(card.value == collection + 1){
			this.collections[card.suit] = card.value;
			return true;
		} 
		return false;
	},
	//将牌从整理区移除并返回当前牌
	removeFromCollection : function(card){
		var _card = cardsMap[card];
		var collection = this.collections[_card.suit];
		if(_card.value == collection){
			this.collections[_card.suit]--;
			return card;
		} 
		return null;
	},
	//可以移动到整理区
	canMoveToCollection : function(card){
		card = cardsMap[card];
		var collection = this.collections[card.suit];
		return card.value == collection + 1;
	},
	//移动指定牌到整理区
	moveToCollection : function(card){
		var res = this.findCard(card);

		if(res.group >= 0){
			//如果在组牌中
			if(this.getLastCardInGroup(res.group) == card){
				//如果是组牌的最后一张牌
				if(this.canMoveToCollection(card)){
					this.removeCardsFromGroup(res.group, card);
					this.updateVisibility(res.group);
					this.addToCollection(card)
					return true;
				}
			}
		}
		else if(res.heap >= 0 && res.visible){
			//如果在牌堆中
			if(this.canMoveToCollection(card)){
				this.removeFromHeap(card);
				this.addToCollection(card)
				return true;
			}
		}
		return false;
	}
});

/**
 * 和牌堆有关的函数
 */
mix(Soltarie.prototype, {

	removeFromHeap : function(card){
		res = this.findCard(card);
		if(res.heap >= 0){
			this.heap.splice(res.heap, 1);
			this.heapCursor = res.heap - 1;
			return card;
		}
		return null;
	},

	isHeapVisible : function(i){
		var cursor = this.heapCursor;
		var c = i + 1;
		return c == this.heap.length || 			//最后一张牌
				!(c % this.options.heapShows) || 			//如果是3张牌，第2、5。。。以及最后一张
				(i >= cursor && !((i - cursor) % this.options.heapShows));	//或者当前的位置往后的倍数	
	},

	visibleCardsInHeap : function(cursor){
		var ret = [];
		if(cursor == null) cursor = this.heap.length;
		if(cursor === true) cursor = this.heapCursor;	//取到当前位置为止

		for(var i = 0; i < cursor && i < this.heap.length; i++){
			if(this.isHeapVisible(i)){
				ret.push(this.heap[i]);
			}
		}
		return ret;
	},

	//从pos位置得到下一张可见牌
	nextVisibleCardPosFromHeap : function(pos){
		if(this.heapCursor >= 0 && pos > this.heapCursor){	//如果比当前cusor来得大
			var dis = pos - this.heapCursor; 	//看看差几个位置
			var size = this.options.heapShows;

			var p = pos + (size - (dis % size)) % size;
			return p < this.heap.length ? p : -1;
		}
		//否则返回离pos最近的一个可见牌就行了
		for(var i = pos; i < this.heap.length; i++){
			if(this.isHeapVisible(i)){
				return i;
			}
		}
		return -1;
	}
});

/**
 * 与牌组有关的函数
 */
mix(Soltarie.prototype, {

	//将当前牌移动到指定组牌
	moveToGroup : function(group, card){
		if(!Soltarie.canJoinCard(card, this.getLastCardInGroup(group)))
			return false;

		var res = this.findCard(card);

		if(res.group >= 0 && res.group != group && res.visible){	//如果在组牌中
			var cards = this.removeCardsFromGroup(res.group, card);
			this.addCardsToGroup(group, cards);
			this.updateVisibility(res.group);
			return true;
		}
		else if(res.heap >= 0 && res.visible){	//如果在堆中并且当前可见
			this.removeFromHeap(card);
			this.addCardToGroup(group, card);
			return true;
		}
		else if(res.collection && res.visible){	//如果在整理区并且当前可见
			this.removeFromCollection(card);
			this.addCardToGroup(group, card);
			return true;
		}

		return false;
	},

	addCardToGroup : function(group, card){
		return this.addCardsToGroup(group, [{card:card, visible:true}]);
	},

	addCardsToGroup : function(group, cards){
		var _cards = this.groups[group];
		_cards.push.apply(_cards, cards);
	},

	isEmptyGroup : function(group){
		return this.groups[group].length == 0;
	},

	//获得一组牌的所有可见牌
	getVisibleCardsInGroup : function(group){
		cards = this.groups[group];
		var ret = [];

		for(var i = cards.length - 1; i >= 0; i--){
			var p = cards[i];
			if(p.visible){
				ret.push(p.card);
			}
		}
		return ret.reverse();
	},
	
	//得到第一张暗牌
	getLastDarkCardInGroup : function(group){
		cards = this.groups[group];
		if(cards == null) return null;
		
		var ret = null;
		for(var i = 0; i < cards.length; i++){
			p = cards[i];
			if(p.visible){
				break;
			}
			ret = p.card;
		}
		return ret;
	},

	//获得一组牌的最后一张可见牌
	getLastCardInGroup : function(group){
		var cards = this.getVisibleCardsInGroup(group);
		return cards[cards.length - 1];
	},

	//获得一组牌的可见牌的第一张
	getFirstCardInGroup : function(group){
		var cards = this.getVisibleCardsInGroup(group);
		return cards[0];
	},

	//将当前这张牌和这张牌之后的所有牌从组牌区移除
	removeCardsFromGroup : function(group, card){
		cards = this.groups[group];
		for(var i = 0; i < cards.length; i++){
			var _c = cards[i];
			if(_c.card == card){
				return cards.splice(i);
			}
		}
		return [];
	},

	//将最后一张牌设为可见牌
	updateVisibility : function(group){
		var cards = this.groups[group];
		if(cards.length){
			cards[cards.length - 1].visible = true;
		}
	},

	//判断是否所有的牌都可见
	allVisibleInGroup : function(group){
		var cards = this.groups[group];
		return cards.length == this.getVisibleCardsInGroup(group).length;
	},
	//将可以移动到整理区的牌自动移动到整理区
	cardsAutoCollect : function(isFireEvent){
		for(var i = 0; i < this.groups.length; i++){
			var card = this.getLastCardInGroup(i);
			if(card != null && this.isSaveToCollection(card)){
				this.moveTo(card);
				this.updateVisibility(i);
				if(isFireEvent){
					this.fire('move', {card:card, to:-1});
				}
			}
		}
	},
	//卡片移动到某个组的路径
	pathMoveToGroup : function(group, card){

		this.save();	//保存当前状态

		var self = this;
		var path = [];

		function moveCollectionCard(card){
			var res = self.findCard(card);
			if(res.collection){
				if(res.visible){
					self.moveTo(card, group);
					path.push([card, group]);	//当前路径
					return true;
				}
			}
			return false;
		}

		function moveVisibleHeapCard(card){
			var res = self.findCard(card);
			if(res.heap >= 0 && res.visible){
				//查找看看牌堆里有没有要的牌
				self.moveTo(card, group);
				path.push([card, group]);
				return true;
			}
		}

		function moveHeapCard(card){
			var res = self.findCard(card);
			if(res.heap >= 0 && !res.visible){
				//如果不可见，需要整理牌堆
				
				var tempPath = [];

				self.save();
				var cardsAfter = self.nextVisibleCardPosFromHeap(res.heap);
				for(var i = cardsAfter; i > res.heap; i--){
					var _card = self.heap[i];
					var target = self.findTarget(_card);

					if(target && target != group){ //target不能移动到当前group，否则会挡住
						tempPath.push([_card, target]);
						self.moveTo(_card, target);
					}else{
						tempPath.length = 0;
						break;
					}
				}
				
				if(tempPath.length > 0){
					self.dropRestore();	//成功了
					path.push.apply(path, tempPath);
					self.moveTo(card, group);
					path.push([card, group]);
					return true;
				}

				self.restore();
				return false;
			}
			return false;
		}

		//彻底整理牌堆，移动牌堆前面的可移动牌
		function resolveHeepCard(card){
			//得到当前卡牌前面的所有可见牌
			//这些牌将影响到卡牌是否可被访问
			var res = self.findCard(card);
			if(res.heap >= 0 && !res.visible){
				var tempPath = [];

				self.save();

				function _f(res){
					if(res.visible){
						//成功
						return true;
					}
					var cardsBefore = self.visibleCardsInHeap(res.heap).reverse();	

					for(var i = 0; i < cardsBefore.length; i++){
						var _card =	cardsBefore[i];
						var target = self.findTarget(_card);

						if(target && target != group){ //target不能移动到当前group，否则会挡住
							self.moveTo(_card, target);
							tempPath.push([_card, target]);
							//console.log([tempPath, card, self.showHeap()]);
							return _f(self.findCard(card));
						}					
					}
					return false;
				}

				if(_f(res)){
					self.dropRestore();	//成功了
					path.push.apply(path, tempPath);
					self.moveTo(card, group);
					path.push([card, group]);
					//console.log(path);
					return true;
				}

				self.restore();
				return false;
			}
			return false;
		}

		function tryToBuildPath(cards, func){
			for(var i = 0; i < cards.length; i++){
				if(func(cards[i])){
					return true;
				}
			}
			return false;
		}

		var lastCard = this.getLastCardInGroup(group);
		var dis = Soltarie.cardDistance(card, lastCard);

		if(!dis){
			this.restore();
			return null;
		}

		while(dis-- > 1){

			var childCards = Soltarie.getChildCards(lastCard);

			if(lastCard == null){
				var tmp = [];
				for(var i = 0; i < childCards.length; i++){
					if(Soltarie.cardDistance(card, childCards[i])){
						//有可能为null是因为如果是空列，Soltarie.getChildCards(lastCard)返回4张K
						//其中只有两张K可以用
						tmp.push(childCards[i]);
					}
				}
				childCards = tmp;
			}

			lastCard = null;
			
			if(tryToBuildPath(childCards, moveVisibleHeapCard) 		//如果牌堆里面的牌可见，先移动可见牌
				|| tryToBuildPath(childCards, moveCollectionCard) 	//如果牌堆里面的牌不可见，看看整理区是否可以
				|| tryToBuildPath(childCards, moveHeapCard) 		//如果也不可以，那么只好整理牌堆
				|| tryToBuildPath(childCards, resolveHeepCard)) 	//如果也不可以，那么只好整理牌堆（方式2）
			{ 
				lastCard = this.getLastCardInGroup(group);
			}else{
				//失败了
				this.restore();
				return null;
			}
		}

		path.push([card, group]);
		this.restore();
		return path;
	}
});


/**
 * 和解牌有关的函数
 */
mix(Soltarie.prototype, {

	execPath : function(path, isFireEvent){
		//console.log(this.showGame());
		for(var i = 0; i < path.length; i++){
			var action = path[i];
			if(!this.moveTo(action[0], action[1])){
				throw new Error('path error (' + [action[0], action[1]] + '):' + JSON.stringify(path));
			}
			if(isFireEvent){
				this.fire('move', {card:action[0], to:action[1]});
			}
		}
		this.cardsAutoCollect(isFireEvent);
	},


	//移动指定牌到某个目标
	moveTo : function(card, target){
		if(target != null && target >= 0){
			return this.moveToGroup(target, card);
		}
		else{
			return this.moveToCollection(card);
		} 
	},

	//对当前group进行求解，目的是将当前group中的一张暗牌翻出
	solveGroup : function(group){
		if(this.allVisibleInGroup(group) && 
			this.getFirstCardInGroup(group) % 13 == 12){
			 	//如果没有暗牌并且已经出现K，那么不需要翻暗牌了
			 return null;
		}

		var cards = this.getVisibleCardsInGroup(group);
		
		var self = this;

		function solve(cards, group){
			var card = cards[0]; //先看第一张牌

			if(card == null){ //没了
				return null;
			}

			for(var i = 0; i < self.groups.length; i++){
				if(i == group) continue;//如果是当前组，跳过

				var path = self.pathMoveToGroup(i, card);
				if(path){
					return path;
				}
			}
			
			if(self.canMoveToCollection(card)){ //可以被移动到整理区
				var path = solve(cards.slice(1), group);
				if(path){
					path.push([card]);
					return path;
				}
			}
			
			var twinCard = Soltarie.getTwinCard(card);	//看一下另外一张同色牌的情况

			if(self.canMoveToCollection(twinCard)){	//如果这张同色牌能够移到整理区
				var res = self.findCard(twinCard);
				if(res.group >= 0 && res.visible
					&& self.getFirstCardInGroup(res.group) != twinCard){	
					//找到这张同色牌，发现这张同色牌在其他组，并且不是当前组的第一张牌
					var _cards = self.getVisibleCardsInGroup(res.group);

					var path = solve(_cards.slice(_cards.indexOf(twinCard) + 1), res.group);

					if(path){ //如果能够解决掉这张牌
						path.push([twinCard]);	//移到整理区
						path.push([card, res.group]);	//将牌移动到这里
						return path;
					}
				}
			}

			return null;
		}

		return solve(cards, group);
	},

	/**
	 * 自动解牌的回溯算法
	 * 因为游戏的目的是将所有的牌移动到整理区，因此：
	 * 进行深度搜索将组牌的暗牌翻出来，同时保证有更多的牌可以被翻
	 */				 
	solve : function(dept){ //dept 搜索深度
		
		dept = dept || 2;	//默认是3层

		var self = this;
		var maxChoice = 0;
		var bestPath = 0;	//最优路径
		
		this.cardsAutoCollect(true);

		function scorePath(path){	
			//计算一个路径的分数： 翻出越小的牌分数越高
			var act = path[path.length - 1];	//找到路径的最后一步，这一步所在的组是被solveGroup的组
			var score = 0;

			if(act){
				var res = self.findCard(act[0]);
				if(res.group){
					var c = self.getLastDarkCardInGroup(res.group);
					if(c != null){
						score += 14 - Soltarie.cardValue(c);
					} 
				}
			}
			return score;
		}
		
		function resolvePath(d){
			
			var _paths = getAllPaths();
			if(!d){
				return _paths.length * 20;
			}

			var max = 0;

			for(var i = 0; i < _paths.length; i++){
				var path = _paths[i];
				self.save();
				
				//console.log([i, _paths]);
				self.execPath(path);
				//console.log('done');
				//console.log([path, scorePath(path)]);

				/**
				 * 优先选择分支数多的，如果一样多的话，那么优先选择暗牌点数小的
				 */
				var m = resolvePath(d-1) + scorePath(path);	
				if(m > max){
					max = m;
				}
				self.restore();
			}

			return max;
		} 

		function getAllPaths(){
			var _paths = []; 
			//console.log(self.showGame());
			for(var i = 0; i < self.groups.length; i++){
				var path = self.solveGroup(i);
				if(path){
					//console.log(i);
					_paths.push(path);
				}
				//console.log([i,self.showGame()]);
			}
			//console.log(_paths);
			//console.log(self.showGame());
			return _paths;	//反过来先从牌多的列开始
		}

		var paths = getAllPaths();

		for(var i = 0; i < paths.length; i++){
			var path = paths[i];
			this.save();
			//console.log(i);
			this.execPath(path);

			var m = resolvePath(dept) + scorePath(path);
			//console.log(m);
			if(maxChoice < m){
				maxChoice = m;
				bestPath = i;
			}
			this.restore();
		}

		if(bestPath != null){
			if(paths && paths[bestPath]){
				this.fire('befordSolve', {path:paths[bestPath]});
				this.execPath(paths[bestPath], true);
				this.fire('solved');
			}else{
				if(this.parseResult()){
					//console.log("win");
					this.fire('success');
				}else{
					//console.log("lose");
					//this.fire('failed');
					this.fire('solved');
				}
			}
		}
	},

	parseResult : function(){
		var end = true;
		do{
			end = true;
			for(var i = 0; i < this.groups.length; i++){
				var card = this.getLastCardInGroup(i);
				if(card && this.canMoveToCollection(card)){
					this.moveTo(card);	//将卡片移动到整理区
					this.fire('move', {card:card, to:-1});
					end = false;
				}
			}
			var cards = this.visibleCardsInHeap();
			for(var i = 0; i < cards.length; i++){
				var card = cards[i];
				if(this.canMoveToCollection(card)){
					this.moveTo(card);	//将卡片移动到整理区
					this.fire('move', {card:card, to:-1});
					end = false;
				}else{
					for(var j = 0; j < this.groups.length; j++){
						if(Soltarie.canJoinCard(card, this.getLastCardInGroup(j))){
							this.moveTo(card, j);
							this.fire('move', {card:card, to:j});
							end = false;							
						}
					}
				}
			} 
		}while(!end);
		return this.cardAllCollected();
	},

	cardAllCollected : function(){
		return this.collections.hearts == 13 && this.collections.diamonds == 13 
			&& this.collections.spades == 13 && this.collections.clubs == 13;
	}
});

/**
 * 用来调试输出的函数
 */
mix(Soltarie.prototype, {
	/**
	 * 显示当前某组牌
	 */
	showGroup : function(group){
		var cards = this.groups[group];
		var ret = [];

		for(var i = 0; i < cards.length; i++){
			var _c = cards[i];
			var str = '';
			str = Soltarie.cardStr(_c.card);
			if(!_c.visible) str = '[' + str + ']';
			ret.push(str);
		}
		return ret.toString();
	},
	showGroups : function(){
		var ret = [];
		for(var i = 0; i < this.groups.length; i++){
			ret.push(this.showGroup(i));
		}
		return ret.join('\n');
	},
	showGame : function(){
		var ret = [this.showHeap(), this.showGroups(), JSON.stringify(this.collections)];
		return ret.join('\n');
	},
	showHeap : function(){
		var cards = this.heap;
		var ret = [];

		for(var i = 0; i < cards.length; i++){
			var card = cards[i];
			var str = '';
			str = Soltarie.cardStr(card);
			if(this.heapCursor == i) str = '<' + str + '>';
			if(!this.isHeapVisible(i)) str = '[' + str + ']';
			ret.push(str);
		}
		return ret.toString();					
	}
});

mix(Soltarie, {
	cardsMap : cardsMap
});

window.Soltarie = Soltarie;
})();