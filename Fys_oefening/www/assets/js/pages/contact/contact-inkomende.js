$(document).ready(function () {
    let userId = sessionStorage.getItem("userId");

    // de code hier onder is voor inkomende matches die een template invullen op de profiel.htm pagina.
    //
    var template;
    var nieuweInkomende = document.getElementById("inkomende_aanvraag");

    function makeAnElement(foto, gebruikerId) {
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
                "UPDATE matches SET matchstatus = ? WHERE gebruikerid_een = ?",
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
                "UPDATE matches SET matchstatus = ? WHERE gebruikerid_een = ?",
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
        "SELECT  gebruikerid_een FROM matches WHERE matchstatus = 1 AND gebruikerid_twee = ?",
        [userId]
    ).done(function (data) {
        var noOfTemplates_inkomende = data.length;
        for (let i = 0; i < noOfTemplates_inkomende; i++) {
            console.log(data);
            let inkomendeGebruiker = data[i]['gebruikerid_een'];
            // let check = data[i]['gebruikerid_twee'];
            //probeerde hier de eigen userid er uit te filteren maar dat lukte niet.
            if (inkomendeGebruiker !== userId) {
                let photoUrl = "https://dev-is106-3.fys.cloud/uploads/" + inkomendeGebruiker + ".png";
                appendPhoto = photoUrl;
                appendGebruikerId = inkomendeGebruiker;
                console.log(appendPhoto);
                let costumElement = makeAnElement(appendPhoto, appendGebruikerId);
                nieuweInkomende.appendChild(costumElement);
            }
        }
    }).fail(function (data) {
        console.log(data);
        console.log("fout")
    })

});