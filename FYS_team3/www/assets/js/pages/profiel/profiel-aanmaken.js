$(document).ready(function () {
    let userId = sessionStorage.getItem('userId');

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
        var profielcheck = document.getElementById("profilePicture").files.length;

        var id_voornaam = document.getElementById('voornaam');
        var id_achternaam = document.getElementById('achternaam');
        var id_geboorteDatum = document.getElementById('geboortedatum');
        var id_woonplaats = document.getElementById('woonplaats');
        var id_telefoonNummer = document.getElementById('telefoon');
        var id_bio = document.getElementById('bio');

        if (voornaamValid && achternaamValid && geboorteDatumValid && woonplaatsValid && telefoonValid && profielcheck !== 0) {
            var voornaam = id_voornaam.value;
            var achternaam = id_achternaam.value;
            var geslachtValue;
            if (geslachtMan) {
                geslachtValue = "Man";
            } else {
                geslachtValue = "Vrouw";
            }
            var geboorteDatum = id_geboorteDatum.value;
            var woonplaats = id_woonplaats.value;
            var telefoonNummer = id_telefoonNummer.value;
            var bio = id_bio.value;
            var fotoStatus = "geenFoto";

            //(voornaam, achternaam, geboortedatum, woonplaats, telefoonnummeer, bio
            FYSCloud.API.queryDatabase(
                "UPDATE gebruiker SET status = 'volledig_profiel' WHERE gebruikerid = ?",
                [userId]
            ).done(function (data) {
            }).fail(function (reason) {
                console.log(reason);
            })

            FYSCloud.API.queryDatabase(
                "INSERT INTO interesse SET explorer = ?, sportieveling = ?, relaxer = ?, partygoer = ? , wintersport = ?, tropisch = ?, backpacker= ?, resort= ?, idgebruiker = ?",
                [tagExplorer, tagSportieveling, tagRelaxer, tagPartygoer, tagWinterSport, tagTropisch, tagBackpacker, tagResort, sessionStorage.getItem("userId")]
            ).done(function (data) {
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
                            FYSCloud.Utils
                                .getDataUrl($("#profilePicture"))
                                .done(function (data) {
                                    if (data.isImage) {
                                        FYSCloud.API.uploadFile(
                                            userId + ".png",
                                            data.url
                                        ).done(function (data) {
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
            function isValid(id_info, valid, alert) {
                if (!valid) {
                    id_info.style.borderColor = "red";
                    alert.style.display = "block";
                } else {
                    id_info.style.borderColor = "black";
                    alert.style.display = "none";
                }
            }

            let geenFoto = document.getElementById("geenFoto");
            let geenVoornaam = document.getElementById("geenVoornaam");
            let geenAchernaam = document.getElementById("geenAchternaam");
            let geenGeslacht = document.getElementById("geenGeslacht");
            let geenDatum = document.getElementById("geenGeboorteDatum");
            let geenWoonplaats = document.getElementById("geenWoonplaats");
            let geenTelefoon = document.getElementById("geenTelefoon");

            if (profielcheck === 0) {
                document.getElementById("profilePicture").style.backgroundColor = "red";
                geenFoto.style.display = "block";
            } else {
                document.getElementById("profilePicture").style.backgroundColor = "white";
                geenFoto.style.display = "none";
            }
            if (!geslachtMan && !geslachtVrouw) {
                geenGeslacht.style.display = "block";
            } else {
                geenGeslacht.style.display = "none";
            }

            isValid(id_voornaam, voornaamValid, geenVoornaam);
            isValid(id_achternaam, achternaamValid, geenAchernaam);
            isValid(id_geboorteDatum,geboorteDatumValid, geenDatum);
            isValid(id_woonplaats, woonplaatsValid, geenWoonplaats);
            isValid(id_telefoonNummer, telefoonValid, geenTelefoon);
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
        return vandaag
    }

    datum();

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
                });
        });

    });

    $("#profilePicture").on("change", function () {

        FYSCloud.Utils
            .getDataUrl($("#profilePicture"))
            .done(function (data) {
                if (data.isImage) {
                    $("#imagePreview").attr("src", data.url);
                }
            }).fail(function (reason) {
        });
    })

});
