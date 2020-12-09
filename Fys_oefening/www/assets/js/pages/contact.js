$(document).ready(function () {


    $("#contact_verzoek_button").on("click", function (gegevens) {
        gegevens.preventDefault();
        console.log("test");
        let postGebruikerId;
        FYSCloud.API.queryDatabase(
            "SELECT idgebruiker FROM forum_post"
        ).done(function (data) {
            console.log(data);
            postGebruikerId = data[0]['idgebruiker'];
        }).fail(function (data) {
            console.log(data)
        })

        var matchstatus = 1;
        FYSCloud.API.queryDatabase(
            "INSERT INTO gebruikerid_een, gebruikerid_twee, matchstatus FROM matches"
                [sessionStorage.getItem("userId"), postGebruikerId, matchstatus]
        ).done(function (data) {
            console.log(data)
        }).fail(function (reason) {
            console.log(reason);
            console.log("fout");
        })
    })
});