$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));

    var nieuwePost = document.getElementById("forum_main_id");
    var template;


    function makeAnElement(titel, content, foto, postId, fotostatus) {
        template = document.importNode(document.getElementById("post_template").content, true);
        let post_header_titel = template.getElementById("post_header_titel")
        if (fotostatus) {
            template.getElementById("post_profiel_img").setAttribute("src", "https://dev-is106-3.fys.cloud/uploads/" + postId + ".png");
        }

        let content_text_div = template.getElementById("post_content")
        let content_text = template.getElementById("content_text")
        let btn = template.getElementById("post_header")

        post_header_titel.innerHTML = titel
        content_text.innerHTML = content



        btn.addEventListener('click', (event) => {
            if (content_text_div.className === "post_content") {
                content_text_div.className += " expand";
            } else {
                content_text_div.className = "post_content";
            }
        })
        return template.firstElementChild
    }

    var appendTitel;
    var appendPost;
    var appendPhoto;
    var photoUrl;
    var fotostatus;

    FYSCloud.API.queryDatabase(
        "SELECT idgebruiker, titel FROM forum_post"
    ).done(function (data) {
        var noOfTemplates = data.length;
        console.log(noOfTemplates)
        for (let i = 0; i < noOfTemplates; i++) {
            console.log(data[i])
            var postId = data[i]['idgebruiker'];
            FYSCloud.API.queryDatabase(
                "SELECT profiel_foto FROM gebruiker_profiel WHERE gebruikerid = ?",
                [data[i]['idgebruiker']]
            ).done(function (data) {
                console.log(data[0])
                if (data[0]["profiel_foto"] === "foto") {
                    photoUrl = "https://dev-is106-3.fys.cloud/uploads/" + postId + ".png";
                    fotostatus = true;
                    console.log("goed")
                } else {
                    console.log("fout")
                    fotostatus = false
                    photoUrl = "https://www.google.com/url?sa=i&url=https%3A%2F%2Funo.nl%2Fteam%2Fegwin-du-tour-2%2F&psig=AOvVaw1BG1swK6WE3oiFOuEHunT0&ust=1607011494851000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLD_y77Wr-0CFQAAAAAdAAAAABAJ";
                }
            }).fail(function (reason) {
                console.log(reason);
                console.log("fout");
            })

            appendPhoto = photoUrl;

            appendTitel = data[i]['titel']
            appendPost = data[i]['post']
            console.log(appendPost, appendTitel, appendPhoto,postId, fotostatus)
            let costumElement = makeAnElement(appendTitel, appendPost, appendPhoto,postId, fotostatus)
            nieuwePost.appendChild(costumElement);
        }
    }).fail(function (reason) {
        console.log(reason);
        console.log("fout");
    })
    // document.getElementById("profielFoto").setAttribute("src",
    //     "https://dev-is106-3.fys.cloud/uploads/" + sessionStorage.getItem("userId") + ".png");
    // console.log("src", "https://dev-is106-3.fys.cloud/uploads/" + sessionStorage.getItem("userId") + "test.png");


});
