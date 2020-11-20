$(document).ready(function (qualifiedName, value) {
    $(".gegevens_opslaan").on("click", function (gegevens) {
        gegevens.preventDefault();
        var telefoon = $("#telefoon").is(":valid");
        if (telefoon) {
            location.href = "#";
        }
        if (!telefoon) {
            document.getElementById("telefoon").style.borderColor = "red";
            document.getElementById("geenTelefoon").style.display = "block";
        } else {
            document.getElementById("telefoon").style.borderColor = "black";
            document.getElementById("geenTelefoon").style.display = "none";
        }


        var voornaam = document.getElementById('voornaam').value;
        var achternaam = document.getElementById('achternaam').value;
        var geboorteDatum = document.getElementById('geboortedatum').value;
        var woonplaats = document.getElementById('woonplaats').value;
        var telefoonNummer = document.getElementById('telefoon').value;
        var bio = document.getElementById('bio').value;

        FYSCloud.API.queryDatabase(
            "INSERT INTO gebruiker(voornaam, achternaam, geboorte_datum, woonplaats, telefoon_nummer, bio )" +
            "VALUES(?,?,?,?,?,?)",
            [voornaam, achternaam, geboorteDatum, woonplaats, telefoonNummer, bio]
        ).done(function (data) {
            console.log(data);
        }).fail(function (reason) {
            console.log(reason);
        })
    })

    function datum() {
        var minimaleLeeftijd = 18
        var vandaag = new Date();
        var dag = vandaag.getDate();
        var maand = vandaag.getMonth() + 1;
        var jaar = vandaag.getFullYear() - minimaleLeeftijd;
        vandaag = jaar + "-" + maand + "-" + dag;
        document.getElementById("geboortedatum").setAttribute("max", vandaag);

    }

    datum();


})
;
