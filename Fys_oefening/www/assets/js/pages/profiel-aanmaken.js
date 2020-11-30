$(document).ready(function () {
    $(".gegevens_opslaan").on("click", function (gegevens) {
        gegevens.preventDefault();

        var telefoonValid = $("#telefoon").is(":valid");
        var voornaamValid = $("#voornaam").is(":valid");
        var achternaamValid = $("#achternaam").is(":valid");
        var geboorteDatumValid = $("#geboortedatum").is(":valid");
        var woonplaatsValid = $("#woonplaats").is(":valid");
        //var soortVakantieGangerValid = $("#soortVakantieGanger").is(":valid");
        var geslachtMan = document.getElementById("man").checked;
        var geslachtVrouw = document.getElementById("vrouw").checked;

        if (voornaamValid && achternaamValid && geboorteDatumValid && woonplaatsValid && telefoonValid) {
            console.log(sessionStorage.getItem("userId"));
            var voornaam = document.getElementById('voornaam').value;
            var achternaam = document.getElementById('achternaam').value;
            var geslachtValue = document.getElementsByClassName("geslacht").value;
            var geboorteDatum = document.getElementById('geboortedatum').value;
            var woonplaats = document.getElementById('woonplaats').value;
            var telefoonNummer = document.getElementById('telefoon').value;
            var bio = document.getElementById('bio').value;

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
                "INSERT INTO gebruiker_profiel SET voornaam = ?, achternaam = ?, geslacht = ?, geboorte_datum = ?, woonplaats = ?, telefoon_nummer = ?, bio = ?, gebruikerid = ?",
                [voornaam, achternaam, geslachtValue, geboorteDatum, woonplaats, telefoonNummer, bio, sessionStorage.getItem("userId")]
            ).done(function (data) {
                console.log(data);
                location.href = "index.html";
            }).fail(function (reason) {
                console.log(reason);
            })
        } else {
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
            //if (!geslachtValid) {
            //    document.getElementById("").style.borderColor = "red";
            //   document.getElementById("").style.display = "block";
            //} else {
            //    document.getElementById("").style.borderColor = "black";
            //    document.getElementById("").style.display = "none";
            // }
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
        var minimaleLeeftijd = 18
        var vandaag = new Date();
        var dag = vandaag.getDate();
        var maand = vandaag.getMonth() + 1;
        var jaar = vandaag.getFullYear() - minimaleLeeftijd;
        vandaag = jaar + "-" + maand + "-" + dag;
        document.getElementById("geboortedatum").setAttribute("max", vandaag);
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

});
