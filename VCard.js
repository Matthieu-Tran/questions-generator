var VCard = function (nom, prenom, birthday, mail, tel, adresse, age, etablissement, sexe) {
    this.nom = nom
    this.prenom = prenom
    this.birthday = birthday
    this.mail = mail
    this.tel = tel
    this.adresse = adresse
    this.age = age
    this.etablissement = etablissement
    this.sexe = sexe
}

VCard.prototype.exporter = function () {
    return ("Nom : " + this.nom + "\n" +
        "Prénom : " + this.prenom + "\n" +
        "Date de naissance : " + this.birthday + "\n" +
        "Adresse e-mail : " + this.mail + "\n" +
        "Numéro de téléphone : " + this.tel + "\n" +
        "Adresse : " + this.adresse + "\n" +
        "Age : " + this.age + "\n" +
        "Établissement : " + this.etablissement + "\n" +
        "Sexe : " + this.sexe + "\n");
};

module.exports = VCard;
