# README - Syrem Questionaires - Projet GL02
### https://git.utt.fr/tranmatt/gl02_a22_groupe-groupe-project 

# :question: Description :question:
Utility to manage exams.

# Grammar ABNF :

## GIFT format:
    Exam = Question =
    // Comment = Title = Statement = Format =
    Answers =
    Proposal =
    ProposalNumber = rique
    AnswerText =
    Feedback =
    FeedbackGeneral = Text =
    1*Question
    Title WSP Statement WSP '{' Answers '}'CRLF| Title WSP Statement WSP '{' Answers FeedbackGeneral'}'CRLF
    Text CRLF
    '::'Text
    '::'Text | WSP Format Text
    '[html]' | '[moodle]' | '[plain]' | '[markdown]'
    1*Proposition CRLF| 1*Proposition WSP Feedback CRLF| 1*PropositionNumeric CRLF| '#'1*PropositionNumeric WSP Feedback CRLF
    T' | 'F' | 'TRUE'| 'FALSE'| '='TextResponse | '~'TextResponse|
    ='Text WSP'->'Text | WSP
    ='Number':'Number CRLF| Number'...'Number CRLF|
    Text |
    Number'...'Number'...'Text | '%'Percent Sign'%'Text |
    #'Text
    ####' Text 1*(WSP / VCHAR)

## vCard format:
    VCARD = "BEGIN:VCARD" CRLF "VERSION:4.0" CRLF 1*contentline
            "END:VCARD" CRLF
            A vCard object MUST include the VERSION
            VERSION MUST be immediately after BEGIN:VCARD.

    contentline = [group "."] name *(";" param) ":" value CRLF

    group = 1*(ALPHA | DIGIT | "-")

    name = "SOURCE" | "KIND" | "FN" | "N"| "NICKNAME"| "PHOTO" | BDAY"
            | "BIRTHDAY" | "GENDER" | "ADR" | "TEL" | "EMAIL" | "IMPP" | "LANG" | "TZ" | "TZ" | "TZ" | "TZ" | "TZ
            | "TZ" | "GEO" | "TITLE" | "ROLE" | "LOGO" | "ORG" |
            | "MEMBER" | "RELATED" | "CATEGORIES" | "NOTE" | "PRODID" | "REV" | "SOUND" | "GA" |
            "REV" | "SOUND" | "UID" | "CLIENTPIDMAP" | "URL" | "KEY" |
            "FBURL" | "CALADRURI" | "CALURI" | "XML" | iana-token |
            x-name
            The parsing of "param" and "value" is based on
            name" as defined in the ABNF sections below
            ; Group and name are class sensitive.

    iana-token = 1*(ALPHA | DIGIT | "-")

    x-name = "x-" 1*(ALPHA | DIGIT | "-")
            ; Names that begin with "x-" or "X-" are reserved for experimental
            experimental use and are not intended to be
            published

    param = language-param | value-param | pref-param | pid-param | type-param | geo-parameter | tz-parameter | sort-as-param
            | calscale-param | any-param
            The allowed parameters depend on the property name
    param-value = *SAFE-CHAR | DQUOTE *QSAFE-CHAR DQUOTE

    any-param = (iana-token | x-name) "=" param-value *("," param-value)

    QSAFE-CHAR = WSP | "!" | %x23-7E | NON-ASCII
        ; All characters except CTLs, DQUOTE

    SAFE-CHAR = WSP | "!" | %x23-39 | %x3C-7E | NON-ASCII
        ; All characters except CTLs, DQUOTE, ";", ":"

    VALUE-CHAR = WSP | VCHAR | NON-ASCII
    
    NON-ASCII = UTF8-2 | UTF8-3 | UTF8-4

# Installation 
$ npm install

# Usage 
    $ node caporalCli.js <command>
