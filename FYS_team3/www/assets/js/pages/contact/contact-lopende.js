$(document).ready(function () {

    //de code hieronder is voor lopende matches. De matches worden door de code hier onder weergeven.
    let userId = sessionStorage.getItem('userId');

    let template;
    let nieuwLopende = document.getElementById("lopende_match");

    function makeAnElement(foto, gebruikerId, voornaam) {
        template = document.importNode(document.getElementById("template_lopende").content, true);
        template.getElementById("foto_gebruiker_lopende").src = foto;
        let naam = template.getElementById("naam_lopende");
        let profiel_button = template.getElementById("foto_gebruiker_lopende");
        let btn_verwijder = template.getElementById("verwijder_lopende");
        let lopende = template.getElementById('lopende');
        profiel_button.addEventListener('click', (event) => {
            FYSCloud.URL.redirect("profiel.html", {
                id: gebruikerId
            })
        })
        naam.innerHTML = voornaam;

        btn_verwijder.addEventListener('click', (event) => {
            if (lopende.className === "lopende") {
                lopende.className = "hide_lopende";
            }
            FYSCloud.API.queryDatabase(
                "DELETE FROM matches WHERE  gebruikerid_een = ? AND gebruikerid_twee = ?",
                [userId, gebruikerId]
            ).done(function (data) {
                FYSCloud.API.queryDatabase(
                    "DELETE FROM matches WHERE gebruikerid_twee = ? AND gebruikerid_een = ?",
                    [userId, gebruikerId]
                ).done(function (data) {
                }).fail(function (reason) {
                    console.log(reason);
                    console.log("fout");
                })
            }).fail(function (reason) {
                console.log(reason);
                console.log("fout");
            })
        })
        return template.firstElementChild;
    }

    let appendPhoto;
    let appendGebruikerId;
    let appendVoornaam;

    function matches(lopendeGebruiker) {
        if (lopendeGebruiker !== userId) {
            FYSCloud.API.queryDatabase(
                "SELECT voornaam FROM gebruiker_profiel WHERE gebruikerid = ?",
                [lopendeGebruiker]
            ).done(function (data) {
                let noOfTemplates = data.length;
                for (let i = 0; i < noOfTemplates; i++) {
                    appendVoornaam = data[0]['voornaam'];
                    let photoUrl = window.location.protocol + "//" + window.location.host + "/uploads/" + lopendeGebruiker + ".png";
                    appendPhoto = photoUrl;
                    appendGebruikerId = lopendeGebruiker
                    let costumElement = makeAnElement(appendPhoto, appendGebruikerId, appendVoornaam);
                    nieuwLopende.appendChild(costumElement);
                }
            }).fail(function (reason) {
                console.log(reason);
                console.log("fout");
            })
        }
    }

    function resultaten() {
        FYSCloud.API.queryDatabase(
            // de 2 staat voor geaccepteerde contact verzoeken
            "SELECT  gebruikerid_een FROM matches WHERE matchstatus = 2 AND gebruikerid_twee = ?",
            [userId]
        ).done(function (data) {
            let noOfTemplates = data.length;
            for (let i = 0; i < noOfTemplates; i++) {
                let lopendeGebruiker = data[i]['gebruikerid_een'];
                matches(lopendeGebruiker);
            }
        }).fail(function (data) {
            console.log(data);
            console.log("fout")
        })

        FYSCloud.API.queryDatabase(
            "SELECT  gebruikerid_twee FROM matches WHERE matchstatus = 2 AND gebruikerid_een = ?",
            [userId]
        ).done(function (data) {
            let noOfTemplates = data.length;
            for (let i = 0; i < noOfTemplates; i++) {
                let lopendeGebruiker = data[i]['gebruikerid_twee'];
                matches(lopendeGebruiker);
            }
        }).fail(function (data) {
            console.log(data);
            console.log("fout")
        })
    }

    resultaten()

    $("#lopend_tab").on("click", function () {
        $("#lopende_match").load(document.URL + " #lopende_match")
        resultaten()
    })
});