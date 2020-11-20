$(document).ready(function (qualifiedName, value) {


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




});

