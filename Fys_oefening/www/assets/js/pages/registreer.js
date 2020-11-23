$(document).ready(function (qualifiedName, value) {


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

    $(".register_button").on("click", function (gegevens) {
        gegevens.preventDefault();
        var gebruikersnaamValid = $("#gebruikersnaam").is(":valid");
        var emailAdresValid = $("#emailadres").is(":valid");
        var wachtwoordValid = $("#wachtwoord").is(":valid");
        var wachtwoordCheckValid = $("#wachtwoordCheck").is(":valid");

        if (gebruikersnaamValid && emailAdresValid && wachtwoordValid && wachtwoordCheckValid) {

            var gebruikersNaam = document.getElementById('gebruikersnaam').value;
            var emailAdres = document.getElementById('emailadres').value;
            var wachtwoord = document.getElementById('wachtwoord').value;

            FYSCloud.API.queryDatabase(
                "INSERT INTO gebruiker( gebruikers_naam, emailadres, wachtwoord)" +
                "VALUES( ?,?,?)",
                [ gebruikersNaam, emailAdres, wachtwoord]
            ).done(function (data) {
                console.log(data);
                sessionStorage.setItem("userId", data.insertId)
                console.log(sessionStorage.getItem("userId"));
                //location.href = "profiel-aanmaken.html";
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
        }
    })

    $(".login_button").on("click", function (login) {
        login.preventDefault()
        var gebruikersnaam = document.getElementById("gebruikersnaam_bestaand").value;
        var wachtwoord = document.getElementById("wachtwoord_bestaand").value;

        FYSCloud.API.queryDatabase(
            "SELECT gebruikerid FROM gebruiker WHERE gebruikers_naam = ? and wachtwoord = ?",
            [gebruikersnaam, wachtwoord]
        ).done(function (data) {
            console.log(data);
            console.log(data.length);
            console.log(data.gebruikerid)
        }).fail(function (reason) {
            console.log(reason);
            console.log("fout");
        })


    })


});
