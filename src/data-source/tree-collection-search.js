/**
 Class created dynamically by dataSource.Collection.
 It is used to search and filter data in a tree collection.
 @namespace dataSource
 @class TreeCollectionSearch
 @augments Core
 */
ludo.dataSource.TreeCollectionSearch = new Class({
	Extends:ludo.dataSource.CollectionSearch,
	matchesFound : false,

	performSearch:function () {
		this.matchesFound = false;
		this.performSearchIn(this.getDataFromSource());
		if(!this.matchesFound){
			this.fireEvent('noMatches');
		}else{
			this.fireEvent('matches');
		}
	},

	performSearchIn:function (data) {
		for (var i = 0; i < data.length; i++) {
			if (this.isMatchingSearch(data[i])) {
				this.searchResult.push(data[i]);
				this.fireEvent('match', data[i]);
				this.matchesFound = true;
				if (data[i].children) {
					this.performSearchIn(data[i].children);
				}
			} else {
				this.fireEvent('mismatch', data[i]);
			}
		}
	}
});