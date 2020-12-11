$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));
    let template;
    let nieuwLopende = document.getElementById("lopende_aanvraag");

    function makeAnElement(foto) {
        template = document.importNode(document.getElementById("template_lopende").content, true);
        template.getElementById("foto_gebruiker_lopende").src = foto;

        return template.firstElementChild;
    }

    let appendPhoto;
    FYSCloud.API.queryDatabase(
        // de 2 staat voor geaccepteerde contact verzoeken
        "SELECT  gebruikerid_een = ?, gebruikerid_twee FROM matches WHERE matchstatus = 2",
        [sessionStorage.getItem("userId")]
    ).done(function (data) {
        console.log(data);
        let lopendeGebruiker = data[0]['gebruikerid_twee'];
        let photoUrl = "https://dev-is106-3.fys.cloud/uploads/" + lopendeGebruiker + ".png";
        appendPhoto = photoUrl;
        console.log(appendPhoto);
        let costumElement = makeAnElement(appendPhoto);
        nieuwLopende.appendChild(costumElement);

    }).fail(function (data) {
        console.log(data);
        console.log("fout")
    })

});