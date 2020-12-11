$(document).ready(function () {
    $("#post_aanmakenId").on("click", function (post) {
        post.preventDefault();
        var titel = document.getElementById("post_titel_id").value;
        var postContent = document.getElementById("post_content_id").value;
        var tagExplorer = document.getElementById("tag_explorer").checked;
        var tagSportieveling = document.getElementById("tag_sportieveling").checked;
        var tagRelaxer = document.getElementById("tag_relaxer").checked;
        var tagPartygoer = document.getElementById("tag_partygoer").checked;
        var tagWinterSport = document.getElementById("tag_wintersport").checked;
        var tagTropisch = document.getElementById("tag_tropisch").checked;
        var tagBackpacker = document.getElementById("tag_backpacker").checked;
        var tagResort = document.getElementById("tag_resort").checked;

        if (titel !== "" && postContent !== "") {


            FYSCloud.API.queryDatabase(
                "INSERT INTO forum_post (post, titel, idgebruiker )" +
                "VALUES(?,?,?)",
                [postContent, titel, sessionStorage.getItem("userId")]
            ).done(function (data) {
                console.log(data);
                let postId = data.insertId

                FYSCloud.API.queryDatabase(
                    "INSERT INTO post_tags SET idforum_post = ?, explorer = ?, sportieveling = ?, relaxer = ?, partygoer = ? , wintersport = ?, tropisch = ?, backpacker= ?, resort= ?, idgebruiker = ?",
                    [postId, tagExplorer, tagSportieveling, tagRelaxer, tagPartygoer, tagWinterSport, tagTropisch, tagBackpacker, tagResort, sessionStorage.getItem("userId")]
                ).done(function (data) {
                    console.log(data);
                    location.href = 'forum-homepagina.html';
                }).fail(function (reason) {
                    console.log(reason);
                })

            }).fail(function (reason) {
                console.log(reason);
                console.log("fout");
            })
        } else {
            if (titel === "") {
                document.getElementById("post_titel_id").style.borderColor = "red";
                document.getElementById("geenTitel").style.display = "block";
                console.log("1");
            } else {
                document.getElementById("post_titel_id").style.borderColor = "black";
                document.getElementById("geenTitel").style.display = "none";
                console.log("2");
            }
            if (postContent === "") {
                document.getElementById("post_content_id").style.borderColor = "red";
                document.getElementById("geenContent").style.display = "block";
                console.log("3");
            } else {
                document.getElementById("post_content_id").style.borderColor = "black";
                document.getElementById("geenContent").style.display = "none";
                console.log("4");
            }
        }
    })

    $("#post_annuleren").on("click", function (annuleren) {
        annuleren.preventDefault();
        location.href = "forum-homepagina.html";
    })

});

