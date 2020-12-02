$(document).ready(function () {


    $('#gegevens_bewerken').on("click", function (bewerken) {
        bewerken.preventDefault();
        var readonlycheck = document.getElementsByClassName("profiel_input");
        var explorer = $("#tag_explorer").is(":checked");

        if (readonlycheck) {
            $(".profiel_input").attr("readonly", false);
            document.getElementById("gegevens_opslaan").style.display = "block";
            document.getElementById("gegevens_bewerken").style.display = "none";
            document.getElementById("explorer").style.display = "block";

        } else if (explorer) {
            document.getElementById("explorer").style.display = "block";
        }

    })

    $("#gegevens_opslaan").on("click", function (opslaan) {
        opslaan.preventDefault();
        var voornaam = document.getElementById("profiel_input_voornaam").value;
        var achternaam = document.getElementById("profiel_input_achternaam").value;
        var geboortedatum = document.getElementById("profiel_input_geboortedatum").value;
        var woonplaats = document.getElementById("profiel_input_woonplaats").value;
        var telefoonnr = document.getElementById("profiel_input_telefoonnr").value;
        var bio = document.getElementById("profiel_input_bio").value;

        if (voornaam !== "") {
            FYSCloud.API.queryDatabase(
                "UPDATE gebruiker_profiel SET voornaam = ? WHERE gebruikerid = ?",
                [voornaam, sessionStorage.getItem("userId")]
            ).done(function (data) {
                console.log(data);
            }).fail(function (reason) {
                console.log(reason);
            })
        }
        if (achternaam !== "") {
            FYSCloud.API.queryDatabase(
                "UPDATE gebruiker_profiel SET achternaam = ? WHERE gebruikerid = ?",
                [achternaam, sessionStorage.getItem("userId")]
            ).done(function (data) {
                console.log(data);
            }).fail(function (reason) {
                console.log(reason);
            })
        }
        if (geboortedatum !== "") {
            FYSCloud.API.queryDatabase(
                "UPDATE gebruiker_profiel SET geboorte_datum = ? WHERE gebruikerid = ?",
                [geboortedatum, sessionStorage.getItem("userId")]
            ).done(function (data) {
                console.log(data);
            }).fail(function (reason) {
                console.log(reason);
            })
        }
        if (woonplaats !== "") {
            FYSCloud.API.queryDatabase(
                "UPDATE gebruiker_profiel SET woonplaats = ? WHERE gebruikerid = ?",
                [woonplaats, sessionStorage.getItem("userId")]
            ).done(function (data) {
                console.log(data);
            }).fail(function (reason) {
                console.log(reason);
            })
        }
        if (telefoonnr !== "") {
            FYSCloud.API.queryDatabase(
                "UPDATE gebruiker_profiel SET telefoon_nummer = ? WHERE gebruikerid = ?",
                [telefoonnr, sessionStorage.getItem("userId")]
            ).done(function (data) {
                console.log(data);
            }).fail(function (reason) {
                console.log(reason);
            })
        }
        if (bio !== "") {
            FYSCloud.API.queryDatabase(
                "UPDATE gebruiker_profiel SET bio = ? WHERE gebruikerid = ?",
                [bio, sessionStorage.getItem("userId")]
            ).done(function (data) {
                console.log(data);
            }).fail(function (reason) {
                console.log(reason);
            })
        }



        $(".profiel_input").attr("readonly", true);
        document.getElementById("gegevens_bewerken").style.display = "block";
        document.getElementById("gegevens_opslaan").style.display = "none";
        document.getElementById("explorer").style.display = "none";


        // FYSCloud.API.queryDatabase(
        //     "UPDATE gebruiker SET status = 'volledig_profiel' WHERE gebruikerid = ?",
        //     [sessionStorage.getItem("userId")]
        // ).done(function (data) {
        //     console.log(data);
        // }).fail(function (reason) {
        //     console.log(reason);
        // })
    })


});