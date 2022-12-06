const Question = require('../Question');

describe("Programme test sémantique des questions", function(){
	
	
	beforeAll(function() {

		this.Question = new Question("Choisir les bonnes réponses","Quelle est la couleur du cheval blanc d'henry 4 ?", "", ["Rouge","Bleu","Blanc","Blouge","Orange"],["Blanc"],[""],"","");

	});
	
	it("can create a new POI", function(){
		
		expect(this.Question).toBeDefined();
		// toBe is === on simple values
		expect(this.Question.enonce).toBe("Choisir les bonnes réponses");
		expect(this.Question).toEqual(jasmine.objectContaining({enonce: "Choisir les bonnes réponses"}));
		
	});
	
	it("can check a good answer", function(){
		
		expect(this.Question.reponses).toEqual(["Blanc"]);
		
	});
	
});