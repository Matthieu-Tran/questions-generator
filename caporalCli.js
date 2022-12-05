const fs = require('fs')
const colors = require('colors');
const GiftParser = require('./GiftParser.js')
const cli = require("@caporal/core").default;
const Question = require('./Question.js');
const VCardParser = require('./VCardParser');
const vCard = require('./VCard.js')
const readline = require("readline");
const ChartJSImage = require("chart.js-image");

const open = require("open");
const regexText = /[a-zA-Z ]+/gm;
const regexDigit = /[0-9]+/gm;
const regexDate = /^(0[1-9]|[12][0-9]|3[01])[- /.] (0[1-9]|1[012])[- /.]/gm;
const regexAdresse = /[0-9 ]+ [a-zA-Z ]+ [0-9]+ [a-zA-Z ]+/gm;

var vCardsJS = require('vcards-js');

const vg = require('vega');
const vegalite = require('vega-lite');

cli
    .version('gift-parser-cli')
    .version('0.07')
    // check gift
    .command('check', 'Check if <file> is a valid gift file')
	.argument('<file>', 'The file to check with gift parser')
	.option('-s, --showSymbols', 'log the analyzed symbol at each step', { validator : cli.BOOLEAN, default: false })
	.option('-t, --showTokenize', 'log the tokenization results', { validator: cli.BOOLEAN, default: false })
	.action(({args, options, logger}) => {
		
		fs.readFile(args.file, 'utf8', function (err,data) {
			if (err) {
				return logger.warn(err);
			}
	  
			var analyzer = new GiftParser(options.showTokenize, options.showSymbols);
			analyzer.parse(data);
			
			if(analyzer.errorCount === 0){
				console.log(analyzer.parsedQuestion)
				logger.info("The .gift file is a valid gift file".green);
			}else{
				logger.info("The .gift file contains error".red);
			}

		});
	
	})

	// search
	.command('createTest', 'Recherche de questions selon les critères de l\'utilisateur')
	.argument('<file>', 'The Vpf file to search')
	.action(({args, options, logger}) => {
		fs.readFile(args.file, 'utf8', async function (err,data) {
		if (err) {
			return logger.warn(err);
		}

		function readInput() {
			const interface = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
			});
		
			return new Promise(resolve => interface.question("- ", answer => {
				interface.close();
				resolve(answer);
			}))
		}

		analyzer = new GiftParser();
		analyzer.parse(data);

		console.log(analyzer.parsedQuestion)
		console.log("Veuillez choisir vos questions, tapez 'quit' pour arrêter (Veillez mettre l'index de la question dans le terminal)")
		let laQuestion = "";
		let questionsExamen = []
		while(laQuestion.toLowerCase()!="quit"){
			laQuestion = await readInput();
			if(isNaN(Number(laQuestion))&&laQuestion.toLowerCase()!="quit"){
				console.log("Votre index n'est pas un entier".red)
			}
			else if(Number(laQuestion)<0||Number(laQuestion)>analyzer.parsedQuestion.length){
				console.log("Votre index est soit inférieur soit supérieur au nombre total de question dans le fichier .gift".red);
			}
			else if(laQuestion.toLowerCase()!="quit")
					questionsExamen.push(Number(laQuestion));
		}
		fs.copyFile(args.file, 'fichierExamen.gift', (err) => {
			if (err) throw err;
		});
		
		setTimeout(ecrireFichier, 4000)
		function ecrireFichier(){
			fs.readFile('fichierExamen.gift', 'utf8', function(err, data)
			{
				if (err)
				{
					// check and handle err
				}
				let regexEmptyLine = /\n/
				let tempData = data.split(regexEmptyLine)
				let indexDebut =0;
				let indexFin =0;
				let tableauIndexDebut =[1];
				let tableauIndexFin =[]
				for(let i =0; i<tempData.length;i++){
					if(tempData[i]===""){
						indexDebut= i+2;
						indexFin =i;
						tableauIndexDebut.push(indexDebut);
						tableauIndexFin.push(indexFin)
					}
				}
				tableauIndexDebut.pop();
				let lines =[];
				// .join() takes that array and re-concatenates it into a string
				for(let i =0; i<analyzer.parsedQuestion.length;i++){
					if(!questionsExamen.includes(i+1)){
						let nbLignesASupprimer = tableauIndexFin[i]-tableauIndexDebut[i];
						nbLignesASupprimer++;
						for(let j =0; j<nbLignesASupprimer;j++){
							lines.push((tableauIndexDebut[i]+j)-1)
						}
					}
				}
				const removeLines = (data, lines = []) => {
					return data
						.split('\n')
						.filter((val, idx) => lines.indexOf(idx) === -1)
						.join('\n');
				}
				
				fs.readFile('fichierExamen.gift', 'utf8', (err, data) => {
					if (err) throw err;
				
					// remove the first line and the 5th and 6th lines in the file
					fs.writeFile('fichierExamen.gift', removeLines(data, lines), 'utf8', function(err) {
						if (err) throw err;
						console.log("Votre questionnaire vient d'être créé.");
					});
				})
			});
		}
		});
	})
	

	// search
	.command('search', 'Recherche de questions selon les critères de l\'utilisateur')
	.argument('<file>', 'The Vpf file to search')
	.argument('<needle>', 'The text to look for in gift\'s questions')
	.action(({args, options, logger}) => {
		fs.readFile(args.file, 'utf8', function (err,data) {
		if (err) {
			return logger.warn(err);
		}
	
		analyzer = new GiftParser();
		analyzer.parse(data);
		
		if(analyzer.errorCount === 0){
			var n = new RegExp(args.needle)
			var filtered = analyzer.parsedQuestion.filter( p => p.question.match(n, 'i'));
			if(filtered.length>0)
				logger.info("%s", JSON.stringify(filtered, null, 2));
			else
				logger.info("Aucuns résultats, veuillez recommencer".red);
			
		}else{
			logger.info("The .gift file contains error".red);
		}
		
		});
	})

	.command('checkExam', 'Free text search on gift\'s questions')
	.argument('<file>', 'The Vpf file to search')
	.action(({args, options, logger}) => {
		fs.readFile(args.file, 'utf8', async function (err,data) {
		if (err) {
			return logger.warn(err);
		}
	
		function readInput() {
			const interface = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
			});
		
			return new Promise(resolve => interface.question("Question en trop: ", answer => {
				interface.close();
				resolve(answer);
			}))
		}

		analyzer = new GiftParser();
		analyzer.parse(data);

		let arrayDeQuestions = [];
		let questionConcat = ""
		for(let i = 0;i<analyzer.parsedQuestion.length;i++){
			if(analyzer.parsedQuestion[i].deuxiemePartieQuestion){
				questionConcat = analyzer.parsedQuestion[i].question.concat(analyzer.parsedQuestion[i].deuxiemePartieQuestion)
			}
			else
				questionConcat = analyzer.parsedQuestion[i].question;
			arrayDeQuestions.push(questionConcat)
		}
		let findDuplicates = arrayDeQuestions => arrayDeQuestions.filter((item, index) => arrayDeQuestions.indexOf(item) != index)
		let duplicates = findDuplicates(arrayDeQuestions)
		if (findDuplicates(arrayDeQuestions).length!=0){
			let posDuplicate =[];
			for (let i = 0 ; i<duplicates.length;i++){
				for(let j =0; j<analyzer.parsedQuestion.length;j++){
					if(arrayDeQuestions[j]===duplicates[i])
						posDuplicate.push(j)
				}
			}
			for(let i = 0 ; i<posDuplicate.length;i++){
				analyzer.parsedQuestion.splice(posDuplicate[i],1)
			}
		}

		console.log(args.file)
		if(analyzer.parsedQuestion.length<15){
			logger.info("Il n'y a pas assez de questions, le fichier va donc être supprimé. Veuillez refaire un examen".red)
			fs.unlink(args.file, err => {
				if(err){
					throw err;
				}
				else
					logger.info("Votre fichier d'examen vient d'être supprimé".red)
			})
		}
		else if(analyzer.parsedQuestion.length>20){
			let questions = [];
			for(let i = 0;i<analyzer.parsedQuestion.length;i++){
				if(analyzer.parsedQuestion[i].deuxiemePartieQuestion){
					questionConcat = analyzer.parsedQuestion[i].question.concat(analyzer.parsedQuestion[i].deuxiemePartieQuestion)
				}
				else
					questionConcat = analyzer.parsedQuestion[i].question;
				questions.push(questionConcat)
			}
			console.log(analyzer.parsedQuestion.length)
			logger.info("Votre fichier contient trop de questions, veuillez en supprimer quelques uns, Veuillez mettre l'indice des questions. De 0 à ".red + (analyzer.parsedQuestion.length-1).red )
			let tempQuestionEnTrop =[]
			while(analyzer.parsedQuestion.length>20){
				console.log(questions);
				let data = await readInput();
				tempQuestionEnTrop.push(Number(data))
				analyzer.parsedQuestion.splice(data,1)
				questions.splice(data,1)
			}
			console.log(tempQuestionEnTrop)
			fs.copyFile(args.file, 'fichierExamen.gift', (err) => {
				if (err) throw err;
			});
			
			setTimeout(ecrireFichier, 4000)
			function ecrireFichier(){
				fs.readFile('fichierExamen.gift', 'utf8', function(err, data)
				{
					if (err)
					{
						// check and handle err
					}
					let regexEmptyLine = /\n/
					let tempData = data.split(regexEmptyLine)
					let indexDebut =0;
					let indexFin =0;
					let tableauIndexDebut =[1];
					let tableauIndexFin =[]
					for(let i =0; i<tempData.length;i++){
						if(tempData[i]===""){
							indexDebut= i+2;
							indexFin =i;
							tableauIndexDebut.push(indexDebut);
							tableauIndexFin.push(indexFin)
						}
					}
					tableauIndexDebut.pop();
					let lines =[];
					// .join() takes that array and re-concatenates it into a string
					for(let i =0; i<analyzer.parsedQuestion.length;i++){
						if(tempQuestionEnTrop.includes(i+1)){
							let nbLignesASupprimer = tableauIndexFin[i]-tableauIndexDebut[i];
							nbLignesASupprimer++;
							for(let j =0; j<nbLignesASupprimer;j++){
								lines.push((tableauIndexDebut[i]+j)-1)
							}
						}
					}
					const removeLines = (data, lines = []) => {
						return data
							.split('\n')
							.filter((val, idx) => lines.indexOf(idx) === -1)
							.join('\n');
					}
					
					fs.readFile('fichierExamen.gift', 'utf8', (err, data) => {
						if (err) throw err;
					
						// remove the first line and the 5th and 6th lines in the file
						fs.writeFile('fichierExamen.gift', removeLines(data, lines), 'utf8', function(err) {
							if (err) throw err;
							console.log("Votre questionnaire vient d'être remis à jour.".green);
						});
					})
				});
			}

		}
		else{
			logger.info("Votre fichier d'examen est bon".green)
		}		
		});
	})

	.command('exam', 'Check if <file> is a valid gift file')
	.argument('<file>', 'The file to check with gift parser')
	.action(({args, options, logger}) => {
		
		fs.readFile(args.file, 'utf8', async function (err,data) {
			if (err) {
				return logger.warn(err);
			}
			function readInput() {
				const interface = readline.createInterface({
					input: process.stdin,
					output: process.stdout,
				});
			
				return new Promise(resolve => interface.question("Réponse: ", answer => {
					interface.close();
					resolve(answer);
				}))
			}
	  
			var analyzer = new GiftParser();
			analyzer.parse(data);
			let numberQuestion = analyzer.parsedQuestion.length;
			let cptBonneReponses =0;
			let lesQuestions =[]
			for(let i =0; i<numberQuestion;i++){
				lesQuestions.push(i)
			}
			while(numberQuestion!=0){
				var randomNumQuestion = Math.floor(Math.random() * numberQuestion);		
				let q = lesQuestions[randomNumQuestion]
				console.log(analyzer.parsedQuestion[q].question + "______" + analyzer.parsedQuestion[q].deuxiemePartieQuestion)
				if(analyzer.parsedQuestion[q].typeQuestion==="choixMultiples"){
					console.log(analyzer.parsedQuestion[q].propositions)
				}
				else if(analyzer.parsedQuestion[q].typeQuestion==="correspondance"){
					console.log(analyzer.parsedQuestion[q].match)
				}

				let data = await readInput();
				if(data===analyzer.parsedQuestion[q].reponses[0]){
					lesQuestions.splice(q,1);
					cptBonneReponses++;
					numberQuestion--;
				}
				else if (data!=analyzer.parsedQuestion[q].reponses[0]){
					lesQuestions.splice(q,1);
					numberQuestion--;
				}
			}
			console.log("")
			console.log("Le test est fini.")
			console.log("Vous avez eu: ".green +cptBonneReponses+" bonne(s) réponses".green)
			console.log("Vous avez donc une note de: " +cptBonneReponses+"/"+analyzer.parsedQuestion.length)
		});
	
	})



	
	
	
cli.run(process.argv.slice(2));