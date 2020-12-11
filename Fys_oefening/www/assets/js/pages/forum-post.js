$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));

    var nieuwePost = document.getElementById("forum_main_id");
    var template;


    function makeAnElement(titel, content, foto, tag) {
        template = document.importNode(document.getElementById("post_template").content, true);
        let post_header_titel = template.getElementById("post_header_titel")
        template.getElementById("post_profiel_img").src = foto
        let content_text_div = template.getElementById("post_content")
        let content_text = template.getElementById("content_text")
        let content_tag = template.getElementById("tags")
        let btn = template.getElementById("post_header")

        post_header_titel.innerHTML = titel
        content_text.innerHTML = content
        content_tag.innerHTML = tag


        btn.addEventListener('click', (event) => {
            if (content_text_div.className === "post_content") {
                content_text_div.className += " expand";
            } else {
                content_text_div.className = "post_content";
            }
        })
        return template.firstElementChild;
    }

    var appendTitel;
    var appendPost;
    var appendTags;
    var appendPhoto;

    FYSCloud.API.queryDatabase(
        "SELECT * FROM post_tags"
    ).done(function (data) {
        console.log(data)
        var explorer = data[0]["explorer"];
        var sportieveling = data[0]["sportieveling"];
        var relaxer = data[0]["relaxer"];
        var partygoer = data[0]["partygoer"];
        var winterSport = data[0]["winterSport"];
        var tropisch = data[0]["tropisch"];
        var backpacker = data[0]["backpacker"];
        var resort = data[0]["resort"];
    }).fail(function (reason) {
        console.log(reason);
        console.log("fout");
    })

    FYSCloud.API.queryDatabase(
        "SELECT idgebruiker, titel, post FROM forum_post"
    ).done(function (data) {
        var noOfTemplates = data.length;
        console.log(noOfTemplates)
        for (let i = 0; i < noOfTemplates; i++) {
            console.log(data[i]);
            var postId = data[i]['idgebruiker'];
            var photoUrl = "https://dev-is106-3.fys.cloud/uploads/" + postId + ".png";
            console.log(data[i]["profiel_foto"])
            appendTitel = data[i]['titel'];
            appendPost = data[i]['post'];
            var img = new Image()
            img.src = photoUrl;
            console.log(appendPost, appendTitel, appendPhoto, postId)
            let costumElement = makeAnElement(appendTitel, appendPost, photoUrl, appendTags)
            nieuwePost.appendChild(costumElement);
        }
    }).fail(function (reason) {
        console.log(reason);
        console.log("fout");
    })
    var img = new Image()
    img.src = "https://dev-is106-3.fys.cloud/uploads/133.png"
    console.log("height = " + img.height);
});