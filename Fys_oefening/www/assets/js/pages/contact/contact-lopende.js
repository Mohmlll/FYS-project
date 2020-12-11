$(document).ready(function () {

    //de code hieronder is voor lopende matches. De matches worden door de code hier onder weergeven.
    console.log(sessionStorage.getItem("userId"));
    let template;
    let nieuwLopende = document.getElementById("lopende_aanvraag");

    function makeAnElement(foto, gebruikerId) {
        template = document.importNode(document.getElementById("template_lopende").content, true);
        template.getElementById("foto_gebruiker_lopende").src = foto;
        let profiel_button = template.getElementById("foto_gebruiker_lopende");
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
        // de 2 staat voor geaccepteerde contact verzoeken
        "SELECT  gebruikerid_een, gebruikerid_twee = ? FROM matches WHERE matchstatus = 2",
        [sessionStorage.getItem("userId")]
    ).done(function (data) {
        let noOfTemplates = data.length;
        console.log(noOfTemplates)
        for (let i = 0; i < noOfTemplates; i++) {
            console.log(data);
            let lopendeGebruiker = data[i]['gebruikerid_een'];
            if (lopendeGebruiker !== sessionStorage.getItem("userId")) {
                let photoUrl = "https://dev-is106-3.fys.cloud/uploads/" + lopendeGebruiker + ".png";
                appendPhoto = photoUrl;
                appendGebruikerId = lopendeGebruiker
                console.log(appendPhoto);
                let costumElement = makeAnElement(appendPhoto, appendGebruikerId);
                nieuwLopende.appendChild(costumElement);
            }
        }
    }).fail(function (data) {
        console.log(data);
        console.log("fout")
    })

});