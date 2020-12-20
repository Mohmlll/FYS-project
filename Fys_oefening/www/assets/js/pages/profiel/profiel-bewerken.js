$(document).ready(function () {
    let userId = sessionStorage.getItem('userId');
    FYSCloud.API.queryDatabase(
        "SELECT * FROM interesse WHERE idgebruiker = ?",
        [userId]
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


    $('#gegevens_bewerken').on("click", function (bewerken) {
        bewerken.preventDefault();
        var readonlycheck = document.getElementsByClassName("profiel_input");
        document.getElementById("profiel_input_voornaam").className = "profiel_input_bewerken";
        document.getElementById("profiel_input_achternaam").className = "profiel_input_bewerken";
        document.getElementById("profiel_input_geslacht").className = "profiel_input_bewerken";
        document.getElementById("profiel_input_geboortedatum").className = "profiel_input_bewerken";
        document.getElementById("profiel_input_woonplaats").className = "profiel_input_bewerken";
        document.getElementById("profiel_input_telefoonnr").className = "profiel_input_bewerken";
        document.getElementById("profiel_input_email").className = "profiel_input_bewerken";
        document.getElementById("profiel_input_bio").className = "tekstbox_bewerken";

        document.getElementById("nieuw_wachtwoord").style.display = "block";
        document.getElementById("nieuw_wachtwoordh").style.display = "block";
        if (readonlycheck) {
            $(".profiel_input").attr("readonly", false);
            document.getElementById("gegevens_opslaan").style.display = "block";
            document.getElementById("gegevens_bewerken").style.display = "none";

        }

        $(".tag_div").show();
        $(".tag_button").removeAttr("disabled")


    })

    $("#gegevens_opslaan").on("click", function (opslaan) {
        opslaan.preventDefault();

        var voornaam = document.getElementById("profiel_input_voornaam").value;
        var achternaam = document.getElementById("profiel_input_achternaam").value;
        var geboortedatum = document.getElementById("profiel_input_geboortedatum").value;
        var woonplaats = document.getElementById("profiel_input_woonplaats").value;
        var telefoonnr = document.getElementById("profiel_input_telefoonnr").value;
        var bio = document.getElementById("profiel_input_bio").value;
        var wachtwoord = document.getElementById("profiel_input_wachtwoord").value;
        var wachtwoordh = document.getElementById("profiel_input_wachtwoordh").value;

        if (voornaam !== "") {
            FYSCloud.API.queryDatabase(
                "UPDATE gebruiker_profiel SET voornaam = ? WHERE gebruikerid = ?",
                [voornaam, userId]
            ).done(function (data) {
                console.log(data);
            }).fail(function (reason) {
                console.log(reason);
            })
        }
        if (achternaam !== "") {
            FYSCloud.API.queryDatabase(
                "UPDATE gebruiker_profiel SET achternaam = ? WHERE gebruikerid = ?",
                [achternaam, userId]
            ).done(function (data) {
                console.log(data);
            }).fail(function (reason) {
                console.log(reason);
            })
        }
        if (geboortedatum !== "") {
            FYSCloud.API.queryDatabase(
                "UPDATE gebruiker_profiel SET geboorte_datum = ? WHERE gebruikerid = ?",
                [geboortedatum, userId]
            ).done(function (data) {
                console.log(data);
            }).fail(function (reason) {
                console.log(reason);
            })
        }
        if (woonplaats !== "") {
            FYSCloud.API.queryDatabase(
                "UPDATE gebruiker_profiel SET woonplaats = ? WHERE gebruikerid = ?",
                [woonplaats, userId]
            ).done(function (data) {
                console.log(data);
            }).fail(function (reason) {
                console.log(reason);
            })
        }
        if (telefoonnr !== "") {
            FYSCloud.API.queryDatabase(
                "UPDATE gebruiker_profiel SET telefoon_nummer = ? WHERE gebruikerid = ?",
                [telefoonnr, userId]
            ).done(function (data) {
                console.log(data);
            }).fail(function (reason) {
                console.log(reason);
            })
        }
        if (bio !== "") {
            FYSCloud.API.queryDatabase(
                "UPDATE gebruiker_profiel SET bio = ? WHERE gebruikerid = ?",
                [bio, userId]
            ).done(function (data) {
                console.log(data);
            }).fail(function (reason) {
                console.log(reason);
            })
        }
        if (wachtwoord !== "") {
            FYSCloud.API.queryDatabase(
                "UPDATE gebruiker SET wachtwoord = SHA(?) WHERE gebruikerid = ?",
                [wachtwoord, userId]
            ).done(function (data) {
                console.log(data);
            }).fail(function (reason) {
                console.log(reason);
            })
        }

        var tagExplorer = document.getElementById("tag_explorer").checked;
        var tagSportieveling = document.getElementById("tag_sportieveling").checked;
        var tagRelaxer = document.getElementById("tag_relaxer").checked;
        var tagPartygoer = document.getElementById("tag_partygoer").checked;
        var tagWinterSport = document.getElementById("tag_wintersport").checked;
        var tagTropisch = document.getElementById("tag_tropisch").checked;
        var tagBackpacker = document.getElementById("tag_backpacker").checked;
        var tagResort = document.getElementById("tag_resort").checked;
        FYSCloud.API.queryDatabase(
            "UPDATE interesse SET explorer = ?, sportieveling = ?, relaxer = ?, partygoer = ? , wintersport = ?, tropisch = ?, backpacker= ?, resort= ? WHERE idgebruiker = ?",
            [tagExplorer, tagSportieveling, tagRelaxer, tagPartygoer, tagWinterSport, tagTropisch, tagBackpacker, tagResort, sessionStorage.getItem("userId")]
        ).done(function (data) {
            console.log(data);
            console.log(tagExplorer)
            FYSCloud.API.queryDatabase(
                "SELECT * FROM interesse WHERE idgebruiker = ?",
                [userId]
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
        }).fail(function (reason) {
            console.log(reason);
        })

        $(".profiel_input").attr("readonly", true);
        document.getElementById("gegevens_bewerken").style.display = "block";
        document.getElementById("gegevens_opslaan").style.display = "none";

        document.getElementById("profiel_input_voornaam").className = "profiel_input";
        document.getElementById("profiel_input_achternaam").className = "profiel_input";
        document.getElementById("profiel_input_geslacht").className = "profiel_input";
        document.getElementById("profiel_input_geboortedatum").className = "profiel_input";
        document.getElementById("profiel_input_woonplaats").className = "profiel_input";
        document.getElementById("profiel_input_telefoonnr").className = "profiel_input";
        document.getElementById("profiel_input_email").className = "profiel_input";
        document.getElementById("profiel_input_bio").className = "tekstbox";

        document.getElementById("nieuw_wachtwoord").style.display = "none";
        document.getElementById("nieuw_wachtwoordh").style.display = "none";
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