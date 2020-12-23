$(document).ready(function () {
    let userId = sessionStorage.getItem('userId');


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
    $(".login_button").on("click", function (gegevens) {
        gegevens.preventDefault();
        var inlogNaamValid = $("#inlogNaam").is(":valid");
        var inlogWachtwoordValid = $("#inlogWachtwoord").is(":valid");

        if (inlogNaamValid && inlogWachtwoordValid) {
            var gebruikersnaam = document.getElementById("inlogNaam").value;
            var wachtwoord = document.getElementById("inlogWachtwoord").value;


            FYSCloud.API.queryDatabase(
                "SELECT gebruikerid, gebruikers_naam, status, COUNT(*) FROM gebruiker WHERE gebruikers_naam = ? and wachtwoord = SHA(?)",
                [gebruikersnaam, wachtwoord]
            ).done(function (data) {
                console.log(data);
                sessionStorage.setItem("userId", data[0]["gebruikerid"])
                if (data[0]["COUNT(*)"] === 1 && data[0]["status"] === "volledig_profiel") {
                    console.log(data[0]["gebruikerid"])
                    console.log(data[0]["gebruikers_naam"])
                    location.href = 'forum-homepagina.html';
                } else if (data[0]["COUNT(*)"] === 1 && data[0]["status"] === "geenGegevens") {
                    console.log(data[0]["gebruikerid"])
                    console.log(data[0]["gebruikers_naam"])
                    console.log("geen gegevens")
                    location.href = 'profiel-aanmaken.html';
                } else {
                    document.getElementById("verkeerdWachtwoord").style.display = "block";
                }
            }).fail(function (reason) {
                console.log(reason);
                console.log("fout");
            })
        } else {
            if (!inlogNaamValid) {
                document.getElementById("inlogNaam").style.borderColor = "red";
                document.getElementById("geenInlogNaam").style.display = "block";
            } else {
                document.getElementById("inlogNaam").style.borderColor = "black";
                document.getElementById("geenInlogNaam").style.display = "none";
            }
            if (!inlogWachtwoordValid) {
                document.getElementById("inlogWachtwoord").style.borderColor = "red";
                document.getElementById("geenInlogWachtwoord").style.display = "block";
            } else {
                document.getElementById("inlogWachtwoord").style.borderColor = "black";
                document.getElementById("geenInlogWachtwoord").style.display = "none";
            }
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

    $(".register_button").on("click", function (gegevens) {
        gegevens.preventDefault();
        var gebruikersnaamValid = $("#gebruikersnaam").is(":valid");
        var emailAdresValid = $("#emailadres").is(":valid");
        var wachtwoordValid = $("#wachtwoord").is(":valid");

        var voorwaardeCheckValid = $("#voorwaardeCheck").is(":valid");

        var gebruikersNaam = document.getElementById('gebruikersnaam').value;
        var emailAdres = document.getElementById('emailadres').value;
        var wachtwoord = document.getElementById('wachtwoord').value;
        var wachtwoordCheck = document.getElementById('wachtwoordCheck').value;
        var status = "geen gegevens";
        if (wachtwoord !== wachtwoordCheck) {
            document.getElementById("wachtwoordCheck").style.borderColor = "red";
            document.getElementById("geenWachtwoordCheck").style.display = "block";
        } else {
            document.getElementById("wachtwoordCheck").style.borderColor = "black";
            document.getElementById("geenWachtwoordCheck").style.display = "none";
        }

        if (gebruikersnaamValid && emailAdresValid && wachtwoordValid && voorwaardeCheckValid && get_action()) {
            FYSCloud.API.queryDatabase(
                "INSERT INTO gebruiker( gebruikers_naam, emailadres, wachtwoord, status)" +
                "VALUES(?,?,SHA(?),?)",
                [gebruikersNaam, emailAdres, wachtwoord, status]
            ).done(function (data) {
                console.log(data);
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
                document.getElementById("gebruikersnaam").style.borderColor = "red";
                document.getElementById("geenGebruikersNaam").style.display = "block";
            } else {
                document.getElementById("gebruikersnaam").style.borderColor = "black";
                document.getElementById("geenGebruikersNaam").style.display = "none";
            }
            if (!emailAdresValid) {
                document.getElementById("emailadres").style.borderColor = "red";
                document.getElementById("geenEmailAdres").style.display = "block";
            } else {
                document.getElementById("emailadres").style.borderColor = "black";
                document.getElementById("geenEmailAdres").style.display = "none";
            }
            if (!wachtwoordValid) {
                document.getElementById("wachtwoord").style.borderColor = "red";
                document.getElementById("geenWachtwoord").style.display = "block";
            } else {
                document.getElementById("wachtwoord").style.borderColor = "black";
                document.getElementById("geenWachtwoord").style.display = "none";
            }
            if (!voorwaardeCheckValid) {
                document.getElementById("voorwaardeCheck").style.borderColor = "red";
                document.getElementById("geenVoorwaardeCheck").style.display = "block";
            } else {
                document.getElementById("voorwaardeCheck").style.borderColor = "black";
                document.getElementById("geenVoorwaardeCheck").style.display = "none";
            }
        }
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
        document.getElementById("gegevens_herinneren").style.display = "none"
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

    function vergetenFunctie(soortVergeten, email, wachtwoordFunction) {

        FYSCloud.API.queryDatabase(
            "SELECT emailadres, voornaam, achternaam, gebruiker.gebruikerid, gebruikers_naam FROM gebruiker " +
            "JOIN gebruiker_profiel ON (gebruiker.gebruikerid = gebruiker_profiel.gebruikerid) WHERE emailadres = ? LIMIT 1",
            [email]
        ).done(function (data) {
            console.log(data);
            var id = data[0]["gebruikerid"]
            let voornaam = data[0]["voornaam"]
            let achternaam = data[0]["achternaam"]
            var gebruikersnaam = data[0]["gebruikers_naam"]
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
                subject: "Just a test!",
                html: "<h1>Hallo</h1><p>This is an email :)</p>" + gebruikersnaam + "<br>" + wachtwoordFunction + "<br>"
            }).done(function (data) {
                console.log(data);
                console.log("De e-mail is verstuurd")
                if (soortVergeten === "wachtwoord") {
                    FYSCloud.API.queryDatabase(
                        "UPDATE gebruiker SET wachtwoord = SHA(?) WHERE gebruikerid = ?",
                        [wachtwoord, id]
                    ).done(function (data) {
                        console.log(data);
                        console.log("wachtwoord verstuurd ")
                    }).fail(function (reason) {
                        console.log(reason);
                    })
                } else if (soortVergeten === "gebruikersnaam") {
                    console.log("gebruikersnaam verstuurd")
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
        document.getElementById("gegevens_herinneren").style.display = "block"
        document.getElementById("login_button").style.display = "block"
        document.getElementById("wachtwoord_uitleg").style.display = "none"
        document.getElementById("gebruikersnaam_uitleg").style.display = "none"
        wachtwoordVergeten = false;
        gebruikersnaamVergeten = false;
    }

    $("#vergeten_button").on("click", function (vergeten) {
        vergeten.preventDefault();
        let bevestiging;
        var emailAdres = document.getElementById('vergeten_input').value;
        if (gebruikersnaamVergeten) {
            console.log("e-mail versturen (gebruikersnaam)")
            vergetenFunctie("gebruikersnaam", emailAdres, "")
            terugInloggen()
        } else if (wachtwoordVergeten) {
            console.log("e-mail versturen (wachtwoord) + " + wachtwoord)
            vergetenFunctie("wachtwoord", emailAdres, wachtwoord)
            terugInloggen()
        }
    })

    $("#annuleren_button").on("click", function (annuleren) {
        annuleren.preventDefault();
        terugInloggen()
    })
});
