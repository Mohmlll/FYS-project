$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));

    var nieuweAanbevolen = document.getElementById("aanbevolen");
    var template;

    function makeAnElement(voornaam, achternaam, foto, postId) {
        template = document.importNode(document.getElementById("matching_template").content, true);
        let matchVoorNaam = template.getElementById("match_vnaam")
        let matchAchterNaam = template.getElementById("match_anaam")
        template.getElementById("match_profiel_img").src = foto
        let aanbevolen = template.getElementById("aanbevolen_match");
        aanbevolen.addEventListener('click', (event) => {
            FYSCloud.URL.redirect("profiel.html", {
                id: postId
            })
        })
        matchVoorNaam.innerHTML = voornaam
        matchAchterNaam.innerHTML = achternaam

        return template.firstElementChild;
    }

    FYSCloud.API.queryDatabase(
        "SELECT * FROM interesse WHERE idgebruiker = ?",
        [sessionStorage.getItem("userId")]
    ).done(function (data) {
        console.log(data);
        var backpacker = data[0]["backpacker"];
        var explorer = data[0]["explorer"];
        var sportieveling = data[0]["sportieveling"];
        var relaxer = data[0]["relaxer"];
        var partygoer = data[0]["partygoer"];
        var wintersport = data[0]["wintersport"];
        var tropisch = data[0]["tropisch"];
        var resort = data[0]["resort"];
        var noOfTemplates = 5;

        FYSCloud.API.queryDatabase(
            "SELECT (if(backpacker = ?, 1, 0) + if(explorer = ?, 1, 0) + if(sportieveling = ?, 1, 0) + " +
            "if(relaxer = ?, 1, 0) + if(partygoer = ?, 1, 0) + if(wintersport = ?, 1, 0) + if(tropisch = ?, 1, 0) + " +
            "if(resort = ?, 1, 0)) as score, gebruikers_naam, idgebruiker FROM interesse " +
            "JOIN gebruiker  ON (idgebruiker = gebruikerid) " +
            "WHERE idgebruiker != ? ORDER BY score  DESC, gebruikers_naam LIMIT ?",
            [backpacker, explorer, sportieveling, relaxer, partygoer, wintersport, tropisch, resort, sessionStorage.getItem("userId"), noOfTemplates]
        ).done(function (data) {
            console.log(data);
            let gegevens = data;
            let appendVoornaam;
            let appendAchternaam;
            let appendPostId
            for (let i = 0; i < noOfTemplates; i++) {
                FYSCloud.API.queryDatabase(
                    "SELECT voornaam, achternaam, gebruikerid, profiel_foto FROM gebruiker_profiel WHERE gebruikerid = ?",
                    [gegevens[i]["idgebruiker"]]
                ).done(function (data) {
                    var postId = gegevens[i]["idgebruiker"];
                    console.log(postId)
                    var photoUrl = "https://i.imgur.com/b5TbCKd.png";
                    if (data[0]["profiel_foto"] === "foto") {
                        photoUrl = "https://dev-is106-3.fys.cloud/uploads/" + postId + ".png";
                    }
                    var img = new Image();
                    img.src = photoUrl;
                    appendVoornaam = data[0]['voornaam'];
                    appendAchternaam = data[0]['achternaam'];
                    appendPostId = postId;
                    console.log(appendVoornaam, appendAchternaam, photoUrl, postId,appendPostId);

                    let costumElement = makeAnElement(appendVoornaam, appendAchternaam, photoUrl,appendPostId);
                    nieuweAanbevolen.appendChild(costumElement);
                }).fail(function (reason) {
                    console.log(reason);
                    console.log("fout");
                })
            }
        }).fail(function (reason) {
            console.log(reason);
        })
    }).fail(function (reason) {
        console.log(reason);
    })

})
