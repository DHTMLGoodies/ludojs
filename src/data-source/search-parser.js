/**
 * Internal class used to parse search into a function
 * @namespace dataSource
 * @class SearchParser
 */
ludo.dataSource.SearchParser = new Class({

	searches:undefined,

	parsedSearch:{
		items:[]
	},
	branches:[],

	compiled:undefined,

	getSearchFn:function(searches){
		this.parse(searches);
		this.compiled = this.parsedSearch;
		this.compiled = this.compile(Object.clone(this.parsedSearch));
		return this.compiled;
	},

	clear:function(){
		this.parsedSearch = {
			items:[]
		};
		this.branches = [];
	},

	parse:function (searches) {
		this.clear();
		this.branches.push(this.parsedSearch);
		for (var i = 0; i < searches.length; i++) {
			if (this.isBranchStart(searches[i])) {
				var branch = {
					items:[]
				};
				this.appendToCurrentBranch(branch);
				this.branches.push(branch);
			}
			else if (this.isBranchEnd(searches[i])) {
				this.setOperatorIfEmpty();
				if (this.branches.length > 1)this.branches.pop();
			}
			else if (this.isOperator(searches[i])) {
				if (!this.hasOperator()) {
					this.setOperator(searches[i]);
				} else if (this.shouldCreateBranchOfPrevious(searches[i])) {
					this.createBranchOfPrevious();
					this.setOperator(searches[i]);
				} else if (this.shouldCreateNewBranch(searches[i])) {
					var newBranch = {
						operator:searches[i],
						items:[]
					};
					newBranch.items.push(this.branches[this.branches.length - 1].items.pop());
					this.appendToCurrentBranch(newBranch);
					this.branches.push(newBranch);
				}

			} else {
				this.appendToCurrentBranch(searches[i]);
			}
		}
		this.setOperatorIfEmpty();

	},

	compile:function(branch){
		var ib = this.getIndexOfInnerBranch(branch);
		var counter = 0;
		while(ib >=0 && counter < 100){
			branch.items[ib] = { fn : this.compile(branch.items[ib]) };
			counter++;
			ib = this.getIndexOfInnerBranch(branch);
		}

		if(branch.operator === '&'){
			return this.getAndFn(branch);
		}else{
			return this.getOrFn(branch);
		}
	},

	getAndFn:function(branch){
		var items = branch.items;
		return function(record){
			for(var i=0;i<items.length;i++){
				if (items[i].txt !== undefined) {
					if (record.searchIndex.indexOf(items[i].txt) === -1) {
						return false;
					}
				} else if (items[i].fn !== undefined) {
					if (!items[i].fn.call(this, record))return false;
				}
			}
			return true;
		}
	},

	getOrFn:function(branch){
		var items = branch.items;
		return function(record){
			for(var i=0;i<items.length;i++){
				if (items[i].txt !== undefined) {
					if (record.searchIndex.indexOf(items[i].txt) > -1) {
						return true;
					}
				} else if (items[i].fn !== undefined) {
					if (items[i].fn.call(this, record))return true;
				}
			}
			return false;
		}
	},

	getIndexOfInnerBranch:function(branch){
		for(var i=0;i<branch.items.length;i++){
			if(branch.items[i].operator !== undefined)return i;
		}
		return -1;
	},

	setOperatorIfEmpty:function () {
		var br = this.branches[this.branches.length - 1];
		br.operator = br.operator || '&';
	},

	isBranchStart:function (operator) {
		return operator === '(';
	},

	isBranchEnd:function (operator) {
		return operator === ')';
	},

	shouldCreateBranchOfPrevious:function (operator) {
		return operator === '|' && this.getCurrentOperator() === '&';
	},

	createBranchOfPrevious:function () {
		var br = this.branches[this.branches.length - 1];
		var newBranch = {
			operator:br.operator,
			items:br.items
		};
		br.operator = undefined;
		br.items = [newBranch];
	},

	shouldCreateNewBranch:function (operator) {
		return operator === '&' && this.isDifferentOperator(operator);
	},

	appendToCurrentBranch:function (search) {
		this.branches[this.branches.length - 1].items.push(search);
	},

	isOperator:function (token) {
		return token === '|' || token === '&';
	},

	hasOperator:function () {
		return this.branches[this.branches.length - 1].operator !== undefined;
	},

	isDifferentOperator:function (operator) {
		return operator !== this.getCurrentOperator();
	},

	getCurrentOperator:function () {
		return this.branches[this.branches.length - 1].operator;
	},

	setOperator:function (operator) {
		this.branches[this.branches.length - 1].operator = operator;
	},

	log:function (what) {
		if (typeof what == 'object')what = JSON.encode(what);
		console.log(what);
	}
});