$(document).ready(function (qualifiedName, value) {
    $(".hamburgermenu").on("click", function (e) {
        e.preventDefault();
        var x = document.getElementById("responsivemenu");
        if (x.className === "menu") {
            x.className += " uitklappen";
        } else {
            x.className = "menu";
        }
        console.log(x.className)
    })

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
        var wachtwoordValid= $("#wachtwoord").is(":valid");
        var wachtwoordCheckValid = $("#wachtwoordCheck").is(":valid");

        if (gebruikersnaamValid && emailAdresValid && wachtwoordValid && wachtwoordCheckValid) {
            location.href = "createProfile.html";
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
        if (!wachtwoordCheckValid) {
            document.getElementById("wachtwoordCheck").style.borderColor = "red";
            document.getElementById("geenWachtwoordCheck").style.display = "block";
        } else {
            document.getElementById("wachtwoordCheck").style.borderColor = "black";
            document.getElementById("geenWachtwoordCheck").style.display = "none";
        }


        var gebruikersNaam = document.getElementById('gebruikersnaam').value;
        var emailAdres = document.getElementById('emailadres').value;
        var wachtwoord = document.getElementById('wachtwoord').value;
        var wachtwoordCheck = document.getElementById('wachtwoordCheck').value;

        FYSCloud.API.queryDatabase(
            "INSERT INTO gebruiker(gebruikers_naam, emailadres, wachtwoord)" +
            "VALUES(?,?,?)",
            [gebruikersNaam, emailAdres, wachtwoord]
        ).done(function (data) {
            console.log(data);
        }).fail(function (reason) {
            console.log(reason);
        })

    })

    

});