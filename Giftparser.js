let Question = require("./Question");

// GiftParser

var GiftParser = function(sTokenize, sParsedSymb){
    this.parsedQuestion = [];
    this.symb = ["::", "{", "}", "~", "=", "#"];
    //showTokenize ici est un caractere pour permettre de voir le fichier
	this.showTokenize = sTokenize;
	// pareil pour showParsedSymbol
	this.showParsedSymbols = sParsedSymb;
	this.errorCount = 0;
}

// parse : analyze data by calling the first non terminal rule of the grammar
GiftParser.prototype.parse = function(data){
	var tData = this.tokenize(data);
	if(this.showTokenize){
		console.log(tData);
	}
}

GiftParser.prototype.tokenize = function(data){
    var separator = /(::|{|}|~|=|#|\r\n)/;
    data = data.split(separator);
    separator = /(\r\n|\n)/;
	data = data.filter((val, idx) => !val.match(separator)); 
    //On enlève tous les espaces blanc qui sont en trop dans l'array
    data = data.filter(function(str) {
        return /\S/.test(str);
    });					
	return data;
}

module.exports = GiftParser