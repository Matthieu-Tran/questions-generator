describe("Program Syntactic testing of GiftParser", function(){
	
	beforeAll(function() {
		const Question = require('../Question');

		const GiftParser = require('../GiftParser');
		this.analyzer = new GiftParser();
		
		this.question = new Question("Choisir les bonnes réponses","Quelle est la couleur du cheval blanc d'henry 4 ?", "", ["Rouge","Bleu","Blanc","Blouge","Orange"],["Blanc"],[""],"","")

	});
	
	it("can read a name from a simulated input", function(){
		
		let input = ["enonce", "Choisir les bonnes réponses"];
		expect(this.analyzer.question(input)).toBe("Choisir les bonnes réponses");
		
	});
});