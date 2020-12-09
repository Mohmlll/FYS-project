$(document).ready(function () {


    $("#contact_verzoek_button").on("click", function (gegevens) {

        var matchstatus = 1;
        FYSCloud.API.queryDatabase(
        "INSERT INTO gebruikerid_een, gebruikerid_twee, matchstatus FROM matches"
            
        [sessionStorage.getItem("userId"),matchstatus ]
        ).done(function (data) {
            console.log(data)
        }).fail(function (reason) {
            console.log(reason);
            console.log("fout");
        })
    })
});