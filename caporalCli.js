const fs = require('fs')
const colors = require('colors');
const GiftParser = require('./GiftParser.js')
const cli = require("@caporal/core").default;
const Question = require('./Question.js');
const readline = require("readline");
var vCardsJS = require('vcards-js');

cli
    .version('gift-parser-cli')
    .version('0.01')
    // check gift
    .command('check', 'Vérifie que c\'est un bon fichier .gift')
	.argument('<file>', 'Le nom du fichier .VCard à lire')
	.option('-s, --showSymbols', 'Log les symboles analysés à chaque étape', { validator : cli.BOOLEAN, default: false })
	.option('-t, --showTokenize', 'Log le résultat de la tokenisation', { validator: cli.BOOLEAN, default: false })
	.action(({args, options, logger}) => {
		
		fs.readFile(args.file, 'utf8', function (err,data) {
			if (err) {
				return logger.warn(err);
			}
	  
			var analyzer = new GiftParser(options.showTokenize, options.showSymbols);
			analyzer.parse(data);
			
			if(analyzer.errorCount === 0){
				console.log(analyzer.parsedQuestion)
				logger.info("Le fichier .gift est un fichier valide".green);
			}else{
				logger.info("Le fichier .gift contient des erreurs".red);
			}

		});
	
	})
	.command('readme', 'affiche le readme')
	.action(() => {
		fs.readFile("./README.md", "utf-8", function (err, data) {
			if (err) { return console.log("erreur dans la lecture du readme !"); }
			console.log(data);
		});
	})

	// search
	.command('creerTest', 'Creer un test selon les questions que veut l\'utilisateur')
	.argument('<file>', 'Le fichier pour crée le test')
	.argument('<name>', 'Nom du test')
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

		//Tant que l'utilisateur n'a pas mis 'quit' on continue de faire le fichier
		while(laQuestion.toLowerCase()!="quit"){
			laQuestion = await readInput();
			if(isNaN(Number(laQuestion))&&laQuestion.toLowerCase()!="quit"){
				console.log("Votre index n'est pas un entier".red)
			}
			//Si l'index que l'utilisateur met est inférieur ou supérieur au nombre de question, on affiche une erreur
			else if(Number(laQuestion)<0||Number(laQuestion)>analyzer.parsedQuestion.length){
				console.log("Votre index est soit inférieur soit supérieur au nombre total de question dans le fichier .gift".red);
			}
			else if(laQuestion.toLowerCase()!="quit")
					questionsExamen.push(Number(laQuestion));
		}
		
		// Ici, on va copier le fichier initial puis on va supprimer les questions qui ne sont pas séléctionnés

		fs.copyFile(args.file, args.name, (err) => {
			if (err) throw err;
		});
		
		setTimeout(ecrireFichier, 4000)
		function ecrireFichier(){
			fs.readFile(args.name, 'utf8', function(err, data)
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
				
				fs.readFile(args.name, 'utf8', (err, data) => {
					if (err) throw err;
				
					// On enlève toutes les lignes qui ne correspondent pas aux questions choisis
					fs.writeFile(args.name, removeLines(data, lines), 'utf8', function(err) {
						if (err) throw err;
						console.log("Votre questionnaire vient d'être créé.");
					});
				})
			});
		}
		});
	})
	

	// rechercher
	.command('rechercher', 'Recherche de questions selon les un mot que met l\'utilisateur')
	.argument('<file>', 'Le nom du fichier .VCard à lire')
	.argument('<needle>', 'Le ou les mots recherchés')
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

	.command('checkExam', 'Vérifier si il y a bien plus de 15 questions, moins de 20 questions et pas de redondance')
	.argument('<file>', 'Nom du fichier')
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

			// Tant que l'utilisateur n'a pas réduit suffisament le nombre de questions, on continue de lui demander d'enlever des questions
			while(analyzer.parsedQuestion.length>20){
				console.log(questions);
				let data = await readInput();
				tempQuestionEnTrop.push(Number(data))
				analyzer.parsedQuestion.splice(data,1)
				questions.splice(data,1)
			}

			//Ici, on va faire pareil que lorsqu'on veut créer un fichier sauf qu'on va supprimer les lignes dont les questions choisis sont en trop
			fs.copyFile(args.file, 'fichierExamen.gift', (err) => {
				if (err) throw err;
			});
			
			setTimeout(ecrireFichier, 4000)
			function ecrireFichier(){
				fs.readFile('fichierExamen.gift', 'utf8', function(err, data)
				{
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

	.command('exam', 'Permet de faire passer un examen à un étudiant')
	.argument('<file>', 'Nom du fichier')
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

			// Tant que l'utilisateur n'a pas fini l'examen, on continue
			while(numberQuestion!=0){
				var randomNumQuestion = Math.floor(Math.random() * numberQuestion);		
				let q = lesQuestions[randomNumQuestion]
				console.log(analyzer.parsedQuestion[q].question + "______" + analyzer.parsedQuestion[q].deuxiemePartieQuestion)
				if(analyzer.parsedQuestion[q].typeQuestion==="choixMultiples"){
					console.log(analyzer.parsedQuestion[q].propositions)
				}
				else if(analyzer.parsedQuestion[q].typeQuestion==="correspondance"){
					numberQuestion--;
					break;
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

	.command('createVCard')
	.argument('<nom>', 'Nom de l\'enseignant')
	.argument('<prenom>', 'Prénom de l\'enseignant')
	.argument('<mail>', 'Mail de l\'enseignant')
	.argument('<telephone>', 'Téléphone de l\'enseignant')
	.argument('<adresse>', 'Adresse de l\'enseignant')
	.argument('<ville>', 'Ville où l\'enseignant habite')
	.argument('<codepostal>', 'Code postal de la ville où l\'enseignant habite')
	.argument('<etablissement>', 'Etablissement de l\'enseignant')
	.argument('<sexe>', 'Genre de l\'enseignant')
	.action(async ({args, options, logger}) => {
		let vCard = vCardsJS();

		vCard.firstName = args.prenom;
		vCard.lastName = args.nom;
		vCard.email = args.mail;
		vCard.cellPhone = args.telephone;
		vCard.homeAddress.street = args.adresse; //pb car adresse en trois parties --> faire concanetation dans une variable
		vCard.homeAddress.city = args.ville;
		vCard.homeAddress.postalCode = args.codepostal;
		vCard.organization = args.etablissement;
		vCard.gender = args.sexe;
		  
		// Save contact to VCF file
		vCard.saveToFile(args.prenom+`.vcf`);
	})

	
cli.run(process.argv.slice(2));