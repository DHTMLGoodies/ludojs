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
        var s = new Date().getTime();
        this.performSearchIn(this.getDataFromSource());
        console.log('Time used: ' + (new Date().getTime() - s));
    },

    performSearchIn:function(data){
        var matchesFound = false;
        for (var i = 0; i < data.length; i++) {
            if (this.isMatchingSearch(data[i])) {
                this.searchResult.push(data[i]);
                this.fireEvent('match', data[i]);
                matchesFound = true;
            }else{
                if(data[i].children){
                    matchesFound = this.performSearchIn(data[i].children);
                }
                if(!matchesFound){
                    this.fireEvent('mismatch', data[i]);
                }
            }
        }
        return matchesFound;
    }
});