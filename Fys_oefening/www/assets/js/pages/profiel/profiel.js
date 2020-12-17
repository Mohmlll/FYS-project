$(document).ready(function () {
    let userId = sessionStorage.getItem('userId');
    console.log(userId);


    const profielId = FYSCloud.URL.queryString("id", 0);
    FYSCloud.API.queryDatabase(
        "SELECT profiel_foto, voornaam, achternaam, geslacht, DATE (geboorte_datum), woonplaats, telefoon_nummer, interesse, bio FROM gebruiker_profiel WHERE gebruikerid = ?",
        [profielId]
    ).done(function (data) {
        console.log(data)

        let datum = data[0]["DATE (geboorte_datum)"];
        datum = datum.slice(0, 10);
        if (profielId !== null) {
            document.getElementById("profielFoto").setAttribute("src", "https://dev-is106-3.fys.cloud/uploads/" + profielId + ".png");
            console.log("src", "https://dev-is106-3.fys.cloud/uploads/" + profielId + ".png");
        }

        document.getElementById("profiel_input_voornaam").setAttribute("placeholder", data[0]["voornaam"]);
        document.getElementById("profiel_input_achternaam").setAttribute("placeholder", data[0]["achternaam"]);
        document.getElementById("profiel_input_geslacht").setAttribute("placeholder", data[0]["geslacht"]);

        let woonplaats = data[0]["woonplaats"];
        let telefoonnr = data[0]["telefoon_nummer"];
        FYSCloud.API.queryDatabase(
            "SELECT emailadres FROM gebruiker WHERE gebruikerid = ?",
        [profielId]
        ).done(function (data){
            console.log(data);
            let emailadres = data[0]['emailadres'];

            FYSCloud.API.queryDatabase(
                "SELECT  matchstatus FROM matches WHERE gebruikerid_twee = ? ",
                [profielId]
            ).done(function (data) {
                console.log(data);
                if(data.length === 0){
                    FYSCloud.API.queryDatabase(
                        "SELECT  matchstatus FROM matches WHERE gebruikerid_een = ? ",
                        [profielId]
                    ).done(function (data) {
                        console.log(data);
                        let matchStatus = data[0]['matchstatus'];
                        if (matchStatus === 2 ){
                            document.getElementById("profiel_input_woonplaats").setAttribute("placeholder", woonplaats);
                            document.getElementById("profiel_input_telefoonnr").setAttribute("placeholder", telefoonnr);
                            document.getElementById("profiel_input_email").setAttribute("placeholder", emailadres);
                        }
                    }).fail(function (data) {
                        console.log(data);
                        console.log("fout")
                    })
                }
                else if (data[0]['matchstatus'] === 2 ){
                    document.getElementById("profiel_input_woonplaats").setAttribute("placeholder", woonplaats);
                    document.getElementById("profiel_input_telefoonnr").setAttribute("placeholder", telefoonnr);
                    document.getElementById("profiel_input_email").setAttribute("placeholder", emailadres);
                }
            }).fail(function (data) {
                console.log(data);
                console.log("fout")
            })

        }).fail(function (reason){
            console.log(reason);
            console.log("fout")
        })


        document.getElementById("profiel_input_bio").setAttribute("placeholder", data[0]["bio"]);
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

    FYSCloud.API.queryDatabase(
        "SELECT matchstatus FROM matches WHERE gebruikerid_een = ? AND gebruikerid_twee = ? ",
        [userId, profielId]
    ).done(function (data) {
        console.log(data);
        if (data.length === 0) {
            FYSCloud.API.queryDatabase(
                "SELECT matchstatus FROM matches WHERE gebruikerid_een = ? AND gebruikerid_twee = ? ",
                [profielId, userId]
            ).done(function (data) {
                console.log(data);
                if (data.length === 0) {
                    console.log("nog geen verzoek")
                } else  if (data[0]['matchstatus'] === 2) {
                    document.getElementById("contact_verzoek").style.display = "none";
                    document.getElementById("verzoek_feedback").style.display = "none";
                    document.getElementById("al_gematched").style.display = "block";
                }
            }).fail(function (reason) {
                console.log(reason);
                console.log("fout")
            })
        } else if (data[0]['matchstatus'] === 1) {
            document.getElementById("contact_verzoek").style.display = "none";
            document.getElementById("al_gematched").style.display = "none";
            document.getElementById("verzoek_feedback").style.display = "block";
        } else  if (data[0]['matchstatus'] === 2) {
            document.getElementById("contact_verzoek").style.display = "none";
            document.getElementById("verzoek_feedback").style.display = "none";
            document.getElementById("al_gematched").style.display = "block";
        }
    }).fail(function (reason) {
        console.log(reason);
        console.log("fout")
    })
// hier word een contact verzoek verzonden
// de code hier onder is nog niet af want hij maakt nog duplicates
    $("#contact_verzoek").click(function (contact) {
        contact.preventDefault();
        console.log("test");
        //de 1 staat voor request in database, dus als de matchstatus 1 is dan is er een request.
        let matchStatusRequested = 1;
        FYSCloud.API.queryDatabase(
            "SELECT matchstatus FROM matches WHERE gebruikerid_een = ? AND gebruikerid_twee = ? ",
            [userId, profielId]
        ).done(function (data) {
            console.log(data);
            if (data.length === 0) {

                FYSCloud.API.queryDatabase(
                    "SELECT matchstatus FROM matches WHERE gebruikerid_een = ? AND gebruikerid_twee = ? ",
                    [profielId, userId]
                ).done(function (data) {
                    console.log(data);
                    if (data.length === 0) {
                        FYSCloud.API.queryDatabase(
                            "INSERT INTO matches SET gebruikerid_een = ?, gebruikerid_twee=?, matchstatus=?",
                            [userId, profielId, matchStatusRequested]
                        ).done(function (data) {
                            console.log(data)
                            document.getElementById("contact_verzoek").style.display = "none";
                            document.getElementById("verzoek_feedback").style.display = "block";
                        }).fail(function (reason) {
                            console.log(reason);
                            console.log("fout");
                        })
                    } else if (data[0]["matchstatus"] === 1) {
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
                }).fail(function (reason) {
                    console.log(reason);
                    console.log("fout");
                })

            } else if (data[0]['matchstatus'] !== 1) {
                FYSCloud.API.queryDatabase(
                    "INSERT INTO matches SET gebruikerid_een = ?, gebruikerid_twee=?, matchstatus=?",
                    [userId, profielId, matchStatusRequested]
                ).done(function (data) {
                    console.log(data)
                    document.getElementById("contact_verzoek").style.display = "none";
                }).fail(function (reason) {
                    console.log(reason);
                    console.log("fout");
                })
            } else {
                console.log("duplicate verzoek")
            }
        }).fail(function (reason) {
            console.log(reason);
            console.log("fout");
        })

    })

});