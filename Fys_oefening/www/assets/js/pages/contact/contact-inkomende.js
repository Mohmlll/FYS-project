$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));
    var template;
    var nieuweInkomende = document.getElementById("inkomende_aanvraag");

    function makeAnElement(foto, gebruikerId, content) {
        template = document.importNode(document.getElementById("template_inkomende").content, true);
        template.getElementById("foto_gebruiker_inkomend").src = foto;
        let btn_accept = template.getElementById("accepteer_inkomende");
        let btn_weiger = template.getElementById("weiger_inkomende");
        let profiel_button = template.getElementById("foto_gebruiker_inkomend");
        let inkomende = template.getElementById("inkomende");
        profiel_button.addEventListener('click', (event) => {
            FYSCloud.URL.redirect("profiel.html", {
                id: gebruikerId
            })
        })

        btn_accept.addEventListener('click', (event) => {
            if (inkomende.className === "inkomende") {
                inkomende.className = " hide_inkomende";
            }
            // 2 staat voor geaccepteerde status
            let matchstatus = 2;
            console.log("test")
            FYSCloud.API.queryDatabase(
                "UPDATE matches SET matchstatus = ? WHERE gebruikerid_twee = ?",
                [matchstatus, gebruikerId]
            ).done(function (data) {
                console.log(data);
            }).fail(function (data) {
                console.log(data);
                console.log("fout")
            })

        })
        btn_weiger.addEventListener('click', (event) => {
            if (inkomende.className === "inkomende") {
                inkomende.className = " hide_inkomende";
            }
            // 0 staat voor geweigerde/neutrale status
            let matchstatus = 0;
            FYSCloud.API.queryDatabase(
                "UPDATE matches SET matchstatus = ? WHERE gebruikerid_twee = ?",
                [matchstatus, gebruikerId]
            ).done(function (data) {
                console.log(data);
            }).fail(function (data) {
                console.log(data);
                console.log("fout")
            })
        })
        return template.firstElementChild;
    }

    let appendPhoto;
    let appendGebruikerId;

    FYSCloud.API.queryDatabase(
        "SELECT  gebruikerid_een = ?, gebruikerid_twee FROM matches WHERE matchstatus = 1",
        [sessionStorage.getItem("userId")]
    ).done(function (data) {
        console.log(data);
        let inkomendeGebruiker = data[0]['gebruikerid_twee'];
        let photoUrl = "https://dev-is106-3.fys.cloud/uploads/" + inkomendeGebruiker + ".png";
        appendPhoto = photoUrl;
        appendGebruikerId = data[0]['gebruikerid_twee'];
        console.log(appendPhoto);
        let costumElement = makeAnElement(appendPhoto);
        nieuweInkomende.appendChild(costumElement);
    }).fail(function (data) {
        console.log(data);
        console.log("fout")
    })

});