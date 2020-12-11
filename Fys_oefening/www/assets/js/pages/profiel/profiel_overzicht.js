$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));

    function date() {
        var minimaleLeeftijd = 18
        var vandaag = new Date();
        var dag = vandaag.getDate();
        var maand = vandaag.getMonth() + 1;
        var jaar = vandaag.getFullYear() - minimaleLeeftijd;
        if (dag < 10) {
            dag = "0" + dag;
        }
        if (maand < 10) {
            maand = "0" + maand;
        }
        vandaag = jaar + "-" + maand + "-" + dag;
        document.getElementById("profiel_input_geboortedatum").setAttribute("max", vandaag);
        console.log(document.getElementById("profiel_input_geboortedatum").getAttribute("max"));
        return vandaag
    }

    if (sessionStorage.getItem("userId") !== null) {
        document.getElementById("profielFoto").setAttribute("src", "https://dev-is106-3.fys.cloud/uploads/" + sessionStorage.getItem("userId") + ".png");
        console.log("src", "https://dev-is106-3.fys.cloud/uploads/" + sessionStorage.getItem("userId") + ".png");
    }


    FYSCloud.API.queryDatabase(
        "SELECT profiel_foto, voornaam, achternaam, geslacht, DATE (geboorte_datum), woonplaats, telefoon_nummer, interesse, bio FROM gebruiker_profiel WHERE gebruikerid = ?",
        [sessionStorage.getItem('userId')]
    ).done(function (data) {
        console.log(data)
        let datum = data[0]["DATE (geboorte_datum)"];
        datum = datum.slice(0, 10);
        document.getElementById("profiel_input_voornaam").setAttribute("placeholder", data[0]["voornaam"]);
        document.getElementById("profiel_input_achternaam").setAttribute("placeholder", data[0]["achternaam"]);
        document.getElementById("profiel_input_geslacht").setAttribute("placeholder", data[0]["geslacht"]);
        document.getElementById("profiel_input_geboortedatum").setAttribute("placeholder", datum);
        document.getElementById("profiel_input_woonplaats").setAttribute("placeholder", data[0]["woonplaats"]);
        document.getElementById("profiel_input_telefoonnr").setAttribute("placeholder", data[0]["telefoon_nummer"]);
        document.getElementById("profiel_input_bio").setAttribute("placeholder", data[0]["bio"]);
        $('#gegevens_bewerken').on("click", function (bewerken) {
            bewerken.preventDefault();
            document.getElementById("profiel_input_geboortedatum").setAttribute("type", "date");
            date();
        })
        $("#gegevens_opslaan").on("click", function (opslaan) {
            opslaan.preventDefault();
            document.getElementById("profiel_input_geboortedatum").setAttribute("type", "text");
            document.getElementById("profiel_input_geboortedatum").setAttribute("placeholder", datum);

        })
    }).fail(function (reason) {
        console.log(reason);
        console.log("fout");
    })
    FYSCloud.API.queryDatabase(
        "SELECT emailadres FROM gebruiker WHERE gebruikerid = ?",
        [sessionStorage.getItem('userId')]
    ).done(function (data) {
        console.log(data)
        document.getElementById("profiel_input_email").setAttribute("placeholder", data[0]["emailadres"]);
    }).fail(function (reason) {
        console.log(reason);
        console.log("fout");
    })

});
