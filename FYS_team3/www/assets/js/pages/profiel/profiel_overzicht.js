$(document).ready(function () {
    let userId = sessionStorage.getItem('userId');

    var id_voornaam = document.getElementById("profiel_input_voornaam");
    var id_achternaam = document.getElementById("profiel_input_achternaam");
    var id_woonplaats = document.getElementById("profiel_input_woonplaats");
    var id_telefoonnr = document.getElementById("profiel_input_telefoonnr");
    var id_bio = document.getElementById("profiel_input_bio");
    let id_geslacht = document.getElementById("profiel_input_geslacht");
    let id_geboortedatum = document.getElementById("profiel_input_geboortedatum");
    let id_email = document.getElementById("profiel_input_email");

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
        return vandaag
    }

    if (userId !== null) {
        document.getElementById("profielFoto").setAttribute("src", window.location.protocol + "//" + window.location.host + "/uploads/" + userId + ".png");
    }


    FYSCloud.API.queryDatabase(
        "SELECT profiel_foto, voornaam, achternaam, geslacht, DATE (geboorte_datum), woonplaats, telefoon_nummer, interesse, bio FROM gebruiker_profiel WHERE gebruikerid = ?",
        [userId]
    ).done(function (data) {
        let datum = data[0]["DATE (geboorte_datum)"];
        datum = datum.slice(0, 10);
        id_voornaam.setAttribute("placeholder", data[0]["voornaam"]);
        id_achternaam.setAttribute("placeholder", data[0]["achternaam"]);
        id_geslacht.setAttribute("placeholder", data[0]["geslacht"]);
        id_geboortedatum.setAttribute("placeholder", datum);
        id_woonplaats.setAttribute("placeholder", data[0]["woonplaats"]);
        id_telefoonnr.setAttribute("placeholder", data[0]["telefoon_nummer"]);
        id_bio.setAttribute("placeholder", data[0]["bio"]);
        $('#gegevens_bewerken').on("click", function (bewerken) {
            bewerken.preventDefault();
            id_geboortedatum.setAttribute("type", "date");
            date();
        })
        $("#gegevens_opslaan").on("click", function (opslaan) {
            opslaan.preventDefault();
            id_geboortedatum.setAttribute("type", "text");
            id_geboortedatum.setAttribute("placeholder", datum);

        })
    }).fail(function (reason) {
        console.log(reason);
        console.log("fout");
    })
    FYSCloud.API.queryDatabase(
        "SELECT emailadres FROM gebruiker WHERE gebruikerid = ?",
        [userId]
    ).done(function (data) {
        id_email.setAttribute("placeholder", data[0]["emailadres"]);
    }).fail(function (reason) {
        console.log(reason);
        console.log("fout");
    })

    /*
privacy
 */

    FYSCloud.API.queryDatabase(
        "SELECT woonplaats, telefoonnr, leeftijd, geslacht FROM privacy WHERE gebruikerid = ?",
        [userId]
    ).done(function (data) {
        if (data.length !== 0) {
            switch (data[0]['woonplaats']) {
                case 'Iedereen':
                    document.getElementById("woonplaats_iedereen").selected = true;
                    break;
                case 'Niemand':
                    document.getElementById("woonplaats_niemand").selected = true;
                    break;
                case 'Matches':
                    document.getElementById("woonplaats_matches").selected = true;
                    break;
            }
            switch (data[0]['telefoonnr']) {
                case 'Iedereen':
                    document.getElementById("nr_iedereen").selected = true;
                    break;
                case 'Niemand':
                    document.getElementById("nr_niemand").selected = true;
                    break;
                case 'Matches':
                    document.getElementById("nr_matches").selected = true;
                    break;
            }
            switch (data[0]['leeftijd']) {
                case 'Iedereen':
                    document.getElementById("leeftijd_iedereen").selected = true;
                    break;
                case 'Niemand':
                    document.getElementById("leeftijd_niemand").selected = true;
                    break;
                case 'Matches':
                    document.getElementById("leeftijd_matches").selected = true;
                    break;
            }
            switch (data[0]['geslacht']) {
                case 'Iedereen':
                    document.getElementById("geslacht_iedereen").selected = true;
                    break;
                case 'Niemand':
                    document.getElementById("geslacht_niemand").selected = true;
                    break;
                case 'Matches':
                    document.getElementById("geslacht_matches").selected = true;
                    break;
            }
        }

    }).fail(function (reason) {
        console.log(reason);
        console.log("fout")
    })

    $('.privacy_opslaan').on('click', function (privacy) {
        privacy.preventDefault();
        let selWoonplaats = document.getElementById('privacy_woonplaats').value;
        let selNr = document.getElementById('privacy_nr').value;
        let selLeeftijd = document.getElementById('privacy_leeftijd').value;
        let selGeslacht = document.getElementById('privacy_geslacht').value;


        FYSCloud.API.queryDatabase(
            "SELECT COUNT(*) FROM privacy WHERE gebruikerid = ?",
            [userId]
        ).done(function (data) {
            if (data[0]['COUNT(*)'] === 0) {
                FYSCloud.API.queryDatabase(
                    "INSERT INTO privacy SET gebruikerid = ?, woonplaats = ?, telefoonnr = ?, leeftijd = ?, geslacht = ?",
                    [userId, selWoonplaats, selNr, selLeeftijd, selGeslacht]
                ).done(function (data) {
                }).fail(function (reason) {
                    console.log(reason);
                })
            } else {
                FYSCloud.API.queryDatabase(
                    "UPDATE privacy SET woonplaats = ?, telefoonnr = ?, leeftijd = ?, geslacht = ? WHERE gebruikerid = ?",
                    [selWoonplaats, selNr, selLeeftijd, selGeslacht, userId]
                ).done(function (data) {

                }).fail(function (reason) {
                    console.log(reason);
                    console.log("fout")
                })
            }
        }).fail(function (reason) {
            console.log(reason);
            console.log("fout")
        })
    })

    function openinhoudt(live, live_kopje, target) {
        // Declare all variables
        var i, tabcontent, tablinks;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(live_kopje).style.display = "block";
        if (target === null) {
            var tag = document.getElementById("profiel_tab");
            tag.className += " active"
        } else {
            live.currentTarget.className += " active";
        }
    }

    let tag = "Profiel"
    let target = null;
    $("#profiel_tab").on("click", function () {
        tag = "Profiel"
        openinhoudt(event, tag, target)
    })
    $("#lopend_tab").on("click", function () {
        tag = "Lopende_Matches"
        openinhoudt(event, tag, target)
    })
    $("#inkomend_tab").on("click", function () {
        tag = "Inkomende_Matches"
        openinhoudt(event, tag, target)
    })
    $("#uitgaand_tab").on("click", function () {
        tag = "Uitgaande_Matches"
        openinhoudt(event, tag, target)
    })
    //Open profiel automatisch
    openinhoudt(event, tag, target)
    target = ""

    $(".gegevens_verwijderen").on("click", function () {
        let bevestigen = confirm("Wilt u uw account verwijderen?")
        if (bevestigen) {
            FYSCloud.API.queryDatabase(
                "DELETE FROM gebruiker WHERE gebruikerid = ? ",
                [userId]
            ).done(function (data) {
                sessionStorage.clear()
                location.href = "index.html"
            }).fail(function (reason) {
                console.log(reason);
            });
        }
    });
});
