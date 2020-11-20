$(document).ready(function () {

    $(".register_button").on("click", function (gegevens) {
        gegevens.preventDefault();
        var gebruikersnaamValid = $("#gebruikersnaam").is(":valid");
        var emailAdresValid = $("#emailadres").is(":valid");
        var wachtwoordValid = $("#wachtwoord").is(":valid");
        var wachtwoordCheckValid = $("#wachtwoordCheck").is(":valid");

        if (gebruikersnaamValid && emailAdresValid && wachtwoordValid && wachtwoordCheckValid) {

            var gebruikersNaam = document.getElementById('gebruikersnaam').value;
            var emailAdres = document.getElementById('emailadres').value;
            var wachtwoord = document.getElementById('wachtwoord').value;

            FYSCloud.API.queryDatabase(
                "INSERT INTO gebruiker(gebruikers_naam, emailadres, wachtwoord)" +
                "VALUES(?,?,?)",
                [gebruikersNaam, emailAdres, wachtwoord]
            ).done(function (data) {
                console.log(data);
                sessionStorage.setItem("userId", data.insertId)
                console.log(sessionStorage.getItem("userId"));
                location.href = "createProfile.html";
            }).fail(function (reason) {
                console.log(reason);
            })
        }
    });

    $(".gegevens_opslaan").on("click", function (gegevens) {
        gegevens.preventDefault();
        console.log(sessionStorage.getItem("userId"));
        var voornaam = document.getElementById('voornaam').value;
        var achternaam = document.getElementById('achternaam').value;
        var geboorteDatum = document.getElementById('geboortedatum').value;
        var woonplaats = document.getElementById('woonplaats').value;
        var telefoonNummer = document.getElementById('telefoon').value;
        var bio = document.getElementById('bio').value;

        //(voornaam, achternaam, geboortedatum, woonplaats, telefoonnummeer, bio)
        FYSCloud.API.queryDatabase(
            "UPDATE gebruiker SET voornaam = ?, achternaam = ?, geboorte_datum = ?, woonplaats = ?, telefoon_nummer = ?, bio = ? WHERE gebruikerid= ?",
            [voornaam, achternaam, geboorteDatum, woonplaats, telefoonNummer, bio, sessionStorage.getItem("userId")]
        ).done(function (data) {
            console.log(data);
        }).fail(function (reason) {
            console.log(reason);
        })
    })


    var initialLanguage = "en";

    var translations = {
        homepage: {
            button: {
                nl: "Registreren",
                en: "Register"
            }
        },
    };

    FYSCloud.Localization.setTranslations(translations);
    FYSCloud.Localization.switchLanguage(initialLanguage);

    $("#localizationLanguageSwitch").val(initialLanguage);

    $("#localizationLanguageSwitch").on("change", function () {
        FYSCloud.Localization.switchLanguage($(this).val());
    });

    $("#localizationDynamicClick").on("click", function () {
        var template = $("#localizationDynamicTemplate").html();

        var element = $(template);

        $(".localizationSubheaderTarget").append(element);

        FYSCloud.Localization.translate();
    })
});