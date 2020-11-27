$(document).ready(function () {
    $("#post_aanmakenId").on("click", function (post) {
        post.preventDefault();
        var postTitelValid = $("#post_titel_id").is(":valid");
        var postContentValid = $("#post_content_id").is(":valid");

        if (postTitelValid && postContentValid) {
            var titel = document.getElementById("post_titel_id").value;
            var postContent = document.getElementById("post_content_id").value;

            FYSCloud.API.queryDatabase(
                "INSERT INTO forum_post (post, titel )" +
                "VALUES(?,?)",
                [postContent, titel]
            ).done(function (data) {
                console.log(data);
                location.href = '#';
            }).fail(function (reason) {
                console.log(reason);
                console.log("fout");
            })
        } else {
            if (!postTitelValid) {
                document.getElementById("post_titel_id").style.borderColor = "red";
                document.getElementById("geenTitel").style.display = "block";
            } else {
                document.getElementById("post_titel_id").style.borderColor = "black";
                document.getElementById("geenTitel").style.display = "none";
            }
            if (!postContentValid) {
                document.getElementById("post_content_id").style.borderColor = "red";
                document.getElementById("geenContent").style.display = "block";
            } else {
                document.getElementById("post_content_id").style.borderColor = "black";
                document.getElementById("geenContent").style.display = "none";
            }
        }

    })
    $(".tag_div label").click(function (tag) {
        tag.preventDefault();
        $(this).find("i").toggleClass("fas fa-plus fas fa-check");


    })


});
