# README - Questionaires Syrem - Projet GL02
### https://git.utt.fr/tranmatt/gl02_a22_groupe-groupe-project 

# :question: Description :question:
Utilitaire permettant de gérer des examens.

# Grammaire ABNF :

## Format GIFT:
    Examen = Question =
    // Commentaire = Titre = Énoncé = Format =
    Réponses =
    Proposition =
    PropositionNumé = rique
    TexteRéponse =
    Feedback =
    FeedbackGeneral = Text =
    1*Question
    Titre WSP Énoncé WSP ‘{’ Réponses ‘}’CRLF| Titre WSP Énoncé WSP ‘{’ Réponses FeedbackGeneral‘}’CRLF
    Text CRLF
    ‘::’Text
    ‘::’Text | Format WSP Text
    ‘[html]’ | ‘[moodle]’ | ‘[plain]’ | ‘[markdown]’
    1*Proposition CRLF| 1*Proposition WSP Feedback CRLF| 1*PropositionNumérique CRLF| ‘#’1*PropositionNumérique WSP Feedback CRLF
    ‘T’ | ‘F’ |’TRUE’|’FALSE’| ‘=’TexteRéponse | ‘~’TextRéponse|
    ‘=’Text WSP ’->’Text | WSP
    ‘=’Nombre‘:’Nombre CRLF| Nombre’..’nombre CRLF|
    Text |
    ‘%’Nombre’%’Text | ‘%’Signe Pourcent’%’Text |
    ‘#’Text
    ‘####’ Text 1*(WSP / VCHAR)

## Format vCard :
    VCARD = "BEGIN:VCARD" CRLF "VERSION:4.0" CRLF 1*contentline
            "END:VCARD" CRLF
            ; Un objet vCard DOIT inclure la VERSION
            ; VERSION DOIT se situer immédiatement après BEGIN:VCARD.

    contentline = [group "."] name *(";" param) ":" value CRLF

    group = 1*(ALPHA | DIGIT | "-")

    name = "SOURCE" | "KIND" | "FN" | "N"| "NICKNAME"| "PHOTO" | BDAY"
            | "ANNIVERSARY" | "GENDER" | "ADR" | "TEL" | "EMAIL" | "IMPP"
            | "LANG" | "TZ" | "GEO" | "TITLE" | "ROLE" | "LOGO" | "ORG" |
            "MEMBER" | "RELATED" | "CATEGORIES" | "NOTE" | "PRODID" |
            "REV" | "SOUND" | "UID" | "CLIENTPIDMAP" | "URL" | "KEY" |
            "FBURL" | "CALADRURI" | "CALURI" | "XML" | iana-token |
            x-name
            ; L'analyse syntaxique de “param” and “value” est basée sur
            le "nom" tel que défini dans les sections ABNF ci-dessous
            ; Group et name sont sensibles à la classe.

    iana-token = 1*(ALPHA | DIGIT | "-")

    x-name = "x-" 1*(ALPHA | DIGIT | "-")
            ; Les noms qui commences par"x-" ou "X-" sont réservés pour
            une utilisations expérimentale et ne sont pas destiné à être
            publié

    param = language-param | value-param | pref-param | pid-param | type-param | geo-parameter | tz-parameter | sort-as-param
            | calscale-param | any-param
            ;Les paramètres autorisées dépendent du nom de la propriété
    param-value = *SAFE-CHAR | DQUOTE *QSAFE-CHAR DQUOTE

    any-param = (iana-token | x-name) "=" param-value *("," param-value)

    QSAFE-CHAR = WSP | "!" | %x23-7E | NON-ASCII
        ; Tous les caractères sauf CTLs, DQUOTE

    SAFE-CHAR = WSP | "!" | %x23-39 | %x3C-7E | NON-ASCII
        ; Tous les caractères sauf CTLs, DQUOTE, ";", ":"

    VALUE-CHAR = WSP | VCHAR | NON-ASCII
    
    NON-ASCII = UTF8-2 | UTF8-3 | UTF8-4

# Installation 
$ npm install

# Utilisation 
    $ node caporalCli.js <commande>
