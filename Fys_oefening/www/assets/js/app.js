$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));

    var forumLogin = location.href.includes("forum-homepagina.html");
    var postLogin = location.href.includes("post.html");
    var postAanmakenLogin = location.href.includes("post-aanmaken.html");
    var profielLogin = location.href.includes("profiel.html");
    var profielAanmakenLogin = location.href.includes(("profiel-aanmaken.html"));
    var profielOverzichtLogin = location.href.includes("profiel-overzicht.html");
    if (sessionStorage.getItem("userId") === null && (forumLogin || postLogin || postAanmakenLogin || profielLogin || profielAanmakenLogin || profielOverzichtLogin)) {
        location.href = "log-in.html";
    }

    function menuSelectie() {
        var id = sessionStorage.getItem("userId")
        var pagina = location.href
        console.log(pagina)
        FYSCloud.API.queryDatabase(
            "SELECT status FROM gebruiker WHERE gebruikerid = ?",
            [id]
        ).done(function (data) {
            console.log(data);
            console.log(data[0]);
            if (id === null || pagina.includes("profiel-aanmaken.html") && data[0]["status"] === "geenGegevens") {
                document.getElementById("logged_out").style.display = "block";
                document.getElementById("logged_in").style.display = "none";
                console.log("0")
            } else if (data[0] === undefined) {
                document.getElementById("logged_out").style.display = "block";
                document.getElementById("logged_in").style.display = "none";
                console.log("1")
            } else if (id !== null && data[0]["status"] === "volledig_profiel") {
                document.getElementById("logged_out").style.display = "none";
                document.getElementById("logged_in").style.display = "block";
                console.log("2")
            } else {
                document.getElementById("logged_out").style.display = "block";
                document.getElementById("logged_in").style.display = "none";
                console.log("3")
            }
        }).fail(function (reason) {
            console.log(reason);
            document.getElementById("logged_out").style.display = "block";
            document.getElementById("logged_in").style.display = "none";
            console.log("geen database")
        })
    }


    menuSelectie()

    document.getElementById("hamburgermenu").innerHTML =
        "<div class=\"top_menu\"></div>" +
        "<div class=\"center_menu\"></div>" +
        "<div class=\"bottom_menu\"></div>"
    document.getElementById("logged_out").innerHTML =
        "<a href=\"index.html\">Home</a>" +
        "<a href=\"over-ons.html\">Over ons</a>" +
        "<a class=\"js-logged-out\" href=\"log-in.html\">Aanmelden</a>"
    document.getElementById("logged_in").innerHTML =
        "<a href=\"index.html\">Home</a>" +
        "<a href=\"over-ons.html\">Over ons</a>" +
        "<a class=\"js-logged-in\" href=\"profiel-overzicht.html\">Profiel</a>" +
        "<a class=\"js-logged-in\" href=\"forum-homepagina.html\">Forum</a>" +
        "<a class=\"js-uitloggen\">Uitloggen</a>"


    $(".js-uitloggen").on("click", function (logUit) {
        logUit.preventDefault()
        console.log("uitloggen")
        sessionStorage.setItem("userId", null);
        menuSelectie()
        document.location.href = "index.html"
    })

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

    $(".contact_button").on("click", function (contact) {
        contact.preventDefault();
        var popup = document.getElementById("myContact_button");
        popup.classList.toggle("show");
    })


    if (sessionStorage.getItem("userId") !== null) {
        document.getElementById("profielFoto").setAttribute("src", "https://dev-is106-3.fys.cloud/uploads/" + sessionStorage.getItem("userId") + ".png");
        console.log("src", "https://dev-is106-3.fys.cloud/uploads/" + sessionStorage.getItem("userId") + ".png");
    }



});
