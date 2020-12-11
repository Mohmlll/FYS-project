$(document).ready(function () {
    var template;
    var nieuweInkomende = document.getElementById("inkomende_aanvraag");
    function makeAnElement(foto) {
        template = document.importNode(document.getElementById("template_inkomende").content, true);
        template.getElementById("match_profiel_img").src = foto;

        return template.firstElementChild;
    }

    let appendPhoto;
    FYSCloud.API.queryDatabase(
        "SELECT  gebruikerid_een = ?, gebruikerid_twee FROM matches WHERE matchstatus = 1",
        [sessionStorage.getItem("userId")]
    ).done(function (data) {
        console.log(data);
        let inkomendeGebruiker = data[0]['gebruikerid_twee'];
        let photoUrl = "https://dev-is106-3.fys.cloud/uploads/" + inkomendeGebruiker + ".png";
        appendPhoto = photoUrl;
        console.log(appendPhoto);
        let costumElement = makeAnElement(appendPhoto);
        nieuweInkomende.appendChild(costumElement);

    }).done(function (data) {
        console.log(data);
        console.log("fout")
    })
});