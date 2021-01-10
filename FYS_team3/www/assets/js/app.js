$(document).ready(function () {
    let userId = sessionStorage.getItem("userId")

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
        var pagina = location.href
        FYSCloud.API.queryDatabase(
            "SELECT status FROM gebruiker WHERE gebruikerid = ?",
            [userId]
        ).done(function (data) {
            if (userId === null || pagina.includes("profiel-aanmaken.html") && data[0]["status"] === "geenGegevens") {
                document.getElementById("logged_out").style.display = "block";
                document.getElementById("logged_in").style.display = "none";
            } else if (data[0] === undefined) {
                document.getElementById("logged_out").style.display = "block";
                document.getElementById("logged_in").style.display = "none";
            } else if (userId !== null && data[0]["status"] === "volledig_profiel") {
                document.getElementById("logged_out").style.display = "none";
                document.getElementById("logged_in").style.display = "block";
            } else {
                document.getElementById("logged_out").style.display = "block";
                document.getElementById("logged_in").style.display = "none";
            }
        }).fail(function (reason) {
            console.log(reason);
            document.getElementById("logged_out").style.display = "block";
            document.getElementById("logged_in").style.display = "none";
        })
    }

    menuSelectie()

    document.getElementById("hamburgermenu").innerHTML =
        "<div class=\"top_menu\"></div>" +
        "<div class=\"center_menu\"></div>" +
        "<div class=\"bottom_menu\"></div>"
    document.getElementById("logged_out").innerHTML =
        "<div class=\"menu_inhoud\">" +
        "   <a class=\"home_menu\" href=\"index.html\">Home</a>" +
        "   <b class=\"streep\">/</b>" +
        "   <a class=\"over_ons_menu\" href=\"over-ons.html\">Over ons</a>" +
        "   <b class=\"streep\">/</b>" +
        "   <a class=\"contact\" href=\"contact.html\">Contact</a>" +
        "   <b class=\"streep\">/</b>" +
        "   <a class=\"js-logged-out\" href=\"log-in.html\">Aanmelden</a>" +
        "</div>"
    document.getElementById("logged_in").innerHTML =
        "<div class=\"menu_inhoud\">" +
        "   <a class=\"home_menu_in\" href=\"index.html\">Home</a>" +
        "   <b class=\"streep\">/</b>" +
        "   <a class=\"over_ons_menu_in\" href=\"over-ons.html\">Over ons</a>" +
        "   <b class=\"streep\">/</b>" +
        "   <a class=\"js-logged-in\" id=\"profiel_menu_in\" href=\"profiel-overzicht.html\">Profiel</a>" +
        "   <b class=\"streep\">/</b>" +
        "   <a class=\"js-logged-in\" id=\"forum_menu_in\" href=\"forum-homepagina.html\">Forum</a>" +
        "   <b class=\"streep\">/</b>" +
        "   <a class=\"contact_in\" href=\"contact.html\">Contact</a>" +
        "   <b class=\"streep\">/</b>" +
        "   <a class=\"js-uitloggen\" id=\"uit_menu_in\" >Uitloggen</a>" +
        "</div>"

    $(".js-uitloggen").on("click", function (logUit) {
        logUit.preventDefault()
        sessionStorage.clear();
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
    })

    $(".contact_button").on("click", function (contact) {
        contact.preventDefault();
        var popup = document.getElementById("myContact_button");
        popup.classList.toggle("show");
    })

    function soortAdvertentie(url, route) {
        document.getElementById("left__ad").innerHTML =
            "<a href=\"https://www.corendon.nl/" + url + "\">" +
            "   <img alt=\"AD\"  class=\"banner_ad_left\" src=\"assets/img/" + route + ".png\">" +
            "</a>"
        document.getElementById("right__ad").innerHTML =
            "<a href=\"https://www.corendon.nl/" + url + "\">" +
            "   <img alt=\"AD\"  class=\"banner_ad_right\" src=\"assets/img/" + route + ".png\">" +
            "</a>"
    }

    function showAds(advertentie) {
        let url;
        switch (advertentie) {
            case "backpacker":
                url = "spanje/costa-del-sol/estepona/fly-go-colina-del-paraiso"
                break;
            case "explorer":
                url = "sri-lanka/west-sri-lanka/rondreizen-sri-lanka/groepsrondreis-ontdek-sri-lanka?"
                break;
            case "sportieveling":
                url = "spanje/canarische-eilanden/fuerteventura/corralejo/oasis-papagayo-sports-resort?"
                break;
            case "relaxer":
                url = "griekenland/kos/kos-stad/pelagos-suites-hotel-spa"
                break;
            case "partygoer":
                url = "bonaire/kralendijk/delfins-beach-resort-bonaire"
                break;
            case "wintersport":
                url = "bulgarije/skivakanties#map"
                break;
            case "tropisch":
                url = "curacao/mambo-beach/the-beach-house"
                break;
            case "resort":
                url = "italie/sardinie/castelsardo/bajaloglia-resort"
                break;
        }

        soortAdvertentie(url, advertentie)
    }


    FYSCloud.API.queryDatabase(
        "SELECT * FROM interesse WHERE idgebruiker = ?",
        [userId]
    ).done(function (data) {
        if (data.length === 0) {
            let tagAds = ["backpacker", "explorer", "sportieveling", "relaxer", "partygoer", "wintersport", "tropisch", "resort"]
            let advertentie = tagAds[Math.floor(Math.random() * tagAds.length)]
            showAds(advertentie)
        } else {
            let backpacker = data[0]["backpacker"];
            let explorer = data[0]["explorer"];
            let sportieveling = data[0]["sportieveling"];
            let relaxer = data[0]["relaxer"];
            let partygoer = data[0]["partygoer"];
            let wintersport = data[0]["wintersport"];
            let tropisch = data[0]["tropisch"];
            let resort = data[0]["resort"];

            let tagAds = []

            if (backpacker === 1) {
                tagAds.push("backpacker")
            }
            if (explorer === 1) {
                tagAds.push("explorer")
            }
            if (sportieveling === 1) {
                tagAds.push("sportieveling")
            }
            if (relaxer === 1) {
                tagAds.push("relaxer")
            }
            if (partygoer === 1) {
                tagAds.push("partygoer")
            }
            if (wintersport === 1) {
                tagAds.push("wintersport")
            }
            if (tropisch === 1) {
                tagAds.push("tropisch")
            }
            if (resort === 1) {
                tagAds.push("resort")
            }
            let advertentie = tagAds[Math.floor(Math.random() * tagAds.length)]
            showAds(advertentie)
        }
    }).fail(function (reason) {
        console.log(reason)
    })

});
