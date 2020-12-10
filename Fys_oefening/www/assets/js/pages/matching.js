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
            "if(resort = ?, 1, 0)) as score, gebruikers_naam, idgebruiker FROM fys_is106_3_dev.interesse " +
            "JOIN fys_is106_3_dev.gebruiker  ON (idgebruiker = gebruikerid) " +
            "WHERE idgebruiker != ? ORDER BY score  DESC, gebruikers_naam LIMIT ?",
            [backpacker, explorer, sportieveling, relaxer, partygoer, wintersport, tropisch, resort, sessionStorage.getItem("userId"), noOfTemplates]
        ).done(function (data) {
            console.log(data);
            var gegevens = data;
            var appendVoornaam;
            var appendAchternaam;
            for (let i = 0; i < noOfTemplates; i++) {
                console.log(gegevens[i]);
                FYSCloud.API.queryDatabase(
                    "SELECT voornaam, achternaam, gebruikerid, profiel_foto FROM gebruiker_profiel WHERE gebruikerid = ?",
                    [gegevens[i]["idgebruiker"]]
                ).done(function (data) {
                    console.log(data[0]);
                    console.log(gegevens[i]);
                    var postId = gegevens[i]["idgebruiker"];
                    console.log(postId)
                    var photoUrl = "https://i.imgur.com/b5TbCKd.png";
                    if (data[0]["profiel_foto"] === "foto") {
                        photoUrl = "https://dev-is106-3.fys.cloud/uploads/" + postId + ".png";
                        console.log(data[0]["profiel_foto"]);
                    }
                    var img = new Image();
                    img.src = photoUrl;
                    appendVoornaam = data[0]['voornaam'];
                    appendAchternaam = data[0]['achternaam'];
                    $('.aanbevolen_match').click(function (){
                        FYSCloud.URL.redirect("profiel.html", {
                            id: postId
                        });
                    })
                    console.log(appendVoornaam, appendAchternaam, photoUrl, postId);

                    let costumElement = makeAnElement(appendVoornaam, appendAchternaam, photoUrl);
                    nieuwePost.appendChild(costumElement);
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
