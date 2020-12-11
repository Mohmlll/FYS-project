$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));
    var template;
    var nieuweInkomende = document.getElementById("inkomende_aanvraag");

    function makeAnElement(foto) {
        template = document.importNode(document.getElementById("template_inkomende").content, true);
        template.getElementById("foto_gebruiker_inkomend").src = foto;

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

    }).fail(function (data) {
        console.log(data);
        console.log("fout")
    })

    $("#accepteer_inkomende").click(function () {
        // 2 staat voor geaccepteerde status
        let matchstatus = 2;
        FYSCloud.API.queryDatabase(
            "UPDATE matches SET matchstatus = ? WHERE gebruikerid_1 = ?",
            [matchstatus, sessionStorage.getItem("userId")]
        ).done(function (data) {
            console.log(data);
        }).fail(function (data) {
            console.log(data);
            console.log("fout")
        })
    })

    $("#weiger_inkomende").click(function () {
        // 0 staat voor geweigerde/neutrale status
        let matchstatus = 0;
        FYSCloud.API.queryDatabase(
            "UPDATE matches SET matchstatus = ? WHERE gebruikerid_1 = ?",
            [matchstatus, sessionStorage.getItem("userId")]
        ).done(function (data) {
            console.log(data);
        }).fail(function (data) {
            console.log(data);
            console.log("fout")
        })
    })


});