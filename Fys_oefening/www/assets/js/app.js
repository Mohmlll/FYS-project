$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));
    document.getElementById("hamburgermenu").innerHTML =
        "<div class=\"top_menu\"></div>" +
        "<div class=\"center_menu\"></div>" +
        "<div class=\"bottom_menu\"></div>"
    document.getElementById("menu_groot").innerHTML =
        "<a href=\"index.html\">Home</a>" +
        "<a href=\"over-ons.html\">Over ons</a>" +
        "<a class=\"js-logged-out\" href=\"log-in.html\">Aanmelden</a>" +
        "<a class=\"js-logged-in\" href=\"profiel-overzicht.html\">Profiel</a>" +
        "<a class=\"js-logged-in\" href=\"forum-homepagina.html\">Forum</a>" +
        "<a class=\"js-logged-in\" href=\"index.html\">Uitloggen</a>"

        // document.getElementById("responsivemenu").innerHTML =
        //     "<div class=\"hamburgermenu\">" +
        //     "    <div class=\"top_menu\"></div>" +
        //     "    <div class=\"center_menu\"></div>" +
        //     "    <div class=\"bottom_menu\"></div>" +
        //     "</div>" +
        //     "<div class=\"space\"></div>" +
        //     "<div class=\"logomemu\"><a href=\"index.html\"><img alt=\"Corendon TravelBud\" src=\"assets/img/Logo_website.png\"></a>" +
        //     "</div>" +
        //     "<div class=\"menu_groot\">" +
        //     "    <a href=\"index.html\">Home</a>" +
        //     "    <a href=\"over-ons.html\">Over ons</a>" +
        //     "    <a class=\"js-logged-out\" href=\"log-in.html\">Aanmelden</a>" +
        //     "    <a class=\"js-logged-in\" href=\"profiel-overzicht.html\">Profiel</a>" +
        //     "    <a class=\"js-logged-in\" href=\"forum-homepagina.html\">Forum</a>" +
        //     "    <a class=\"js-logged-in\" href=\"index.html\">Uitloggen</a>" +
        //     "</div>" +
        //     "<div class=\"taal\">" +
        //     "    <button class=\"taalbutton\">Taal</button>" +
        //     "    <div class=\"taal_inhoud\">" +
        //     "        <a href=\"#\">NL</a>" +
        //     "        <a href=\"#\">EN</a>" +
        //     "    </div>" +
        //     "</div>"

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


});
