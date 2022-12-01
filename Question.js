var Question = function(enonce, deuxiemePartieEnonce, question, propositions, reponses, feedbackProposition, feedbackReponse,commentaire){
    this.enonce = enonce;
    this.deuxiemePartieEnonce = deuxiemePartieEnonce
    this.question = question;
    this.propositions= [].concat(propositions);
    this.reponses= [].concat(reponses);
    this.feedbackProposition=[].concat(feedbackProposition);
    this.feedbackReponse=[].concat(feedbackReponse);
    this.commentaire= commentaire
}

module.exports = Question;