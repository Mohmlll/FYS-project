$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));
    let template;
    let nieuweUitgaande = document.getElementById("uitgaande_aanvraag");

    function makeAnElement(foto, gebruikerId) {
        template = document.importNode(document.getElementById("template_uitgaande").content, true);
        template.getElementById("foto_gebruiker_uitgaande").src = foto;
        let profiel_button = template.getElementById("foto_gebruiker_uitgaande");
        profiel_button.addEventListener('click', (event) => {
            FYSCloud.URL.redirect("profiel.html", {
                id: gebruikerId
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
        let uitgaandeGebruiker = data[0]['gebruikerid_twee'];
        let photoUrl = "https://dev-is106-3.fys.cloud/uploads/" + uitgaandeGebruiker + ".png";
        appendPhoto = photoUrl;
        appendGebruikerId = data[0]['gebruikerid_twee'];
        let costumElement = makeAnElement(appendPhoto, appendGebruikerId);
        nieuweUitgaande.appendChild(costumElement);

    }).fail(function (data) {
        console.log(data);
        console.log("fout")
    })
});