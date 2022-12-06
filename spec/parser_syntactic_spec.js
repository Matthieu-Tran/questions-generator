describe("Program Syntactic testing of GiftParser", function(){
	
	beforeAll(function() {
		const Question = require('../Question');
		const GiftParser = require('../GiftParser');
		this.analyzer = new GiftParser();
		this.Question = new Question("Choisir les bonnes réponses","Quelle est la couleur du cheval blanc d'henry 4 ?", "", ["Rouge","Bleu","Blanc","Blouge","Orange"],["Blanc"],[""],"","")

	});
	
	it("Peut reconnaître un énoncé", function(){
		
		let input = ["Choisir les bonnes réponses"];
		expect(this.analyzer.enonce(input)).toBe("Choisir les bonnes réponses");
	});

	it("peut parser une question entière avec une entrée simulée.", function(){
		
		let input = "::EM U5 p34 Gra1.1::Would you like {~=some~a few} rice with your chicken?"
		let data = this.analyzer.tokenize(input);
		expect(this.analyzer.question(data)).toBeTrue();
		
	});
});