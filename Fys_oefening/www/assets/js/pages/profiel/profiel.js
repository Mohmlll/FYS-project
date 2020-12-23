$(document).ready(function () {
    let userId = sessionStorage.getItem('userId');
    console.log(userId);

    function leeftijdBerekenen(oudeDatum) {
        let datum = new Date(Date.parse(oudeDatum))
        console.log(datum);
        let datumNu = new Date()
        console.log(datumNu);
        let datumVerschil = datumNu.getTime() - datum.getTime() + 3600000;
        console.log(datumVerschil)

        if (datumVerschil < 1000) {
            return 'Nu';
        }
        let sec = Math.floor(datumVerschil / 1000);

        if (sec < 60) {
            return sec + ' seconden geleden';
        }

        let min = Math.floor(sec / 60);
        if (min < 60) {
            return min + ' minuten geleden';
        }

        let uur = Math.floor(min / 60);
        if (uur < 24) {
            return uur + ' uur geleden';
        }

        let dag = Math.floor(uur / 24);
        if (dag < 7) {
            return dag + ' dagen geleden';
        }

        let week = Math.floor(dag / 7);
        if (week < week / 12 * 52.1429) {
            return week + ' week geleden';
        }

        let maand = Math.floor(week / 52.1429 * 12);
        if (maand < 12) {
            return maand + ' maand geleden';
        }

        let jaar = Math.floor(maand / 12);
        if (jaar) {
            return jaar + ' jaar';
        }

        console.log(datumVerschil)
        return datumVerschil
    }

    const profielId = FYSCloud.URL.queryString("id", 0);
    console.log(profielId)
    /////////////////////
    let matchstatus;

    function getMatchstatus() {

        FYSCloud.API.queryDatabase(
            "SELECT  matchstatus, COUNT(*) FROM matches WHERE gebruikerid_twee = ? AND gebruikerid_een = ?",
            [profielId, userId]
        ).done(function (data) {
            console.log(data);
            if (data[0]['COUNT(*)'] === 0) {
                FYSCloud.API.queryDatabase(
                    "SELECT  matchstatus, COUNT(*) FROM matches WHERE gebruikerid_een = ? AND gebruikerid_twee = ?",
                    [profielId, userId]
                ).done(function (data) {
                    console.log(data);
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

    function buttonStatus(matchstatus) {
        if (matchstatus === 2) {
            document.getElementById("contact_verzoek").style.display = "none";
            document.getElementById("verzoek_feedback").style.display = "none";
            document.getElementById("al_gematched").style.display = "block";
        } else if (matchstatus === 1) {
            document.getElementById("contact_verzoek").style.display = "none";
            document.getElementById("al_gematched").style.display = "none";
            document.getElementById("verzoek_feedback").style.display = "block";
        } else if (matchstatus === 0) {
            document.getElementById("contact_verzoek").style.display = "block";
            document.getElementById("al_gematched").style.display = "none";
            document.getElementById("verzoek_feedback").style.display = "none";
        }
    }


    /////////////////////

    FYSCloud.API.queryDatabase(
        "SELECT profiel_foto, voornaam, achternaam, geslacht, DATE (geboorte_datum), woonplaats, telefoon_nummer, interesse, bio FROM gebruiker_profiel WHERE gebruikerid = ?",
        [profielId]
    ).done(function (data) {
        console.log(data)

        let datum = data[0]["DATE (geboorte_datum)"];
        datum = datum.slice(0, 10);
        let leeftijd = leeftijdBerekenen(datum);
        if (profielId !== null) {
            document.getElementById("profielFoto").setAttribute("src", "https://dev-is106-3.fys.cloud/uploads/" + profielId + ".png");
            console.log("src", "https://dev-is106-3.fys.cloud/uploads/" + profielId + ".png");
        }
        let voornaam = data[0]["voornaam"];
        let achternaam = data[0]["achternaam"];
        let geslacht = data[0]["geslacht"];
        let bio = data[0]["bio"];
        let woonplaats = data[0]['woonplaats'];
        let telefoonnr = data[0]['telefoon_nummer'];
        let info = 'Deze gebruiker heeft besloten om deze informatie te verbergen';
        let infoGeenMatch = 'verzoek contact om deze informatie te bekijken';
        document.getElementById("profiel_input_voornaam").setAttribute("placeholder", voornaam);
        document.getElementById("profiel_input_achternaam").setAttribute("placeholder", achternaam);
        document.getElementById("profiel_input_bio").setAttribute("placeholder", bio);
        let textArea = document.getElementById("profiel_input_bio");
        let textCopy = document.getElementById("textCopy");
        document.addEventListener('DOMContentLoaded', () => {
            textArea.addEventListener('change', autosize, false)
            textArea.addEventListener('keydown', autosize, false)
            textArea.addEventListener('keyup', autosize, false)
            autosize()
        }, false)

        function autosize() {
            // Copy textarea contents to div browser will calculate correct height
            // of copy, which will make overall container taller, which will make
            // textarea taller.
            textCopy.innerHTML = textArea.value.replace(/\n/g, '<br/>')
        }

        FYSCloud.API.queryDatabase(
            "SELECT woonplaats, telefoonnr, leeftijd, geslacht, COUNT(*)  FROM privacy WHERE gebruikerid = ?",
            [profielId]
        ).done(function (data) {
            console.log(data);
            if (data[0]['COUNT(*)'] !== 0) {
                let privacyWoonplaats = data[0]['woonplaats'];
                let privacyTelefoonnr = data[0]['telefoonnr'];
                let privacyLeeftijd = data[0]['leeftijd'];
                let privacyGeslacht = data[0]['geslacht'];


                if (privacyWoonplaats === 'Iedereen') {
                    document.getElementById("profiel_input_woonplaats").setAttribute("placeholder", woonplaats);
                } else if (privacyWoonplaats === 'Matches') {
                    if (matchstatus === 2) {
                        document.getElementById("profiel_input_woonplaats").setAttribute("placeholder", woonplaats);
                    } else {
                        document.getElementById("profiel_input_woonplaats").setAttribute("placeholder", infoGeenMatch);
                    }
                } else if (privacyWoonplaats === 'Niemand') {
                    document.getElementById("profiel_input_woonplaats").setAttribute("placeholder", info);
                }
                /////////////////////
                if (privacyTelefoonnr === 'Iedereen') {
                    document.getElementById("profiel_input_telefoonnr").setAttribute("placeholder", telefoonnr);
                } else if (privacyTelefoonnr === 'Matches') {
                    if (matchstatus === 2) {
                        document.getElementById("profiel_input_telefoonnr").setAttribute("placeholder", telefoonnr);
                    } else {
                        document.getElementById("profiel_input_telefoonnr").setAttribute("placeholder", infoGeenMatch);
                    }
                } else if (privacyTelefoonnr === 'Niemand') {
                    document.getElementById("profiel_input_telefoonnr").setAttribute("placeholder", info);
                }
                /////////////////////
                if (privacyGeslacht === 'Iedereen') {
                    document.getElementById("profiel_input_geslacht").setAttribute("placeholder", geslacht);
                } else if (privacyGeslacht === 'Matches') {
                    if (matchstatus === 2) {
                        document.getElementById("profiel_input_geslacht").setAttribute("placeholder", geslacht);
                    } else {
                        document.getElementById("profiel_input_geslacht").setAttribute("placeholder", infoGeenMatch);
                    }
                } else if (privacyGeslacht === 'Niemand') {
                    document.getElementById("profiel_input_geslacht").setAttribute("placeholder", info);
                }
                /////////////////////
                if (privacyLeeftijd === 'Iedereen') {
                    document.getElementById('profiel_input_leeftijd').setAttribute("placeholder", leeftijd);
                } else if (privacyLeeftijd === 'Matches') {
                    if (matchstatus === 2) {
                        document.getElementById("profiel_input_leeftijd").setAttribute("placeholder", leeftijd);
                    } else {
                        document.getElementById("profiel_input_leeftijd").setAttribute("placeholder", infoGeenMatch);
                    }
                } else if (privacyLeeftijd === 'Niemand') {
                    document.getElementById('profiel_input_leeftijd').setAttribute("placeholder", info);
                }
                FYSCloud.API.queryDatabase(
                    "SELECT emailadres FROM gebruiker WHERE gebruikerid = ?",
                    [profielId]
                ).done(function (data) {
                    console.log(data);
                    let emailadres = data[0]['emailadres'];
                    console.log("test" + matchstatus)
                    if (matchstatus === 2) {
                        document.getElementById('profiel_input_email').setAttribute("placeholder", emailadres);
                    } else {
                        document.getElementById("profiel_input_email").setAttribute("placeholder", infoGeenMatch);
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
                document.getElementById('profiel_input_leeftijd').setAttribute("placeholder", info);
                document.getElementById("profiel_input_geslacht").setAttribute("placeholder", geslacht);
                document.getElementById("profiel_input_woonplaats").setAttribute("placeholder", infoGeenMatch);
                document.getElementById("profiel_input_telefoonnr").setAttribute("placeholder", info);
                document.getElementById('profiel_input_email').setAttribute("placeholder", infoGeenMatch);
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
        console.log(data);
        console.log(data[0])
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

    console.log(matchstatus + "WWWWWWWWWOW");
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
                console.log(data)
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
                console.log(data)

            }).fail(function (reason) {
                console.log(reason);
                console.log("fout");
            })
        }
    })
});