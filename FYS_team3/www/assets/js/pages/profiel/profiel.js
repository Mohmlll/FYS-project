$(document).ready(function () {
    let userId = sessionStorage.getItem('userId');

    function leeftijdBerekenen(oudeDatum) {
        let datum = new Date(Date.parse(oudeDatum))
        let datumNu = new Date()
        let datumVerschil = datumNu.getTime() - datum.getTime() + 3600000;

        if (datumVerschil < 1000) {
            return 'Nu';
        }

        let sec = datumVerschil / 1000;
        let min = sec / 60;
        let uur = min / 60;
        let dag = uur / 24;
        let week = dag / 7;
        let maand = week / 52.1429 * 12;
        let jaar = maand / 12;
        if (jaar) {
            return Math.floor(jaar) + ' jaar';
        }
        return datumVerschil
    }

    const profielId = FYSCloud.URL.queryString("id", 0);
    /////////////////////
    let matchstatus;
    let matchnummer = 2;

    let verzoek = document.getElementById("contact_verzoek");
    let feedback = document.getElementById("verzoek_feedback");
    let matched = document.getElementById("al_gematched");

    function buttonStatus(matchstatus) {
        if (matchstatus === 2) {
            verzoek.style.display = "none";
            feedback.style.display = "none";
            matched.style.display = "block";
        } else if (matchstatus === 1) {
            verzoek.style.display = "none";
            matched.style.display = "none";
            feedback.style.display = "block";
        } else if (matchstatus === 0) {
            verzoek.style.display = "block";
            matched.style.display = "none";
            feedback.style.display = "none";
        }
    }

    function getMatchstatus() {

        FYSCloud.API.queryDatabase(
            "SELECT  matchstatus, COUNT(*) FROM matches WHERE gebruikerid_twee = ? AND gebruikerid_een = ?",
            [profielId, userId]
        ).done(function (data) {
            if (data[0]['COUNT(*)'] === 0) {
                FYSCloud.API.queryDatabase(
                    "SELECT  matchstatus, COUNT(*) FROM matches WHERE gebruikerid_een = ? AND gebruikerid_twee = ?",
                    [profielId, userId]
                ).done(function (data) {
                    matchstatus = data[0]['matchstatus']
                    buttonStatus(matchstatus);
                }).fail(function (reason) {
                    console.log(reason);
                    console.log("fout");
                })
            } else {
                matchstatus = data[0]['matchstatus'];
                buttonStatus(matchstatus);
            }

        }).fail(function (reason) {
            console.log(reason);
            console.log("fout");
        })
        return matchstatus;
    }

    getMatchstatus();

    let id_voornaam = document.getElementById("profiel_input_voornaam");
    let id_achternaam = document.getElementById("profiel_input_achternaam");
    let id_bio = document.getElementById("profiel_input_bio");
    let id_woonplaats = document.getElementById("profiel_input_woonplaats");
    let id_telefoon = document.getElementById("profiel_input_telefoonnr");
    let id_geslacht = document.getElementById("profiel_input_geslacht");
    let id_leeftijd = document.getElementById('profiel_input_leeftijd');
    let id_email = document.getElementById('profiel_input_email');

    function infoValue(id_info, value) {
        id_info.setAttribute("placeholder", value);
    }

    FYSCloud.API.queryDatabase(
        "SELECT profiel_foto, voornaam, achternaam, geslacht, DATE (geboorte_datum), woonplaats, telefoon_nummer, interesse, bio FROM gebruiker_profiel WHERE gebruikerid = ?",
        [profielId]
    ).done(function (data) {

        let datum = data[0]["DATE (geboorte_datum)"];
        datum = datum.slice(0, 10);
        let leeftijd = leeftijdBerekenen(datum);
        if (profielId !== null) {
            document.getElementById("profielFoto").setAttribute("src", window.location.protocol + "//" + window.location.host + "/uploads/" + profielId + ".png");
        }
        let voornaam = data[0]["voornaam"];
        let achternaam = data[0]["achternaam"];
        let geslacht = data[0]["geslacht"];
        let bio = data[0]["bio"];
        let woonplaats = data[0]['woonplaats'];
        let telefoonnr = data[0]['telefoon_nummer'];
        let info = 'Privé'
        let infoGeenMatch = 'Alleen zichtbaar voor matches';

        infoValue(id_voornaam, voornaam);
        infoValue(id_achternaam, achternaam);
        infoValue(id_bio, bio);

        //de code hieronder tot regel152 zorgt er voor dat de textarea van bio uitgerekt wordt.
        let textArea = document.getElementById("profiel_input_bio");
        let textCopy = document.getElementById("textCopy");
        document.addEventListener('DOMContentLoaded', () => {
            textArea.addEventListener('change', autosize, false)
            textArea.addEventListener('keydown', autosize, false)
            textArea.addEventListener('keyup', autosize, false)
            autosize()
        }, false)

        function autosize() {
            textCopy.innerHTML = textArea.value.replace(/\n/g, '<br/>')
        }

        FYSCloud.API.queryDatabase(
            "SELECT woonplaats, telefoonnr, leeftijd, geslacht, COUNT(*)  FROM privacy WHERE gebruikerid = ?",
            [profielId]
        ).done(function (data) {
            if (data[0]['COUNT(*)'] !== 0) {
                let privacyWoonplaats = data[0]['woonplaats'];
                let privacyTelefoonnr = data[0]['telefoonnr'];
                let privacyLeeftijd = data[0]['leeftijd'];
                let privacyGeslacht = data[0]['geslacht'];

                function privacy(privacyInfo, id_info, value) {
                    if (privacyInfo === 'Iedereen') {
                        infoValue(id_info, value);
                    } else if (privacyInfo === 'Matches') {
                        if (matchstatus === matchnummer) {
                            infoValue(id_info, value);
                        } else {
                            infoValue(id_info, infoGeenMatch);
                        }
                    } else if (privacyInfo === 'Niemand') {
                        infoValue(id_info, info);
                    }
                }

                privacy(privacyWoonplaats, id_woonplaats, woonplaats);
                privacy(privacyTelefoonnr, id_telefoon, telefoonnr);
                privacy(privacyGeslacht, id_geslacht, geslacht);
                privacy(privacyLeeftijd, id_leeftijd, leeftijd);

                FYSCloud.API.queryDatabase(
                    "SELECT emailadres FROM gebruiker WHERE gebruikerid = ?",
                    [profielId]
                ).done(function (data) {
                    let emailadres = data[0]['emailadres'];
                    if (matchstatus === 2) {
                        infoValue(id_email, emailadres);
                        document.getElementById("profiel_email_send").href = "mailto:" + emailadres;
                        id_email.style.cursor = "pointer";
                        $("#profiel_input_email").addClass("email");
                    } else {
                        infoValue(id_email, infoGeenMatch);
                    }
                }).fail(function (reason) {
                    console.log(reason);
                    console.log("fout");
                })
            } else {
                let selWoonplaats = 'Niemand';
                let selNr = "Niemand";
                let selLeeftijd = "Matches";
                let selGeslacht = "Iedereen";

                FYSCloud.API.queryDatabase(
                    "INSERT INTO privacy SET gebruikerid = ?, woonplaats = ?, telefoonnr = ?, leeftijd = ?, geslacht = ?",
                    [userId, selWoonplaats, selNr, selLeeftijd, selGeslacht]
                ).done(function (data) {
                    console.log(data);

                }).fail(function (reason) {
                    console.log(reason);
                })
                infoValue(id_leeftijd, info);
                infoValue(id_geslacht, geslacht);
                infoValue(id_woonplaats, infoGeenMatch);
                infoValue(id_telefoon, info);
                infoValue(id_email, infoGeenMatch);
            }

        }).fail(function (reason) {
            console.log(reason);
            console.log("fout");
        })
    }).fail(function (reason) {
        console.log(reason);
        console.log("fout");
    })

    FYSCloud.API.queryDatabase(
        "SELECT * FROM interesse WHERE idgebruiker = ?",
        [profielId]
    ).done(function (data) {
        $(".tag_div").hide();

        if (data[0]["backpacker"] === 1) {
            document.getElementById("tag_backpacker").checked = true;
            document.getElementById("backpacker").style.display = "block";
        }
        if (data[0]["explorer"] === 1) {
            document.getElementById("tag_explorer").checked = true;
            document.getElementById("explorer").style.display = "block";
        }
        if (data[0]["sportieveling"] === 1) {
            document.getElementById("tag_sportieveling").checked = true;
            document.getElementById("sportieveling").style.display = "block";
        }
        if (data[0]["relaxer"] === 1) {
            document.getElementById("tag_relaxer").checked = true;
            document.getElementById("relaxer").style.display = "block";
        }
        if (data[0]["partygoer"] === 1) {
            document.getElementById("tag_partygoer").checked = true;
            document.getElementById("partygoer").style.display = "block";
        }
        if (data[0]["wintersport"] === 1) {
            document.getElementById("tag_wintersport").checked = true;
            document.getElementById("wintersport").style.display = "block";
        }
        if (data[0]["tropisch"] === 1) {
            document.getElementById("tag_tropisch").checked = true;
            document.getElementById("tropisch").style.display = "block";
        }
        if (data[0]["resort"] === 1) {
            document.getElementById("tag_resort").checked = true;
            document.getElementById("resort").style.display = "block";
        }
    }).fail(function (reason) {
        console.log(reason);
    })

// hier word een contact verzoek verzonden
// de code hier onder is nog niet af want hij maakt nog duplicates
    $("#contact_verzoek").click(function (contact) {
        contact.preventDefault();
        getMatchstatus()
        let matchStatusRequested = 1;
        //de 1 staat voor request in database, dus als de matchstatus 1 is dan is er een request.
        if (matchstatus !== 2 && matchstatus !== 1) {
            FYSCloud.API.queryDatabase(
                "INSERT INTO matches SET gebruikerid_een = ?, gebruikerid_twee = ?, matchstatus = ?",
                [userId, profielId, matchStatusRequested]
            ).done(function (data) {
                document.getElementById("contact_verzoek").style.display = "none";
                document.getElementById("verzoek_feedback").style.display = "block";
            }).fail(function (reason) {
                console.log(reason);
                console.log("fout");
            })
        } else if (matchstatus === 1) {
            FYSCloud.API.queryDatabase(
                "UPDATE matches SET matchstatus = 2 WHERE gebruikerid_een = ? AND gebruikerid_twee = ? ",
                [profielId, userId]
            ).done(function (data) {

            }).fail(function (reason) {
                console.log(reason);
                console.log("fout");
            })
        }
    })
});