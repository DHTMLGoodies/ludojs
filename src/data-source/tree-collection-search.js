/**
 Class created dynamically by dataSource.Collection.
 It is used to search and filter data in a tree collection.
 @namespace dataSource
 @class TreeCollectionSearch
 @extends Core
 */
ludo.dataSource.TreeCollectionSearch = new Class({
	Extends:ludo.dataSource.CollectionSearch,
	performSearch:function () {
		this.performSearchIn(this.getDataFromSource());
	},

	performSearchIn:function (data) {
		var matchesFound = false;
		for (var i = 0; i < data.length; i++) {
			if (this.isMatchingSearch(data[i])) {
				this.searchResult.push(data[i]);
				this.fireEvent('match', data[i]);
				if (data[i].children) {
					this.performSearchIn(data[i].children);
				}
			} else {
				this.fireEvent('mismatch', data[i]);
			}
		}
		return matchesFound;
	}
});