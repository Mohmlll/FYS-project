$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));
    let template;
    let nieuweUitgaande = document.getElementById("uitgaande_aanvraag");

    function makeAnElement(foto) {
        template = document.importNode(document.getElementById("template_uitgaande").content, true);
        template.getElementById("foto_gebruiker_uitgaande").src = foto;

        return template.firstElementChild;
    }

    let appendPhoto;
    FYSCloud.API.queryDatabase(
        "SELECT  gebruikerid_een = ?, gebruikerid_twee FROM matches WHERE matchstatus = 1",
        [sessionStorage.getItem("userId")]
    ).done(function (data) {
        console.log(data);
        let uitgaandeGebruiker = data[0]['gebruikerid_twee'];
        let photoUrl = "https://dev-is106-3.fys.cloud/uploads/" + uitgaandeGebruiker + ".png";
        appendPhoto = photoUrl;
        console.log(appendPhoto);
        let costumElement = makeAnElement(appendPhoto);
        nieuweUitgaande.appendChild(costumElement);

    }).fail(function (data) {
        console.log(data);
        console.log("fout")
    })
});