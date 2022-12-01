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
    this.listQuestion(tData)
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

// Parser rules
GiftParser.prototype.listQuestion = function(input){
    this.question(input)
}

// accept : verify if the arg s is part of the language symbols.
GiftParser.prototype.accept = function(s){
	var idx = this.symb.indexOf(s);
	// index 0 exists
	if(idx === -1){
		this.errMsg("symbol "+s+" unknown", [" "]);
		return false;
	}

	return idx;
}

// check : check whether the arg elt is on the head of the list
GiftParser.prototype.check = function(s, input){
    if(this.accept(input[0]) == this.accept(s)){
        return true;
    }
    return false;
}
GiftParser.prototype.next = function(input){
	var curS = input.shift();
	if(this.showParsedSymbols){
		console.log(curS);
	}
	return curS
}

GiftParser.prototype.expect = function(s, input){
    if(s == this.next(input)){
        return true;
    }else{
		this.errMsg("symbol "+s+" doesn't match", input);
	}
	return false;
}

GiftParser.prototype.question = function(input){
    var title = /\((.+?)\)/;
    // On regarde si le fichier commence par '::'
    if(this.check("::", input)){
        this.expect("::",input);
        var args = this.body(input);
        return true;
    }else{
        return false;
    }
}

GiftParser.prototype.body = function(input){
    // On cherche ici l'enonce dans l'input et on la met dans la variable enonce
    var enonce = this.enonce(input);
    // On cherche ici la question dans l'input et on la met dans la variable question
    var question = this.uneQuestion(input);
    var proposition = this.propositions(input)
    console.log(input)
}


// On regarde le nom de l'enonce
GiftParser.prototype.enonce = function(input){
    var curS = this.next(input);
    if(matched = curS.match(/[\wàéèêîù'\s]+/i)){
		return matched[0];
	}else{
		this.errMsg("Invalid name", input);
	}
}

GiftParser.prototype.uneQuestion = function(input){
    this.expect("::",input)
    var curS = this.next(input);
    return curS;
}

// GiftParser.prototype.propositions = function(input){
//     this.expect("{",input)
//     var proposition = []
//     var curS = this.next(input);
//     // Tant qu'on arrive pas à la fin de la réponse, on boucle
//     while(curS != '}'){
//         if(curS=='~'){
//             curS = this.next(input);
//         }
//     }
//     return curS;
// }

module.exports = GiftParser