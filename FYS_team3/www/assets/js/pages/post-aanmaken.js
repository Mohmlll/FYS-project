$(document).ready(function () {
    let userId = sessionStorage.getItem('userId');


    $("#post_aanmakenId").on("click", function (post) {
        post.preventDefault();

        const titel = document.getElementById("post_titel_id");
        const postContent = document.getElementById("post_content_id");
        let titelValue = titel.value;
        let postContentValue = postContent.value;
        let titelAlert = document.getElementById("geenTitel");
        let postAlert = document.getElementById("geenContent");

        var tagExplorer = document.getElementById("tag_explorer").checked;
        var tagSportieveling = document.getElementById("tag_sportieveling").checked;
        var tagRelaxer = document.getElementById("tag_relaxer").checked;
        var tagPartygoer = document.getElementById("tag_partygoer").checked;
        var tagWinterSport = document.getElementById("tag_wintersport").checked;
        var tagTropisch = document.getElementById("tag_tropisch").checked;
        var tagBackpacker = document.getElementById("tag_backpacker").checked;
        var tagResort = document.getElementById("tag_resort").checked;

        if (titelValue !== "" && postContentValue !== "") {


            FYSCloud.API.queryDatabase(
                "INSERT INTO forum_post (post, titel, idgebruiker, datum )" +
                "VALUES(?,?,?, NOW())",
                [postContentValue, titelValue, userId]
            ).done(function (data) {
                let postId = data.insertId

                FYSCloud.API.queryDatabase(
                    "INSERT INTO post_tags SET idforum_post = ?, explorer = ?, sportieveling = ?, relaxer = ?, partygoer = ? , wintersport = ?, tropisch = ?, backpacker= ?, resort= ?, idgebruiker = ?",
                    [postId, tagExplorer, tagSportieveling, tagRelaxer, tagPartygoer, tagWinterSport, tagTropisch, tagBackpacker, tagResort, userId]
                ).done(function (data) {
                    location.href = 'forum-homepagina.html';
                }).fail(function (reason) {
                    console.log(reason);
                })

            }).fail(function (reason) {
                console.log(reason);
                console.log("fout");
            })
        } else {
            if (titelValue === "") {
                titel.style.borderColor = "red";
                titelAlert.style.display = "block";
            } else {
                titel.style.borderColor = "black";
                titelAlert.style.display = "none";
            }
            if (postContentValue === "") {
                postContent.style.borderColor = "red";
                postAlert.style.display = "block";
            } else {
                postContentValue.style.borderColor = "black";
                postAlert.style.display = "none";
            }
        }
    })

    $("#post_annuleren").on("click", function (annuleren) {
        annuleren.preventDefault();
        location.href = "forum-homepagina.html";
    })

});

