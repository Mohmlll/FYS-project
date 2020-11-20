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

    $('.gegevens_bewerken').on("click", function (bewerken) {
        bewerken.preventDefault();
        var readonlycheck = document.getElementById("profiel_input").hasAttribute("readonly");
        var explorer = $("#tag_explorer").is(":checked");

        if (readonlycheck) {
            $(".profiel_input").attr("readonly", false);
            document.getElementById("gegevens_opslaan").style.display = "block";
            document.getElementById("gegevens_bewerken").style.display = "none";
            document.getElementById("explorer").style.display = "block";

        } else {
            $(".profiel_input").attr("readonly", true);
            document.getElementById("gegevens_bewerken").style.display = "block";
            document.getElementById("gegevens_opslaan").style.display = "none";
            document.getElementById("explorer").style.display = "none";
            if (explorer) {
                document.getElementById("explorer").style.display = "block";
            }
        }
        //onclick="location.href='Profiel_Overzicht.html'"
    })
    $(".tag_div label").click(function(tag){
        tag.preventDefault();
        $(this).find("i").toggleClass("fas fa-plus fas fa-check");


    })

    console.log("Dit word uitgevoerd");
    FYSCloud.API.queryDatabase(
        "INSERT INTO gebruiker(,voornaam, achternaam, geboorte_datum, geslacht, woonplaats, telefoon_nummerb,bio )" +
        "VALUES(?,?,?,?,?)",
        [voornaam, achternaam, geboorteDatum, emailAdres, huisdierMee]
    ).done(function (data) {
        console.log(data);
    }).fail(function (reason) {
        console.log(reason);
    })


});

