const fs = require('fs')
const colors = require('colors');
const GiftParser = require('./GiftParser.js')

const vg = require('vega');
const vegalite = require('vega-lite');

const cli = require("@caporal/core").default;

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
				logger.info("The .gift file is a valid gift file".green);
			}else{
				logger.info("The .gift file contains error".red);
			}
			
			logger.debug(analyzer.parsedQuestion);

		});
	
	})

	// search
	.command('search', 'Free text search on gift\'s questions')
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
			logger.info("%s", JSON.stringify(filtered, null, 2));
			
		}else{
			logger.info("The .gift file contains error".red);
		}
		
		});
	})
	.command('search', 'Free text search on gift\'s questions')
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
			logger.info("%s", JSON.stringify(filtered, null, 2));
			
		}else{
			logger.info("The .gift file contains error".red);
		}
		
		});
	})
	
    cli.run(process.argv.slice(2));