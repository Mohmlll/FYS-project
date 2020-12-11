$(document).ready(function () {

    $(".gegevens_opslaan").on("click", function (gegevens) {
        gegevens.preventDefault();

        var telefoonValid = $("#telefoon").is(":valid");
        var voornaamValid = $("#voornaam").is(":valid");
        var achternaamValid = $("#achternaam").is(":valid");
        var geboorteDatumValid = $("#geboortedatum").is(":valid");
        var woonplaatsValid = $("#woonplaats").is(":valid");
        var geslachtMan = document.getElementById("man").checked;
        var geslachtVrouw = document.getElementById("vrouw").checked;
        var tagExplorer = document.getElementById("tag_explorer").checked;
        var tagSportieveling = document.getElementById("tag_sportieveling").checked;
        var tagRelaxer = document.getElementById("tag_relaxer").checked;
        var tagPartygoer = document.getElementById("tag_partygoer").checked;
        var tagWinterSport = document.getElementById("tag_wintersport").checked;
        var tagTropisch = document.getElementById("tag_tropisch").checked;
        var tagBackpacker = document.getElementById("tag_backpacker").checked;
        var tagResort = document.getElementById("tag_resort").checked;
        var profielcheck = document.getElementById("profilePicture").files.length

        if (voornaamValid && achternaamValid && geboorteDatumValid && woonplaatsValid && telefoonValid && profielcheck !== 0) {
            console.log(sessionStorage.getItem("userId"));
            var voornaam = document.getElementById('voornaam').value;
            var achternaam = document.getElementById('achternaam').value;
            var geslachtValue;
            if (geslachtMan) {
                geslachtValue = "Man";
                console.log(geslachtValue);
            } else {
                geslachtValue = "Vrouw";
                console.log(geslachtValue);
            }
            var geboorteDatum = document.getElementById('geboortedatum').value;
            var woonplaats = document.getElementById('woonplaats').value;
            var telefoonNummer = document.getElementById('telefoon').value;
            var bio = document.getElementById('bio').value;
            var fotoStatus = "geenFoto";


            //(voornaam, achternaam, geboortedatum, woonplaats, telefoonnummeer, bio)
            FYSCloud.API.queryDatabase(
                "UPDATE gebruiker SET status = 'volledig_profiel' WHERE gebruikerid = ?",
                [sessionStorage.getItem("userId")]
            ).done(function (data) {
                console.log(data);
            }).fail(function (reason) {
                console.log(reason);
            })

            FYSCloud.API.queryDatabase(
                "INSERT INTO interesse SET explorer = ?, sportieveling = ?, relaxer = ?, partygoer = ? , wintersport = ?, tropisch = ?, backpacker= ?, resort= ?, idgebruiker = ?",
                [tagExplorer, tagSportieveling, tagRelaxer, tagPartygoer, tagWinterSport, tagTropisch, tagBackpacker, tagResort, sessionStorage.getItem("userId")]
            ).done(function (data) {
                console.log(data);
            }).fail(function (reason) {
                console.log(reason);
            })

            FYSCloud.Utils
                .getDataUrl($("#profilePicture"))
                .done(function (data) {
                    if (data.isImage) {
                        fotoStatus = "foto";
                        FYSCloud.API.queryDatabase(
                            "INSERT INTO gebruiker_profiel SET profiel_foto = ?, voornaam = ?, achternaam = ?, geslacht = ?, geboorte_datum = ?, woonplaats = ?, telefoon_nummer = ?, bio = ?, gebruikerid = ?",
                            [fotoStatus, voornaam, achternaam, geslachtValue, geboorteDatum, woonplaats, telefoonNummer, bio, sessionStorage.getItem("userId")]
                        ).done(function (data) {
                            console.log(data);
                            FYSCloud.Utils
                                .getDataUrl($("#profilePicture"))
                                .done(function (data) {
                                    if (data.isImage) {
                                        FYSCloud.API.uploadFile(
                                            sessionStorage.getItem("userId") + ".png",
                                            data.url
                                        ).done(function (data) {
                                            console.log(data);
                                            location.href = "index.html";
                                        }).fail(function (reason) {
                                            console.log(reason);
                                        });
                                    }
                                }).fail(function (reason) {
                                console.log(reason);
                            });

                        }).fail(function (reason) {
                            console.log(reason);
                        })
                    }
                }).fail(function (reason) {
                console.log(reason);
            });

        } else {
            if (profielcheck === 0) {
                document.getElementById("profilePicture").style.backgroundColor = "red";
                document.getElementById("geenFoto").style.display = "block";
            } else {
                document.getElementById("profilePicture").style.backgroundColor = "white";
                document.getElementById("geenFoto").style.display = "none";
            }
            if (!voornaamValid) {
                document.getElementById("voornaam").style.borderColor = "red";
                document.getElementById("geenVoornaam").style.display = "block";
            } else {
                document.getElementById("voornaam").style.borderColor = "black";
                document.getElementById("geenVoornaam").style.display = "none";
            }
            if (!achternaamValid) {
                document.getElementById("achternaam").style.borderColor = "red";
                document.getElementById("geenAchternaam").style.display = "block";
            } else {
                document.getElementById("achternaam").style.borderColor = "black";
                document.getElementById("geenAchternaam").style.display = "none";
            }
            if (!geslachtMan && !geslachtVrouw) {
                document.getElementById("geenGeslacht").style.display = "block";
            } else {
                document.getElementById("geenGeslacht").style.display = "none";
            }
            if (!geboorteDatumValid) {
                document.getElementById("geboortedatum").style.borderColor = "red";
                document.getElementById("geenGeboorteDatum").style.display = "block";
            } else {
                document.getElementById("geboortedatum").style.borderColor = "black";
                document.getElementById("geenGeboorteDatum").style.display = "none";
            }
            if (!woonplaatsValid) {
                document.getElementById("woonplaats").style.borderColor = "red";
                document.getElementById("geenWoonplaats").style.display = "block";
            } else {
                document.getElementById("woonplaats").style.borderColor = "black";
                document.getElementById("geenWoonplaats").style.display = "none";
            }
            if (!telefoonValid) {
                document.getElementById("telefoon").style.borderColor = "red";
                document.getElementById("geenTelefoon").style.display = "block";
            } else {
                document.getElementById("telefoon").style.borderColor = "black";
                document.getElementById("geenTelefoon").style.display = "none";
            }
        }

    })


    function datum() {
        var minimaleLeeftijd = 18;
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
        document.getElementById("geboortedatum").setAttribute("max", vandaag);
        console.log(document.getElementById("geboortedatum").getAttribute("max"));
        return vandaag
    }

    datum();
    console.log(sessionStorage.getItem("userId"));


    $(function () {
        $("#profilePicture").on("change", function () {
            FYSCloud.Utils
                .getDataUrl($(this))
                .done(function (data) {
                    if (data.isImage) {
                        $("#profilePreview").attr("src", data.url);

                        $(".preview").show();
                    }
                })
                .fail(function (reason) {
                    console.log(reason);
                });
        });

    });

    $("#profilePicture").on("change", function (foto) {

        FYSCloud.Utils
            .getDataUrl($("#profilePicture"))
            .done(function (data) {
                if (data.isImage) {
                    $("#imagePreview").attr("src", data.url);
                    console.log("test")
                }
            }).fail(function (reason) {
            console.log(reason);
        });
    })


});
