$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));
    var profilePlacement = document.getElementById("Profiel");
    var templateProfile;

    function makeAnProfile(voornaam, achternaam, geslacht, geboorteDatum, woonplaats, telefoonnr, emailAdres, bio) {
        templateProfile = document.importNode(document.getElementById("profiel_template").content, true);
        let voornaamInput = templateProfile.getElementById("profiel_input_voornaam");
        let achternaamInput = templateProfile.getElementById("profiel_input_achternaam");
        //let geslachtInput = templateProfile.getElementById("profiel_input_geslacht");
        let geboorteDatumInput = templateProfile.getElementById("profiel_input_geboortedatum");
        let woonplaatsInput = templateProfile.getElementById("profiel_input_woonplaats");
        let telefoonnrInput = templateProfile.getElementById("profiel_input_telefoonnr");
        let emailAdresInput = templateProfile.getElementById("profiel_input_email");
        let bioInput = templateProfile.getElementById("profiel_input_bio");

        voornaamInput.innerHTML = voornaam;
        achternaamInput.innerHTML = achternaam;
        //geslachtInput.innerHTML = geslacht;
        geboorteDatumInput.innerHTML = geboorteDatum;
        woonplaatsInput.innerHTML = woonplaats;
        telefoonnrInput.innerHTML = telefoonnr;
        emailAdresInput.innerHTML = emailAdres;
        bioInput.innerHTML = bio;

        return templateProfile.firstElementChild
    }

    var appendVoornaam;
    var appendAchternaam;
    //var appendGeslacht;
    var appendGeboorteDatum;
    var appendWoonplaats;
    var appendTelefoonnr;
    //var appendEmailAdres;
    var appendBio;

    FYSCloud.API.queryDatabase(
        "SELECT gebruikerid, profiel_foto, voornaam, achternaam, geslacht, geboorte_datum, woonplaats, telefoon_nummer, interesse, bio FROM gebruiker_profiel",
        [sessionStorage.getItem('userId')]
    ).done(function (data) {
        console.log(data)
        appendVoornaam = data[0]['vooraam']
        appendAchternaam = data[0]['achternaam']
        //appendGeslacht = data[0]['geslacht']
        appendGeboorteDatum = data[0]['geboorte_datum']
        appendWoonplaats = data[0]['woonplaats']
        appendTelefoonnr = data[0]['telefoon_nummer']
        //appendEmailAdres = data[0]['email_adres']
        appendBio = data[0]['bio']
        console.log(appendAchternaam, appendVoornaam, appendGeboorteDatum, appendWoonplaats, appendTelefoonnr, appendBio)
        let profielElement = makeAnProfile(appendAchternaam, appendVoornaam, appendGeboorteDatum, appendWoonplaats, appendTelefoonnr, appendBio)
        profilePlacement.appendChild(profielElement);

    }).fail(function (reason) {
        console.log(reason);
        console.log("fout");
    })


});
