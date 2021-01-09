$(document).ready(function () {
    let userId = sessionStorage.getItem('userId');
    console.log(userId);

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

    if (userId !== null) {
        document.getElementById("profielFoto").setAttribute("src", "https://dev-is106-3.fys.cloud/uploads/" + sessionStorage.getItem("userId") + ".png");
        console.log("src", "https://dev-is106-3.fys.cloud/uploads/" + userId + ".png");
    }


    FYSCloud.API.queryDatabase(
        "SELECT profiel_foto, voornaam, achternaam, geslacht, DATE (geboorte_datum), woonplaats, telefoon_nummer, interesse, bio FROM gebruiker_profiel WHERE gebruikerid = ?",
        [userId]
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
        [userId]
    ).done(function (data) {
        console.log(data)
        document.getElementById("profiel_input_email").setAttribute("placeholder", data[0]["emailadres"]);
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
        console.log(data);
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
            console.log(data);
            if (data[0]['COUNT(*)'] === 0) {
                FYSCloud.API.queryDatabase(
                    "INSERT INTO privacy SET gebruikerid = ?, woonplaats = ?, telefoonnr = ?, leeftijd = ?, geslacht = ?",
                    [userId, selWoonplaats, selNr, selLeeftijd, selGeslacht]
                ).done(function (data) {
                    console.log(data);

                }).fail(function (reason) {
                    console.log(reason);
                })
            } else {
                FYSCloud.API.queryDatabase(
                    "UPDATE privacy SET woonplaats = ?, telefoonnr = ?, leeftijd = ?, geslacht = ? WHERE gebruikerid = ?",
                    [selWoonplaats, selNr, selLeeftijd, selGeslacht, userId]
                ).done(function (data) {
                    console.log(data);

                }).fail(function (reason) {
                    console.log(reason);
                    console.log("fout")
                })
            }
        }).fail(function (reason) {
            console.log(reason);
            console.log("fout")
        })

        /*
verwijderen
*/

        if(confirm("weet je zeker dat je profiel verwijdert? Er is geen mogelijkheid om deze actie ongedaan te maken!")) {
            console.log("Verwijdering succesvol!")
        } else {
            console.log("Verwijdering geannuleer, je hoeft niks verder te doen!")
        }

        //FYSCloud.API.queryDatabase(
        //             "DELETE FROM Customers WHERE CustomerName='Alfreds Futterkiste';
        //         ).done(function (data) {



        /*
        if (confirm("Weet je zeker dat
        */
    })

    function openinhoudt(live, live_kopje) {
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
        live.currentTarget.className += " active";
    }

    let tag = "Profiel"
    $("#profiel_tab").on("click", function () {
        tag = "Profiel"
        openinhoudt(event, tag)
    })
    $("#lopend_tab").on("click", function () {
        tag = "Lopende_Matches"
        openinhoudt(event, tag)
    })
    $("#inkomend_tab").on("click", function () {
        tag = "Inkomende_Matches"
        openinhoudt(event, tag)
    })
    $("#uitgaand_tab").on("click", function () {
        tag = "Uitgaande_Matches"
        openinhoudt(event, tag)
    })
    //Open profiel automatisch
    openinhoudt(event, tag)
    // document.getElementById("profiel_tab").style.backgroundColor = "yellow";
    document.getElementById("standaard_Openen").click();

});
