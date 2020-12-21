$(document).ready(function () {
    let userId = sessionStorage.getItem('userId');

    // de code hier onder is voor inkomende matches die een template invullen op de profiel.htm pagina.
    //
    var template;
    var nieuweInkomende = document.getElementById("inkomende_aanvraag");

    function updateMatchstatus(matchstatus, gebruikerId) {
        FYSCloud.API.queryDatabase(
            "UPDATE matches SET matchstatus = ? WHERE gebruikerid_een = ? AND gebruikerid_twee = ?",
            [matchstatus, gebruikerId, userId]
        ).done(function (data) {
            console.log(data);
            FYSCloud.API.queryDatabase(
                "UPDATE matches SET matchstatus = ? WHERE gebruikerid_een = ? AND gebruikerid_twee = ?",
                [matchstatus, userId, gebruikerId]
            ).done(function (data) {
                console.log(data);
                location.reload();
            }).fail(function (data) {
                console.log(data);
                console.log("fout")
            })
        }).fail(function (data) {
            console.log(data);
            console.log("fout")
        })
    }

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
            FYSCloud.API.queryDatabase(
                "SELECT matchstatus FROM matches WHERE gebruikerid_een = ? AND gebruikerid_twee = ?",
                [gebruikerId, userId]
            ).done(function (data) {
                console.log(data);
                let matchstatus = data[0]['matchstatus'];
                if (matchstatus !== 0 && matchstatus !== 2) {
                    let matchstatusNieuw = 2;
                    updateMatchstatus(matchstatusNieuw, gebruikerId);
                }
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
            updateMatchstatus(matchstatus, gebruikerId);
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