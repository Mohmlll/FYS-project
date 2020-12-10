$(document).ready(function () {
    $("#post_aanmakenId").on("click", function (post) {
        post.preventDefault();
        var titel = document.getElementById("post_titel_id").value;
        var postContent = document.getElementById("post_content_id").value;

        if (titel !== "" && postContent !== "") {


            FYSCloud.API.queryDatabase(
                "INSERT INTO forum_post (post, titel, idgebruiker )" +
                "VALUES(?,?,?)",
                [postContent, titel, sessionStorage.getItem("userId")]
            ).done(function (data) {
                console.log(data);
                location.href = 'forum-homepagina.html';
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


});