Commands:


    check <filename>
        arguments: 
            file: The name of the .gift file to read.
        options:
            -s: Log the symbols parsed at each step.
            -t : Log the result of the tokenization
        actions :
            Checks that the given file has questions written according to the specified ABNF grammar and are therefore usable for the rest of the commands.
        return :
            void
        errors :
            If a file contains questions that do not match the GIFT format the console indicates that the file contains errors.
        example of use :
            node caporalCli.js check examentest.gift

    rechercher <file> <needle>
        arguments: 
            file: The name of the .gift file to read.
            needle: The word or words being searched for.
        options:
            None
        actions:
            Displays any <GiftBank> question that has a field containing <search>. 
        return:
            void
        errors:
            If <GiftDataBank> is not parsable, returns an error message.
        example of use:
            node caporalCli.js search examentest.gift Chose
        notes:
            This function meets the SPEC1 of the CDCF.

    createTest <file>
        arguments: 
            file: The name of the .gift file to be read.
            name: name given to the test 
        options:
            none.
        alias :
            CE
        actions:
            Creates a file with the name of the exam and containing the questions converted to GIFT format.
        return:
            void
        errors:
            If <GiftBank> is not parsable, returns an error message.
            node caporalCli.js creerTest examentest.gift exam.gift
        notes:
            This function meets the SPEC1 of the CDCF.

    checkExam <file>
        arguments: 
            file: The name of the .gift file to be read.
            name: name given to the exam. 
        options:
            none.
        alias :
            CE
        actions:
            Looks at whether the review file is suitable according to the criteria in the CDCF specification.
        return:
            void
        errors:
        If <GiftBank> is not parsable, returns an error message.
            If <GiftBank> is not parsable, returns an error message.
            If the number of given questions is >20, the software offers the user to remove questions.
            If the number of questions given is <15, the software deletes the file
            If a question is given in duplicate, the software proposes to the user to delete the duplicate
        
            node caporalCli.js creerTest examentest.gift exam.gift
        notes:
            This function meets the SPEC1 of the CDCF.

    createVCard <name> <firstname> <mail> <telephone> <address> <city> <postcode> <age> <institution> <sex>
        arguments:
            lastname: name of the teacher
            first name : first name of the teacher
            mail : email of the teacher
            telephone : teacher's phone number
            address : teacher's address (Warning : write the address without spaces)
            city : city where the teacher lives
            zip code : zip code of the city where the teacher lives
            age : age of the teacher
            school : teacher's school
            sex : gender of the teacher
        options : 
            none.
        actions :
            Generates a file in VCard format with the teacher's information
        return:
            .vcard file
        errors:
            if one of the arguments is missing, the software indicates it.
        example of use:
               $ node caporalCli.js genererVCard Matthieu Tran matthieu.tran@utt.fr 0102030405 42ruejeandupont Troyes 10000 UTT Man      
        NOTES:
            this command meets SPEC5 of the specification
    
    exam <file>
        arguments:
            file: the name of the file in gift format that we want to pass the test.
        options:
            none.
        actions:
            Passes the test, then generates a score based on the number of correct answers. Open questions do not count in the score.
        return :
            void
        errors:
            If <filename> is not parsable, returns an error message.
        usage example:
            $ node caporalCli.js exam examentest.gift
        NOTES:
            This function meets the SPEC3 of the CDCF.


## 0.1
Basic Parser. The data had to be rearranged because the ABNF partially matched the data.

Implemented MCQ, true/false, open-ended, numeric and missing word questions.

Implemented teacher information cards (VCard).

Possibility to take an exam.

Possibility to create an exam according to a .gift file

The possibility to see the stats of the files in barChart has been omitted. The profile.html file is only static. An improvement is to be made.

## 0.2

Bug fixes (creation of exams with empty names, automatic addition of the .gift extension)

Possibility to create a Vegalite histogram

Improvement of the commands creerTest, CheckExam, the improvements are not finished

# List of contributors

### Matthieu TRAN

### Charles OSSOLA

### Nathan Boutevilain

### Tan Dung Pham

### Gwenaëlle Riou

### Antonin Dominguez

### Charles Miliotis

*Name of the development team* : Groupegroupe  
*Members* : Matthieu TRAN,Charles OSSOLA, Nathan Boutevilain, Tan Dung Pham  
*Name of the refreactoring team*: Ort  
*Members* : Gwenaëlle RIOU, Antonin DOMIGUEZ,Charles MILIOTIS  
*Licence* : MIT
