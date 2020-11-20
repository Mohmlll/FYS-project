$(document).ready(function (qualifiedName, value) {
    $(".gegevens_opslaan").on("click", function (gegevens) {
        gegevens.preventDefault();
        var email = $("#email").is(":valid");
        var telefoon = $("#telefoon").is(":valid");
        if (email && telefoon) {
            location.href = "Profiel_Overzicht.html";
        } else {
            if (!email) {
                document.getElementById("email").style.borderColor = "red";
            } else {
                document.getElementById("email").style.borderColor = "black";
            }

            if (!telefoon) {
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
});
