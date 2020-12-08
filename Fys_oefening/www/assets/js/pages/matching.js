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

        FYSCloud.API.queryDatabase(
            "SELECT * FROM interesse"
        ).done(function (data) {
            console.log(data);
            var maxScore = 10;
            var scoreArray = []
            for (let i = 0; i < data.length; i++) {
                console.log(data[i]["idgebruiker"] + " " + sessionStorage.getItem("userId"))
                if (data[i]["idgebruiker"] !== sessionStorage.getItem("userId")) {
                    var puntentelling = 0;
                    if (data[i]["backpacker"] === backpacker) {
                        puntentelling += maxScore;
                    }
                    if (data[i]["explorer"] === explorer) {
                        puntentelling += maxScore;
                    }
                    if (data[i]["sportieveling"] === sportieveling) {
                        puntentelling += maxScore;
                    }
                    if (data[i]["relaxer"] === relaxer) {
                        puntentelling += maxScore;
                    }
                    if (data[i]["partygoer"] === partygoer) {
                        puntentelling += maxScore;
                    }
                    if (data[i]["wintersport"] === wintersport) {
                        puntentelling += maxScore;
                    }
                    if (data[i]["tropisch"] === tropisch) {
                        puntentelling += maxScore;
                    }
                    if (data[i]["resort"] === resort) {
                        puntentelling += maxScore;
                    }
                    scoreArray.push([puntentelling, data[i]["idgebruiker"]]);
                } else {
                    console.log("hallo")
                }

            }
            console.log(scoreArray);
            scoreArray.sort(function (a, b) {return b[0] - a[0]} );
            var top5 = scoreArray.slice(0, 3)
            console.log(top5)

            var appendVoornaam;
            var appendAchternaam;


            var noOfTemplates = 3;
            console.log(noOfTemplates)

            for (let i = 0; i < noOfTemplates; i++) {
                console.log(top5[i][1]);
                FYSCloud.API.queryDatabase(
                    "SELECT voornaam, achternaam, gebruikerid, profiel_foto FROM gebruiker_profiel WHERE gebruikerid = ?",
                    [top5[i][1]]
                ).done(function (data) {
                    console.log(data[0]);
                    console.log(top5[i][1]);
                    var postId = top5[i][1];
                    var photoUrl = "https://i.imgur.com/b5TbCKd.png";
                    if (data[0]["profiel_foto"] === "foto") {
                        photoUrl = "https://dev-is106-3.fys.cloud/uploads/" + postId + ".png";
                        console.log(data[0]["profiel_foto"]);
                    }
                    var img = new Image();
                    img.src = photoUrl;
                    appendVoornaam = data[0]['voornaam'];
                    appendAchternaam = data[0]['achternaam'];
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
