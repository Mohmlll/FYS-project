$(document).ready(function () {

    let id_gebruikersnaam = document.getElementById("inlogNaam");
    let id_wachtwoord = document.getElementById("inlogWachtwoord");

    let geenGebruikersnaam = document.getElementById("geenInlogNaam");
    let geenWachtwoord = document.getElementById("geenInlogWachtwoord");

    $(".button-box").on("change", function (e) {
        e.preventDefault();
        var toggle = $("#inlogRegistreer").is(":checked");
        var inloggen = document.getElementById("login");
        var registreer = document.getElementById("register");

        if (toggle) {
            inloggen.style.left = "-400px";
            registreer.style.left = "50px";
        } else {
            inloggen.style.left = "50px";
            registreer.style.left = "450px";
        }
    })

    function isValid(id_info, valid, alert) {
        if (!valid) {
            id_info.style.borderColor = "red";
            alert.style.display = "block";
        } else {
            id_info.style.borderColor = "black";
            alert.style.display = "none";
        }
    }

    $(".login_button").on("click", function (gegevens) {
        gegevens.preventDefault();
        var inlogNaamValid = $("#inlogNaam").is(":valid");
        var inlogWachtwoordValid = $("#inlogWachtwoord").is(":valid");

        if (inlogNaamValid && inlogWachtwoordValid) {
            var gebruikersnaam = id_gebruikersnaam.value;
            var wachtwoord = id_wachtwoord.value;


            FYSCloud.API.queryDatabase(
                "SELECT gebruikerid, gebruikers_naam, status, COUNT(*) FROM gebruiker WHERE gebruikers_naam = ? and wachtwoord = SHA(?)",
                [gebruikersnaam, wachtwoord]
            ).done(function (data) {
                sessionStorage.setItem("userId", data[0]["gebruikerid"])
                if (data[0]["COUNT(*)"] === 1 && data[0]["status"] === "volledig_profiel") {
                    location.href = 'forum-homepagina.html';
                } else if (data[0]["COUNT(*)"] === 1 && data[0]["status"] === "geenGegevens") {
                    location.href = 'profiel-aanmaken.html';
                } else {
                    document.getElementById("verkeerdWachtwoord").style.display = "block";
                }
            }).fail(function (reason) {
                console.log(reason);
                console.log("fout");
            })
        } else {
            isValid(id_wachtwoord, inlogWachtwoordValid, geenWachtwoord);
            isValid(id_gebruikersnaam, inlogNaamValid, geenGebruikersnaam)
        }
    })

    function get_action() {
        var v = grecaptcha.getResponse();
        if (v.length === 0) {
            return false;
        } else {
            return true;
        }
    }

    var id_gebuikersNaam = document.getElementById('gebruikersnaam');
    var id_emailAdres = document.getElementById('emailadres');
    var id_wachtwoordr = document.getElementById('wachtwoord');
    var id_wachtwoordCheckr = document.getElementById('wachtwoordCheck');

    var emailBestaat = document.getElementById("bestaandeEmail");
    var naamBestaat = document.getElementById("bestaandeNaam");
    var geenWachtwoordCheck = document.getElementById("geenWachtwoordCheck");
    var geenGebruikersnaamr =  document.getElementById("geenGebruikersNaam");
    var geenWachtwoordr = document.getElementById("geenWachtwoord");
    var geenEmail = document.getElementById("geenEmailAdres");
    
    $(".register_button").on("click", function (gegevens) {
        gegevens.preventDefault();
        var gebruikersnaamValid = $("#gebruikersnaam").is(":valid");
        var emailAdresValid = $("#emailadres").is(":valid");
        var wachtwoordValid = $("#wachtwoord").is(":valid");

        var gebruikersNaam = id_gebuikersNaam.value;
        var emailAdres = id_emailAdres.value;
        var wachtwoord = id_wachtwoordr.value;
        var wachtwoordCheck = id_wachtwoordCheckr.value;
        var status = "geenGegevens";

        if (wachtwoord !== wachtwoordCheck) {
            id_wachtwoordCheckr.style.borderColor = "red";
            geenWachtwoordCheck.style.display = "block";
        } else {
            id_wachtwoordCheckr.style.borderColor = "black";
            geenWachtwoordCheck.style.display = "none";
        }

        FYSCloud.API.queryDatabase(
            "SELECT emailadres, gebruikers_naam FROM gebruiker WHERE emailadres = ? OR gebruikers_naam = ?",
            [emailAdres, gebruikersNaam]
        ).done(function (data) {
            let emailAdresBestaandeValid = true
            let gebruikersnaamBestaandeValid = true
            for (let i = 0; i < data.length; i++) {
                if (data[i]["emailadres"] === emailAdres) {
                    emailAdresBestaandeValid = false;
                    id_emailAdres.style.borderColor = "red";
                    emailBestaat.style.display = "block";
                } else {
                    id_emailAdres.style.borderColor = "black";
                    emailBestaat.style.display = "none";
                }
                if (data[i]["gebruikers_naam"] === gebruikersNaam) {
                    gebruikersnaamBestaandeValid = false
                    id_gebuikersNaam.style.borderColor = "red";
                    naamBestaat.style.display = "block";
                } else {
                    id_gebuikersNaam.style.borderColor = "black";
                    naamBestaat.style.display = "none";
                }
            }
            if (data.length === 0) {
                emailBestaat.style.display = "none";
                naamBestaat.style.display = "none";
            }

            if (gebruikersnaamValid && emailAdresValid && wachtwoordValid
                && emailAdresBestaandeValid && gebruikersnaamBestaandeValid && get_action()) {
                FYSCloud.API.queryDatabase(
                    "INSERT INTO gebruiker( gebruikers_naam, emailadres, wachtwoord, status)" +
                    "VALUES(?,?,SHA(?),?)",
                    [gebruikersNaam, emailAdres, wachtwoord, status]
                ).done(function (data) {
                    sessionStorage.setItem("userId", data.insertId);
                    location.href = "profiel-aanmaken.html";
                }).fail(function (reason) {
                    console.log(reason);
                })
            } else {
                if (get_action()) {
                    document.getElementById('captcha').innerHTML = "Captcha compleet";
                    document.getElementById('captcha').style.color = "black";
                } else {
                    document.getElementById('captcha').innerHTML = "Check de captcha eerst AUB";
                }
                if (!gebruikersnaamValid) {
                    id_gebuikersNaam.style.borderColor = "red";
                    geenGebruikersnaamr.style.display = "block";
                } else if (gebruikersnaamValid && !gebruikersnaamBestaandeValid) {
                    id_gebuikersNaam.style.borderColor = "red";
                    geenGebruikersnaamr.style.display = "none";
                } else {
                    id_gebuikersNaam.style.borderColor = "black";
                    geenGebruikersnaamr.display = "none";
                }
                if (!emailAdresValid) {
                    id_emailAdres.style.borderColor = "red";
                    geenEmail.style.display = "block";
                } else if (emailAdresValid && !emailAdresBestaandeValid) {
                    id_emailAdres.style.borderColor = "red";
                    geenEmail.style.display = "none";
                } else {
                    id_emailAdres.style.borderColor = "black";
                    geenEmail.style.display = "none";
                }
                isValid(id_wachtwoordr, wachtwoordValid, geenWachtwoordr);
            }

        }).fail(function (reason) {
            console.log(reason);
        })


    })


    let gebruikersnaamVergeten = false;
    let wachtwoordVergeten = false;

    function loginVergetenStyle() {
        document.getElementById("vergeten_input").style.display = "block";
        document.getElementById("vergeten_button").style.display = "block";
        document.getElementById("annuleren_button").style.display = "block";
        document.getElementById("inlogNaam").style.display = "none"
        document.getElementById("gebruikersnaam_vergeten").style.display = "none"
        document.getElementById("geenInlogNaam").style.display = "none"
        document.getElementById("inlogWachtwoord").style.display = "none"
        document.getElementById("wachtwoord_vergeten").style.display = "none"
        document.getElementById("geenInlogWachtwoord").style.display = "none"
        document.getElementById("verkeerdWachtwoord").style.display = "none"
        document.getElementById("login_button").style.display = "none"
    }

    $("#wachtwoord_vergeten").on("click", function (wachtwoordVergetenFunctie) {
        wachtwoordVergetenFunctie.preventDefault();
        loginVergetenStyle()
        document.getElementById("wachtwoord_uitleg").style.display = "block"
        gebruikersnaamVergeten = false;
        wachtwoordVergeten = true;
    })

    $("#gebruikersnaam_vergeten").on("click", function (gebruikersnaamVergetenFunctie) {
        gebruikersnaamVergetenFunctie.preventDefault();
        loginVergetenStyle()
        document.getElementById("gebruikersnaam_uitleg").style.display = "block"
        wachtwoordVergeten = false;
        gebruikersnaamVergeten = true;
    })

    function wachtwoordAanmaken() {
        var wachtwoord = "";
        var tekens = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";

        for (let i = 1; i <= 12; i++) {
            var uitgekozen = Math.floor(Math.random()
                * tekens.length + 1);
            wachtwoord += tekens.charAt(uitgekozen)
        }

        return wachtwoord;
    }

    let wachtwoord = wachtwoordAanmaken();
    let subject;
    let subjectInMail1;
    let subjectInMail2;
    let advies;
    let gebruikersnaam;

    function vergetenFunctie(soortVergeten, email, gebruikersnaam, wachtwoordFunction, subject, subjectInMail, subjectInMail2, advies) {

        FYSCloud.API.queryDatabase(
            "SELECT emailadres, voornaam, achternaam, gebruiker.gebruikerid, gebruikers_naam FROM gebruiker " +
            "JOIN gebruiker_profiel ON (gebruiker.gebruikerid = gebruiker_profiel.gebruikerid) WHERE emailadres = ? LIMIT 1",
            [email]
        ).done(function (data) {
            var id = data[0]["gebruikerid"]
            let voornaam = data[0]["voornaam"]
            let achternaam = data[0]["achternaam"]
            gebruikersnaam = data[0]["gebruikers_naam"]
            let gebruikersnaamTekst = "Gebruikersnaam: " + gebruikersnaam
            let wachtwoordTekst = "Wachtwoord: " + wachtwoordFunction
            FYSCloud.API.sendEmail({
                from: {
                    name: "TravelBud",
                    address: "is106-3@fys.cloud"
                },
                to: [
                    {
                        name: voornaam + " " + achternaam,
                        address: email
                    }
                ],
                subject: "Travelbud: " + subject,
                html: "<p>Beste " + voornaam + " " + achternaam + ",</p><p>Het lijkt er op dat er een verzoek is om jou " + subjectInMail1 + " </p><p>Was jij dit niet? Neem dan zo spoedig mogelijk contact op met onze klantenservice!" +
                    " Hierbij jou " + subjectInMail2 + " </p><p>" + gebruikersnaamTekst + "</p><p>" + wachtwoordTekst + "</p>" +
                    "<p>" + advies + "</p><p>Met vriendelijke groet, <br><br> Team Travelbud</p><br><img alt=\"Corendon TravelBud\" src=\"https://cdn.discordapp.com/attachments/748533956877615196/793069791136186368/Logo_website.png\">"
            }).done(function (data) {
                if (soortVergeten === "wachtwoord") {
                    FYSCloud.API.queryDatabase(
                        "UPDATE gebruiker SET wachtwoord = SHA(?) WHERE gebruikerid = ?",
                        [wachtwoord, id]
                    ).done(function (data) {
                    }).fail(function (reason) {
                        console.log(reason);
                    })
                } else if (soortVergeten === "gebruikersnaam") {

                }

            }).fail(function (reason) {
                console.log(reason);
            });
        }).fail(function (reason) {
            console.log(reason);
            console.log("fout");
        })
    }

    function terugInloggen() {
        document.getElementById("vergeten_input").style.display = "none";
        document.getElementById("vergeten_button").style.display = "none";
        document.getElementById("annuleren_button").style.display = "none";
        document.getElementById("inlogNaam").style.display = "block"
        document.getElementById("gebruikersnaam_vergeten").style.display = "block"
        document.getElementById("inlogWachtwoord").style.display = "block"
        document.getElementById("wachtwoord_vergeten").style.display = "block"
        document.getElementById("login_button").style.display = "block"
        document.getElementById("wachtwoord_uitleg").style.display = "none"
        document.getElementById("gebruikersnaam_uitleg").style.display = "none"
        wachtwoordVergeten = false;
        gebruikersnaamVergeten = false;
    }

    $("#vergeten_button").on("click", function (vergeten) {
        vergeten.preventDefault();
        var emailAdres = document.getElementById('vergeten_input').value;
        if (gebruikersnaamVergeten) {
            subject = "Gebruikersnaam vergeten";
            subjectInMail1 = "gebruikersnaam op te vragen.";
            subjectInMail2 = "gebruikersnaam:";
            advies = "";
            vergetenFunctie("gebruikersnaam", emailAdres, gebruikersnaam, "", subject, subjectInMail1, subjectInMail2, advies)
            terugInloggen();
        } else if (wachtwoordVergeten) {
            subject = "Wachtwoord reset";
            subjectInMail1 = "wachtwoord te resetten.";
            subjectInMail2 = "nieuwe wachtwoord:";
            advies = "Wij raden je aan om je eigen wachtwoord aan te maken zodra je bent ingelogd. Dit kan je doen bij het bewerken van je profiel";
            gebruikersnaam = ""
            vergetenFunctie("wachtwoord", emailAdres, gebruikersnaam, wachtwoord, subject, subjectInMail1, subjectInMail2, advies)
            terugInloggen()
        }
    })

    $("#annuleren_button").on("click", function (annuleren) {
        annuleren.preventDefault();
        terugInloggen();
    })
});
