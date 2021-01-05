$(document).ready(function () {
    let userId = sessionStorage.getItem('userId');

    let template;
    let nieuweUitgaande = document.getElementById("uitgaande_aanvraag");

    function makeAnElement(foto, gebruikerId, voornaam) {
        template = document.importNode(document.getElementById("template_uitgaande").content, true);
        template.getElementById("foto_gebruiker_uitgaande").src = foto;
        let naam = template.getElementById("naam_uitgaande");
        let profiel_button = template.getElementById("foto_gebruiker_uitgaande");
        profiel_button.addEventListener('click', (event) => {
            FYSCloud.URL.redirect("profiel.html", {
                id: gebruikerId
            })
        })
        naam.innerHTML = voornaam;
        return template.firstElementChild;
    }

    let appendPhoto;
    let appendGebruikerId;
    let appendVoornaam;
    FYSCloud.API.queryDatabase(
        "SELECT gebruikerid_twee FROM matches WHERE matchstatus = 1 AND gebruikerid_een = ?",
        [userId]
    ).done(function (data) {
        console.log(data);
        var noOfTemplates = data.length;
        console.log(noOfTemplates)
        for (let i = 0; i < noOfTemplates; i++) {
            let uitgaandeGebruiker = data[i]['gebruikerid_twee'];
            if (uitgaandeGebruiker !== userId) {
                FYSCloud.API.queryDatabase(
                    "SELECT voornaam FROM gebruiker_profiel WHERE gebruikerid = ?",
                    [uitgaandeGebruiker]
                ).done(function (data) {
                    let noOfTemplates = data.length;
                    for (let i = 0; i < noOfTemplates; i++) {
                        console.log(data);
                        appendVoornaam = data[0]['voornaam'];
                        let photoUrl = "https://dev-is106-3.fys.cloud/uploads/" + uitgaandeGebruiker + ".png";
                        appendPhoto = photoUrl;
                        appendGebruikerId = uitgaandeGebruiker
                        let costumElement = makeAnElement(appendPhoto, appendGebruikerId, appendVoornaam);
                        nieuweUitgaande.appendChild(costumElement);
                    }
                }).fail(function (data) {
                    console.log(data);
                    console.log("fout")
                })
            }
        }
    }).fail(function (data) {
        console.log(data);
        console.log("fout")
    })
});