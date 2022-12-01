var Question = function(enonce, question, propositions, reponses, feedback){
    this.enonce = enonce;
    this.question = question;
    this.propositions= [].concat(propositions);
    this.reponses= [].concat(reponses);
    this.feedback=feedback;
}

module.exports = Question;