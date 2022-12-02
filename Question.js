var Question = function(enonce, question,deuxiemePartieQuestion, propositions, reponses, feedback, vraiOuFaux, match){
    this.enonce = enonce;
    this.question = question;
    this.deuxiemePartieQuestion = deuxiemePartieQuestion
    this.propositions= [].concat(propositions);
    this.reponses= [].concat(reponses);
    this.feedback=[].concat(feedback);
    //this.commentaire= commentaire;
    this.vraiOuFaux = vraiOuFaux;
    this.match = match;
    if(vraiOuFaux)
        this.typeQuestion = "qcm";
    else if (propositions.length>0)
        this.typeQuestion = "choixMultiples";
    else if(match){
        this.typeQuestion = "correspondance"
    }
    else    
        this.typeQuestion = "questionOuverte";
}

module.exports = Question;