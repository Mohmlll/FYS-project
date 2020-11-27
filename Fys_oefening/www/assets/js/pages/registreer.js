$(document).ready(function () {


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
                "SELECT gebruikerid, gebruikers_naam, status, COUNT(*) FROM gebruiker WHERE gebruikers_naam = ? and wachtwoord = ?",
                [gebruikersnaam, wachtwoord]
            ).done(function (data) {
                console.log(data);
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

    $(".register_button").on("click", function (gegevens) {
        gegevens.preventDefault();
        var gebruikersnaamValid = $("#gebruikersnaam").is(":valid");
        var emailAdresValid = $("#emailadres").is(":valid");
        var wachtwoordValid = $("#wachtwoord").is(":valid");
        var wachtwoordCheckValid = $("#wachtwoordCheck").is(":valid");
        var voorwaardeCheckValid = $("#voorwaardeCheck").is(":valid");

        if (gebruikersnaamValid && emailAdresValid && wachtwoordValid && wachtwoordCheckValid && voorwaardeCheckValid) {

            var gebruikersNaam = document.getElementById('gebruikersnaam').value;
            var emailAdres = document.getElementById('emailadres').value;
            var wachtwoord = document.getElementById('wachtwoord').value;
            var status = "geenGegevens";

            FYSCloud.API.queryDatabase(
                "INSERT INTO gebruiker( gebruikers_naam, emailadres, wachtwoord, status)" +
                "VALUES(?,?,?,?)",
                [ gebruikersNaam, emailAdres, wachtwoord, status]
            ).done(function (data) {
                console.log(data);
                sessionStorage.setItem("userId", data.insertId);
                console.log(sessionStorage.getItem("userId"));
                location.href = "profiel-aanmaken.html";
            }).fail(function (reason) {
                console.log(reason);
            })
        } else {
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
            if (!wachtwoordCheckValid) {
                document.getElementById("wachtwoordCheck").style.borderColor = "red";
                document.getElementById("geenWachtwoordCheck").style.display = "block";
            } else {
                document.getElementById("wachtwoordCheck").style.borderColor = "black";
                document.getElementById("geenWachtwoordCheck").style.display = "none";
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


});
