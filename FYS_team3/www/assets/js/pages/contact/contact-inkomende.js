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
            FYSCloud.API.queryDatabase(
                "UPDATE matches SET matchstatus = ? WHERE gebruikerid_een = ? AND gebruikerid_twee = ?",
                [matchstatus, userId, gebruikerId]
            ).done(function (data) {
            }).fail(function (data) {
                console.log(data);
                console.log("fout")
            })
        }).fail(function (data) {
            console.log(data);
            console.log("fout")
        })
    }

    function makeAnElement(foto, gebruikerId, voornaam) {
        template = document.importNode(document.getElementById("template_inkomende").content, true);
        template.getElementById("foto_gebruiker_inkomend").src = foto;
        let naam = template.getElementById("naam_inkomende");
        let btn_accept = template.getElementById("accepteer_inkomende");
        let btn_weiger = template.getElementById("weiger_inkomende");
        let profiel_button = template.getElementById("foto_gebruiker_inkomend");
        let inkomende = template.getElementById("inkomende");
        profiel_button.addEventListener('click', (event) => {
            FYSCloud.URL.redirect("profiel.html", {
                id: gebruikerId
            })
        })
        naam.innerHTML = voornaam;
        btn_accept.addEventListener('click', (event) => {
            if (inkomende.className === "inkomende") {
                inkomende.className = " hide_inkomende";
            }
            // 2 staat voor geaccepteerde status
            FYSCloud.API.queryDatabase(
                "SELECT matchstatus FROM matches WHERE gebruikerid_een = ? AND gebruikerid_twee = ?",
                [gebruikerId, userId]
            ).done(function (data) {
                let matchstatusNieuw = 2;
                let matchstatus = data[0]['matchstatus'];
                if (matchstatus !== 0 && matchstatus !== matchstatusNieuw) {
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
    let appendVoornaam;

    function match() {
        FYSCloud.API.queryDatabase(
            "SELECT  gebruikerid_een FROM matches WHERE matchstatus = 1 AND gebruikerid_twee = ?",
            [userId]
        ).done(function (data) {
            var noOfTemplates_inkomende = data.length;
            for (let i = 0; i < noOfTemplates_inkomende; i++) {
                let inkomendeGebruiker = data[i]['gebruikerid_een'];
                if (inkomendeGebruiker !== userId) {
                    FYSCloud.API.queryDatabase(
                        "SELECT voornaam FROM gebruiker_profiel WHERE gebruikerid = ?",
                        [inkomendeGebruiker]
                    ).done(function (data) {
                        let noOfTemplates = data.length;
                        for (let i = 0; i < noOfTemplates; i++) {
                            appendVoornaam = data[0]['voornaam'];
                            let photoUrl = window.location.protocol + "//" + window.location.host + "/uploads/" + inkomendeGebruiker + ".png";
                            appendPhoto = photoUrl;
                            appendGebruikerId = inkomendeGebruiker;
                            let costumElement = makeAnElement(appendPhoto, appendGebruikerId, appendVoornaam);
                            nieuweInkomende.appendChild(costumElement);
                        }
                    }).fail(function (reason) {
                        console.log(reason);
                        console.log("fout");
                    })

                }
            }
        }).fail(function (data) {
            console.log(data);
            console.log("fout")
        })
    }

    match()

    template = document.importNode(document.getElementById("template_inkomende").content, true);
    let btn_accept_load = template.getElementById("accepteer_inkomende").onclick;
    let btn_weiger_load = template.getElementById("weiger_inkomende").onclick;

    if (btn_accept_load || btn_weiger_load) {
        $("#Lopende_Matches").load(document.URL + " #Lopende_Matches")
        match()
    }

    $("#inkomend_tab").on("click", function () {
        $("#inkomende_aanvraag").load(document.URL + " #inkomende_aanvraag")
        match()
    })
});