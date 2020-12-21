$(document).ready(function () {

    //de code hieronder is voor lopende matches. De matches worden door de code hier onder weergeven.
    let userId = sessionStorage.getItem('userId');

    let template;
    let nieuwLopende = document.getElementById("lopende_match");

    function makeAnElement(foto, gebruikerId) {
        template = document.importNode(document.getElementById("template_lopende").content, true);
        template.getElementById("foto_gebruiker_lopende").src = foto;
        let profiel_button = template.getElementById("foto_gebruiker_lopende");
        let btn_verwijder = template.getElementById("verwijder_lopende");
        let lopende = template.getElementById('lopende');
        profiel_button.addEventListener('click', (event) => {
            FYSCloud.URL.redirect("profiel.html", {
                id: gebruikerId
            })
        })
        btn_verwijder.addEventListener('click', (event)=>{
            if (lopende.className === "lopende") {
                lopende.className = "hide_lopende";
            }
            FYSCloud.API.queryDatabase(
                "DELETE FROM matches WHERE  gebruikerid_een = ? AND gebruikerid_twee = ?",
                [userId,gebruikerId]
            ).done(function (data){
                console.log(data);
                FYSCloud.API.queryDatabase(
                    "DELETE FROM matches WHERE gebruikerid_twee = ? AND gebruikerid_een = ?",
                    [userId,gebruikerId]
                ).done(function (data){
                    console.log(data);
                }).fail(function (reason){
                    console.log(reason);
                    console.log("fout");
                })
            }).fail(function (reason){
                console.log(reason);
                console.log("fout");
            })
        })
        return template.firstElementChild;
    }

    let appendPhoto;
    let appendGebruikerId;

    function matches(lopendeGebruiker) {
        if (lopendeGebruiker !== userId) {
            let photoUrl = "https://dev-is106-3.fys.cloud/uploads/" + lopendeGebruiker + ".png";
            appendPhoto = photoUrl;
            appendGebruikerId = lopendeGebruiker
            console.log(appendPhoto);
            let costumElement = makeAnElement(appendPhoto, appendGebruikerId);
            nieuwLopende.appendChild(costumElement);
        }
    }

    FYSCloud.API.queryDatabase(
        // de 2 staat voor geaccepteerde contact verzoeken
        "SELECT  gebruikerid_een FROM matches WHERE matchstatus = 2 AND gebruikerid_twee = ?",
        [userId]
    ).done(function (data) {
        let noOfTemplates = data.length;
        console.log(noOfTemplates)
        for (let i = 0; i < noOfTemplates; i++) {
            console.log(data);
            let lopendeGebruiker = data[i]['gebruikerid_een'];
            matches(lopendeGebruiker);
        }
    }).fail(function (data) {
        console.log(data);
        console.log("fout")
    })

    FYSCloud.API.queryDatabase(
        "SELECT  gebruikerid_twee FROM matches WHERE matchstatus = 2 AND gebruikerid_een = ?",
        [userId]
    ).done(function (data) {
        let noOfTemplates = data.length;
        console.log(noOfTemplates)
        for (let i = 0; i < noOfTemplates; i++) {
            console.log(data);
            let lopendeGebruiker = data[i]['gebruikerid_twee'];
            matches(lopendeGebruiker);
        }
    }).fail(function (data) {
        console.log(data);
        console.log("fout")
    })
});