Commandes :


    check <nomFichier>
        arguments : 
            file : Le nom du fichier .gift à lire.
        options :
            -s : Log les symboles analysés à chaque étape
            -t : Log le résultat de la tokenisation
        actions :
            Vérifie que le fichier donnée comporte des questions écrite selon la grammaire ABNF spécifiée et sont donc bien utilisable pour le reste des commande.
        retour :
            void
        erreurs :
            Si un fichier comporte des questions qui ne correspondent pas au format GIFT la console indique que le fichier comprends des erreurs.
        exemple d'utilisation :
            node caporalCli.js check examentest.gift

    rechercher <file> <needle>
        arguments : 
            file : Le nom du fichier .gift à lire.
            needle : Le ou les mots recherchés
        options :
            Aucunes
        actions :
            Affiche toute question de <banqueDeDonnesGift> dont un champ contient <recherche>. 
        retour :
            void
        erreurs :
            Si <banqueDeDonnesGift> n'est pas parsable, renvoie un message d'erreur.
        exemple d'utilisation :
            node caporalCli.js rechercher examentest.gift Chose
        notes :
            Cette fonction répond à la SPEC1 du CDCF.

    creerTest <file>
        arguments : 
            file : Le nom du fichier .gift à lire.
            nom : nom donné à l'examen 
        options :
            aucunes.
        alias :
            CE
        actions :
            Crée un fichier portant le nom de l'examen et contenant les questions converties au format GIFT.
        retour :
            void
        erreurs :
            Si <banqueDeDonnesGift> n'est pas parsable, renvoie un message d'erreur.
            node caporalCli.js creerTest examentest.gift exam.gift
        notes :
            Cette fonction répond à la SPEC1 du CDCF.

    checkExam <file>
        arguments : 
            file : Le nom du fichier .gift à lire.
            nom : nom donné à l'examen 
        options :
            aucunes.
        alias :
            CE
        actions :
            Regarde si le fichier d'examen est convenable selon les critères de la spécification du CDCF
        retour :
            void
        erreurs :
        Si <banqueDeDonnesGift> n'est pas parsable, renvoie un message d'erreur.
            Si <banqueDeDonnesGift> n'est pas parsable, renvoie un message d'erreur.
            Si le nombre de questions données est >20, le logiciel propose à l'utilisateur de retirer des questions.
            Si le nombre de questions données est <15, le logiciel supprime le fichier
            Si une question est donnée en double, le logiciel propose à l'utilisateur supprime le duplicat
        
            node caporalCli.js creerTest examentest.gift exam.gift
        notes :
            Cette fonction répond à la SPEC1 du CDCF.

    createVCard <nom> <prenom> <mail> <telephone> <adresse> <ville> <codepostal> <age> <etablissement> <sexe>
        arguments :
            nom : nom de l'enseignant
            prenom : prénom de l'enseignant
            mail : email de l'enseignant
            telephone : numéro de téléphone de l'enseignant
            adresse : adresse de l'enseignant (Attention : écrire l'adresse sans espaces)
            ville : ville où habite l'enseignant
            codepostal : code postal de la ville où habite l'enseignant
            age : age de l'enseignant
            etablissement : etablissement d'enseignement de l'enseignant
            sexe : genre de l'enseignant
        options : 
            aucunes.
        actions :
            Permet de générer un fichier au format VCard avec les informations relatives à l'enseignant
        retour :
            un fichier .vcard
        erreurs :
            si un des arguments manque, le logiciel l'indique.
        exemple d'utilisation :
               $ node caporalCli.js genererVCard Matthieu Tran matthieu.tran@utt.fr 0102030405 42ruejeandupont Troyes 10000 UTT Homme      
        notes :
            cette commande répond à la SPEC5 du cahier des charges
    
    exam <file>
        arguments :
            file : le nom du fichier au format gift dont on veut passer le test.
        options :
            aucunes.
        actions :
            Fait passer le test, puis génère une note en fonction du nombre de bonnes réponses. Les questions ouvertes ne comptent pas dans la note.
        retour :
            void
        erreurs :
            Si <nomFichier> n'est pas parsable, renvoie un message d'erreur.
        exemple d'utilisation :
            $ node caporalCli.js exam examentest.gift
        notes :
            Cette fonction répond à la SPEC3 du CDCF.


## 0.1
Parser de base. Les données ont du être réarrangé car l'ABNF correspondait en partie aux données.

Implémentation des questions de type QCM, vrai/faux, ouvertes, numérique et mot manquant.

Implémentation des cartes d'informations sur les enseignants (VCard).

Possibilité de passer un examen.

Possibilit2 de crée un examen selon un fichier .gift

La possibilité de voir les stats des fichiers en barChart a été omise. Le fichier profile.html n'est mis que en statique. Une amélioration est à faire.


# Liste des contributeurs 
### Matthieu TRAN
### Charles OSSOLA
### Nathan Boutevilain
### Tan Dung Pham
