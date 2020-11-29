$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));

    var noOfTemplates = 4;
    var nieuwePost = document.getElementById("forum_main_id");
    var template;


    function makeAnElement(text1, text2) {
        template = document.importNode(document.getElementById("post_template").content, true);
        template.getElementById("post").innerText = text1;
        // template.getElementById("post_profiel_img").innerText = text2;
        template.getElementById("post_content").innerText = text2;
        return template.firstElementChild
    }

    var appendTitel;
    var appendPost;
    for (var i = 0; i < noOfTemplates; i++) {

        FYSCloud.API.queryDatabase(
            "SELECT titel, post  FROM forum_post WHERE idgebruiker = ?",
             [i]
        ).done(function (data) {
            console.log(data)
            appendTitel = data[0]['titel']
            appendPost = data[0]['post']
            console.log(appendPost, appendTitel)
            let costumElement = makeAnElement(appendTitel, appendPost)
            nieuwePost.appendChild(costumElement);
        }).fail(function (reason) {
            console.log(reason);
            console.log("fout");
        })
    }

});