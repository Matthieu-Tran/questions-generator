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
    var separator = /(::|{|}|~|=|#|\r\n|\/{2})/;
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
        if(input.length > 0){
            this.question(input);
        }
        return true;
    }else{
        return false;
    }
}

GiftParser.prototype.body = function(input){
    var commentaire = ""
    // On cherche ici l'enonce dans l'input et on la met dans la variable 
    var enonce = this.enonce(input);
    var deuxiemePartieEnonce = ""
    // On cherche ici la question dans l'input et on la met dans la variable question
    var question = this.uneQuestion(input);
    var proposition = this.propositions(input)
    if(input[0]!='//'||input[0]!='::'){
        deuxiemePartieEnonce = this.next(input);
        console.log("tsetset")
    }
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

GiftParser.prototype.propositions = function(input){
    this.expect("{",input)
    var proposition = []
    var feedbackProposition = []
    var réponse = []
    var feedbackReponse = []
    var cur = this.next(input);
    // Tant qu'on arrive pas à la fin de la réponse, on boucle
    console.log9
    while(cur!='}'){
        //Si la proposition contient un feedback alors on met la proposition dans un tableau, de même que pour le feedback
        if(cur=='~'&&input[1]=="#"){
            cur = this.next(input);
            proposition.push(cur)
            cur = this.next(input);
            cur = this.next(input);
            feedbackProposition.push(cur)
        }
        //De meme pour une reponse
        else if(cur=='='&&input[1]=="#"){
            cur = this.next(input);

            //On push la réponse et la proposition afin de permettre à l'utilisateur de visualiser les propositions mais aussi on va pouvoir vérifier les réponses
            réponse.push(cur)
            proposition.push(cur)

            cur = this.next(input);
            cur = this.next(input);
            feedbackReponse.push(cur)
        }
        // Si la reponse ne contient aucune feedback alors, on n'en met pas
        else if(cur=='~'){
            cur = this.next(input);
            proposition.push(cur)
        }else if(cur=='='){
            cur = this.next(input);
            réponse.push(cur)
            proposition.push(cur)
        }
        var cur = this.next(input); 
    }  
    //return curS;
}

GiftParser.prototype.errMsg = function(msg, input){
	this.errorCount++;
	console.log("Parsing Error ! on "+input+" -- msg : "+msg);
}

module.exports = GiftParser