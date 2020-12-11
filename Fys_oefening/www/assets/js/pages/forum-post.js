$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));

    var nieuwePost = document.getElementById("forum_main_id");
    var template;

    function makeAnElement(titel, content, foto, postId, tag) {
        template = document.importNode(document.getElementById("post_template").content, true);
        let post_header_titel = template.getElementById("post_header_titel");
        template.getElementById("post_profiel_img").src = foto;
        let content_text_div = template.getElementById("post_content");
        let content_text = template.getElementById("content_text");
        let content_tag = template.getElementById("tags");
        let btn = template.getElementById("post_header");
        let contact_button = template.getElementById("contact_verzoek_button");
        contact_button.addEventListener('click', (event) => {
            FYSCloud.URL.redirect("profiel.html", {
                id: postId
            })
        })

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

    let appendTitel;
    let appendPost;
    let appendPhoto;
    let appendPostId;
    let appendTag = document.getElementById("tags");
    let tags = "";


    FYSCloud.API.queryDatabase(
        "SELECT * FROM forum_post, post_tags WHERE forum_post.idforum_post = post_tags.idforum_post"
    ).done(function (data) {
        var noOfTemplates = data.length;
        console.log(noOfTemplates)
        for (let i = 0; i < noOfTemplates; i++) {
            console.log(data[i]);
            let postId = data[i]['idgebruiker'];
            let photoUrl = "https://dev-is106-3.fys.cloud/uploads/" + postId + ".png";
            let idForumPost = data[i]["idforum_post"]
            console.log(idForumPost)
            appendTitel = data[i]['titel'];
            appendPost = data[i]['post'];
            appendPostId = postId;

            var explorer = data[i]["explorer"];
            var sportieveling = data[i]["sportieveling"];
            var relaxer = data[i]["relaxer"];
            var partygoer = data[i]["partygoer"];
            var winterSport = data[i]["winterSport"];
            var tropisch = data[i]["tropisch"];
            var backpacker = data[i]["backpacker"];
            var resort = data[i]["resort"];

            if (explorer === 1) {
                appendTag += " explorer ";
            }
            if (sportieveling === 1) {
                appendTag += " sportieveling ";
            }
            if (relaxer === 1) {
                appendTag += " relaxer ";
            }
            if (partygoer === 1) {
                appendTag += " partygoer ";
            }
            if (winterSport === 1) {
                appendTag += " winterSport ";
            }
            if (tropisch === 1) {
                appendTag += " tropisch ";
            }
            if (backpacker === 1) {
                appendTag += " backpacker ";
            }
            if (resort === 1) {
                appendTag += " resort ";
            }
            if (appendTag.includes("null")) {
                tags = appendTag.replace("null ", "")
            } else {
                tags = appendTag;
            }

            console.log(tags)

            let img = new Image();
            img.src = photoUrl;
            console.log(appendPost, appendTitel, appendPhoto, postId);
            let costumElement = makeAnElement(appendTitel, appendPost, photoUrl, appendPostId, tags);
            nieuwePost.appendChild(costumElement);
            appendTag = "";
        }
    }).fail(function (reason) {
        console.log(reason);
        console.log("fout");
    })

    var img = new Image()
    img.src = "https://dev-is106-3.fys.cloud/uploads/133.png"
    console.log("height = " + img.height);
});
