$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));
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



        var noOfTemplates = 5;
        var nieuwePost = document.getElementById("forum_main_id");
        var template;


        function makeAnElement(text1, text2){
            template = document.importNode(document.getElementById("post_template").content, true);
            template.getElementById("post").innerText = text1;
            template.getElementById("post_profiel_img").innerText = text2;
            template.getElementById("post_content").innerText = text2;
            return template.firstElementChild
        }

        var customElement;
        for (var i = 0; i < noOfTemplates; i++){

            nieuwePost.appendChild(customElement)
        }

});