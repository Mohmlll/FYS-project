$(document).ready(function () {
    let userId = sessionStorage.getItem('userId');

    function selectedTags(data) {
        $(".tag_div").hide();
        if (data["backpacker"] === 1) {
            document.getElementById("tag_backpacker").checked = true;
            document.getElementById("backpacker").style.display = "block";
        }
        if (data["explorer"] === 1) {
            document.getElementById("tag_explorer").checked = true;
            document.getElementById("explorer").style.display = "block";
        }
        if (data["sportieveling"] === 1) {
            document.getElementById("tag_sportieveling").checked = true;
            document.getElementById("sportieveling").style.display = "block";
        }
        if (data["relaxer"] === 1) {
            document.getElementById("tag_relaxer").checked = true;
            document.getElementById("relaxer").style.display = "block";
        }
        if (data["partygoer"] === 1) {
            document.getElementById("tag_partygoer").checked = true;
            document.getElementById("partygoer").style.display = "block";
        }
        if (data["wintersport"] === 1) {
            document.getElementById("tag_wintersport").checked = true;
            document.getElementById("wintersport").style.display = "block";
        }
        if (data["tropisch"] === 1) {
            document.getElementById("tag_tropisch").checked = true;
            document.getElementById("tropisch").style.display = "block";
        }
        if (data["resort"] === 1) {
            document.getElementById("tag_resort").checked = true;
            document.getElementById("resort").style.display = "block";
        }
    }

    FYSCloud.API.queryDatabase(
        "SELECT * FROM interesse WHERE idgebruiker = ?",
        [userId]
    ).done(function (data) {
        selectedTags(data[0])
    }).fail(function (reason) {
        console.log(reason);
    })


    $('#gegevens_bewerken').on("click", function (bewerken) {
        bewerken.preventDefault();
        var readonlycheck = document.getElementsByClassName("profiel_input");
        if (readonlycheck) {
            $(".profiel_input").attr("readonly", false);
            document.getElementById("gegevens_opslaan").style.display = "block";
            document.getElementById("gegevens_bewerken").style.display = "none";
        }
        document.getElementById("profiel_input_voornaam").className = "profiel_input_bewerken";
        document.getElementById("profiel_input_achternaam").className = "profiel_input_bewerken";
        document.getElementById("profiel_input_woonplaats").className = "profiel_input_bewerken";
        document.getElementById("profiel_input_telefoonnr").className = "profiel_input_bewerken";
        document.getElementById("profiel_input_email").className = "profiel_input_bewerken";
        document.getElementById("profiel_input_bio").className = "profiel_input_bewerken";

        document.getElementById("nieuw_wachtwoord").style.display = "block";
        document.getElementById("nieuw_wachtwoordh").style.display = "block";
        document.getElementById("nieuw_wachtwoord_tekst").style.display = "block";
        document.getElementById("nieuw_wachtwoordh_tekst").style.display = "block";
        document.getElementById("profielfoto_wijzigen_div").style.display = "block";
        $(".tag_div").show();
        $(".tag_button").removeAttr("disabled")


    })

    function tagUpdate(updateSoort, varNaam) {
        FYSCloud.API.queryDatabase(
            "UPDATE gebruiker_profiel SET " + updateSoort + " = ? WHERE gebruikerid = ?",
            [varNaam, userId]
        ).done(function (data) {
        }).fail(function (reason) {
            console.log(reason);
        })
    }

    $("#gegevens_opslaan").on("click", function (opslaan) {
        opslaan.preventDefault();
        let voornaamValid = $("#profiel_input_voornaam").is(':valid');
        let achternaamValid = $("#profiel_input_achternaam").is(':valid');
        let woonplaatsValid = $("#profiel_input_woonplaats").is(':valid');
        let emailValid = $("#profiel_input_email").is(':valid');
        let telefoonValid = $("#profiel_input_telefoonnr").is(':valid');
        var wachtwoordValid = $("#profiel_input_wachtwoord").is(":valid");
        var wachtwoordCheckValid = $("#profiel_input_wachtwoordh").is(":valid");

        var voornaam = document.getElementById("profiel_input_voornaam").value;
        var achternaam = document.getElementById("profiel_input_achternaam").value;
        var woonplaats = document.getElementById("profiel_input_woonplaats").value;
        var telefoonnr = document.getElementById("profiel_input_telefoonnr").value;
        var bio = document.getElementById("profiel_input_bio").value;
        var wachtwoord = document.getElementById("profiel_input_wachtwoord").value;
        var wachtwoordh = document.getElementById("profiel_input_wachtwoordh").value;

        if (wachtwoord !== wachtwoordh) {
            document.getElementById("profiel_input_wachtwoordh").style.borderColor = "red";
            document.getElementById("geenWachtwoordCheckp").style.display = "block";
        } else {
            document.getElementById("profiel_input_wachtwoordh").style.borderColor = "black";
            document.getElementById("geenWachtwoordCheckp").style.display = "none";
        }
        if (!wachtwoordValid) {
            document.getElementById("profiel_input_wachtwoord").style.borderColor = "red";
            document.getElementById("geenWachtwoordp").style.display = "block";
        } else {
            document.getElementById("profiel_input_wachtwoord").style.borderColor = "black";
            document.getElementById("geenWachtwoordp").style.display = "none";
        }
        if (!voornaamValid) {
            document.getElementById("profiel_input_voornaam").style.borderColor = "red";
            document.getElementById("geenVoornaam").style.display = "block";
        } else {
            document.getElementById("profiel_input_voornaam").style.borderColor = "black";
            document.getElementById("geenVoornaam").style.display = "none";
        }
        if (!achternaamValid) {
            document.getElementById("profiel_input_achternaam").style.borderColor = "red";
            document.getElementById("geenAchternaam").style.display = "block";
        } else {
            document.getElementById("profiel_input_achternaam").style.borderColor = "black";
            document.getElementById("geenAchternaam").style.display = "none";
        }
        if (!woonplaatsValid) {
            document.getElementById("profiel_input_woonplaats").style.borderColor = "red";
            document.getElementById("geenWoonplaats").style.display = "block";
        } else {
            document.getElementById("profiel_input_woonplaats").style.borderColor = "black";
            document.getElementById("geenWoonplaats").style.display = "none";
        }

        if (!telefoonValid) {
            document.getElementById("profiel_input_telefoonnr").style.borderColor = "red";
            document.getElementById("geenTelefoon").style.display = "block";
        } else {
            document.getElementById("profiel_input_telefoonnr").style.borderColor = "black";
            document.getElementById("geenTelefoon").style.display = "none";
        }
        if (!emailValid) {
            document.getElementById("profiel_input_email").style.borderColor = "red";
            document.getElementById("geenEmailAdres").style.display = "block";
        } else {
            document.getElementById("profiel_input_email").style.borderColor = "black";
            document.getElementById("geenEmailAdres").style.display = "none";
        }
        if (wachtwoordValid && wachtwoordCheckValid && voornaamValid && achternaamValid && woonplaatsValid && emailValid && telefoonValid) {


            if (voornaam !== "") {
                tagUpdate("voornaam", voornaam);
            }
            if (achternaam !== "") {
                tagUpdate("achternaam", achternaam)
            }
            if (woonplaats !== "") {
                tagUpdate("woonplaats", woonplaats)
            }
            if (telefoonnr !== "") {
                tagUpdate("telefoon_nummer", telefoonnr)
            }
            if (bio !== "") {
                tagUpdate("bio", bio)
            }
            if (wachtwoord !== "") {
                FYSCloud.API.queryDatabase(
                    "UPDATE gebruiker SET wachtwoord = SHA(?) WHERE gebruikerid = ?",
                    [wachtwoord, userId]
                ).done(function (data) {
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
                FYSCloud.API.queryDatabase(
                    "SELECT * FROM interesse WHERE idgebruiker = ?",
                    [userId]
                ).done(function (data) {
                    selectedTags(data[0])
                }).fail(function (reason) {
                    console.log(reason);
                })
            }).fail(function (reason) {
                console.log(reason);
            })
            document.getElementById("gegevens_bewerken").style.display = "block";
            document.getElementById("gegevens_opslaan").style.display = "none";

            document.getElementById("profiel_input_voornaam").className = "profiel_input";
            document.getElementById("profiel_input_achternaam").className = "profiel_input";
            document.getElementById("profiel_input_woonplaats").className = "profiel_input";
            document.getElementById("profiel_input_telefoonnr").className = "profiel_input";
            document.getElementById("profiel_input_email").className = "profiel_input";
            document.getElementById("profiel_input_bio").className = "tekstbox";

            document.getElementById("nieuw_wachtwoord").style.display = "none";
            document.getElementById("nieuw_wachtwoordh").style.display = "none";
            document.getElementById("nieuw_wachtwoord_tekst").style.display = "none";
            document.getElementById("nieuw_wachtwoordh_tekst").style.display = "none";
            document.getElementById("profielfoto_wijzigen_div").style.display = "none";
            $(".profiel_input").attr("readonly", true);
        }
    })

    $("#profielfoto_wijzigen").on("change", function () {
        FYSCloud.Utils
            .getDataUrl($("#profielfoto_wijzigen"))
            .done(function (data) {
                if (data.isImage) {
                    FYSCloud.API.deleteFile(
                        userId + ".png"
                    ).done(function (data) {

                        FYSCloud.Utils
                            .getDataUrl($("#profielfoto_wijzigen"))
                            .done(function (data) {
                                if (data.isImage) {
                                    FYSCloud.API.uploadFile(
                                        userId + ".png",
                                        data.url
                                    ).done(function (data) {
                                        document.getElementById("profielFoto").setAttribute("src", window.location.protocol + "//" + window.location.host + "/uploads/" + userId + ".png");
                                    }).fail(function (reason) {
                                        console.log(reason);
                                    });
                                }
                            }).fail(function (reason) {
                            console.log(reason);
                        })
                    }).fail(function (reason) {
                        console.log(reason)
                    });

                }
            }).fail(function (reason) {
            console.log(reason);
        });
    })


});