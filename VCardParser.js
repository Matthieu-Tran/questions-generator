const VCard = require('./VCard');

var VCardParser = function () { }

VCardParser.prototype.convertir = function (input) {
    var champs = []

    function decouperChamps() {
        var tempString = "";
        for (var index = 0; index < input.length; index++) {
            if (input.charAt(index) == "\n") {
                tempString = tempString.slice(tempString.indexOf(":") + 2);
                champs.push(tempString != "?" ? tempString : null);
                tempString = "";
            } else if (input.charAt(index) != "\r") {
                tempString += input.charAt(index);
            }
        }
    }
    decouperChamps();

    var nom = champs[0]
    var prenom = champs[1]
    var birthday = champs[2]
    var mail = champs[3]
    var tel = champs[4]
    var adresse = champs[5]
    var age = champs[6]
    var etablissement = champs[7]
    var sexe = champs[8]
    return (new VCard(nom, prenom, birthday, mail, tel, adresse, age, etablissement, sexe));
};

module.exports = VCardParser;
