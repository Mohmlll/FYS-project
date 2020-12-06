$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));

    var nieuwePost = document.getElementById("aanbevolen");
    var template;

    function makeAnElement(voornaam, achternaam, foto) {
        template = document.importNode(document.getElementById("matching_template").content, true);
        let matchVoorNaam = template.getElementById("match_vnaam")
        let matchAchterNaam = template.getElementById("match_anaam")
        template.getElementById("match_profiel_img").src = foto

        matchVoorNaam.innerHTML = voornaam
        matchAchterNaam.innerHTML = achternaam

        return template.firstElementChild;
    }


    var appendVoornaam;
    var appendAchternaam;

    FYSCloud.API.queryDatabase(
        "SELECT voornaam, achternaam, gebruikerid, profiel_foto FROM gebruiker_profiel"
    ).done(function (data) {
        var noOfTemplates = data.length;
        console.log(noOfTemplates)
        for (let i = 0; i < noOfTemplates; i++) {
            console.log(data[i])
            var postId = data[i]['gebruikerid'];
            var photoUrl = "https://i.imgur.com/b5TbCKd.png";
            if (data[i]["profiel_foto"] === "foto") {
                photoUrl = "https://dev-is106-3.fys.cloud/uploads/" + postId + ".png";
                console.log(data[i]["profiel_foto"])
            }
            var img = new Image()
            img.src = photoUrl;
            appendVoornaam = data[i]['voornaam']
            appendAchternaam = data[i]['achternaam']
            console.log(appendVoornaam, appendAchternaam, photoUrl,postId)
            let costumElement = makeAnElement(appendVoornaam, appendAchternaam, photoUrl)
            nieuwePost.appendChild(costumElement);
        }
        //TODO: appendPhoto,postId zijn undefined
    }).fail(function (reason) {
        console.log(reason);
        console.log("fout");
    })
})