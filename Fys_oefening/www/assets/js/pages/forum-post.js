$(document).ready(function () {
    let userId = sessionStorage.getItem('userId');
    console.log(userId);


    document.getElementById("volgorde").onchange = function () {
        let value = document.getElementById("volgorde").value
        console.log(value)
        if (value === "nieuw_volgorde") {
            sessionStorage.setItem("volgorde", "datum DESC")
            location.reload()
        } else if (value === "aanbevolen_volgorde") {
            sessionStorage.setItem("volgorde", "score DESC")
            location.reload()
        } else if (value === "beste_volgorde") {
            sessionStorage.setItem("volgorde", "post")
            location.reload()
        } else {
            console.log("Error")
        }
        console.log(sessionStorage.getItem("volgorde"))
    }

    //dit is een functie waarbij een template elke keer gevuld wordt in een loop.
    //als je een filter aan heb staan, wordt die meegegeven en daardoor komen alleen de resultaten terug die voldoen aan jouw filter
    function forum(filter) {
        var nieuwePost = document.getElementById("forum_main_id");
        var template;
        let volgorde = sessionStorage.getItem("volgorde");
        if (filter === null) {
            filter = ""
        }
        if (volgorde === null) {
            volgorde = "datum DESC"
        }

        let selectVolgorde = sessionStorage.getItem("volgorde")
        if (selectVolgorde === "datum DESC") {
            document.getElementById("nieuw_volgorde").selected = true;
        } else if (selectVolgorde === "score DESC") {
            document.getElementById("aanbevolen_volgorde").selected = true;
        } else if (selectVolgorde === "post") {
            document.getElementById("beste_volgorde").selected = true;
        }
        console.log(selectVolgorde)

        function makeAnElement(titel, content, foto, postId, tag, date) {
            template = document.importNode(document.getElementById("post_template").content, true);
            let post_header_titel = template.getElementById("post_header_titel");
            template.getElementById("post_profiel_img").src = foto;
            let content_date = template.getElementById("post_date");
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

            content_date.innerHTML = date
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
        let appendPostId;
        let appendTag = document.getElementById("tags");
        let tags = "";
        let appendDate;

        FYSCloud.API.queryDatabase(
            "SELECT * FROM interesse WHERE idgebruiker = ?",
            [sessionStorage.getItem("userId")]
        ).done(function (data) {
            console.log(data);
            var backpacker = data[0]["backpacker"];
            var explorer = data[0]["explorer"];
            var sportieveling = data[0]["sportieveling"];
            var relaxer = data[0]["relaxer"];
            var partygoer = data[0]["partygoer"];
            var wintersport = data[0]["wintersport"];
            var tropisch = data[0]["tropisch"];
            var resort = data[0]["resort"];
            var noOfTemplates = 5;

            FYSCloud.API.queryDatabase(
                "SELECT forum_post.idgebruiker, titel, post, datum, post_tags.explorer, post_tags.sportieveling, " +
                "post_tags.relaxer, post_tags.partygoer, post_tags.wintersport, post_tags.tropisch, post_tags.backpacker, " +
                "post_tags.resort , (if(post_tags.explorer = 0 AND post_tags.sportieveling = 0 AND " +
                "post_tags.relaxer = 0 AND post_tags.partygoer = 0 AND post_tags.wintersport = 0 AND post_tags.tropisch = 0 AND post_tags.backpacker = 0 AND " +
                "post_tags.resort = 0, -10, 10) + " +
                "if(post_tags.backpacker = ?, 1, 0) +       if(post_tags.backpacker = ? AND post_tags.backpacker = 1, 10, 0) + " +
                "if(post_tags.explorer = ?, 1, 0) +         if(post_tags.explorer = ? AND post_tags.explorer = 1, 10, 0) +" +
                "if(post_tags.sportieveling = ?, 1, 0) +    if(post_tags.sportieveling = ? AND post_tags.sportieveling = 1, 10, 0) + " +
                "if(post_tags.relaxer = ?, 1, 0) +          if(post_tags.relaxer = ? AND post_tags.relaxer = 1, 10, 0) + " +
                "if(post_tags.partygoer = ?, 1, 0) +        if(post_tags.partygoer = ? AND post_tags.partygoer = 1, 10, 0) + " +
                "if(post_tags.wintersport = ?, 1, 0) +      if(post_tags.wintersport = ? AND post_tags.wintersport = 1, 10, 0) + " +
                "if(post_tags.tropisch = ?, 1, 0) +         if(post_tags.tropisch = ? AND post_tags.tropisch = 1, 10, 0) + " +
                "if(post_tags.resort = ?, 1, 0) +           if(post_tags.resort = ? AND post_tags.resort = 1, 10, 0)) " +
                "as score FROM interesse " +
                "JOIN gebruiker ON (idgebruiker = gebruikerid) " +
                "JOIN forum_post ON (forum_post.idgebruiker = interesse.idgebruiker) " +
                "JOIN post_tags ON (forum_post.idforum_post = post_tags.idforum_post) " +
                "WHERE interesse.idgebruiker != ?"
                + filter + " ORDER BY " + volgorde,
                [backpacker, backpacker, explorer, explorer, sportieveling, sportieveling, relaxer, relaxer,
                    partygoer, partygoer, wintersport, wintersport, tropisch, tropisch, resort, resort, sessionStorage.getItem("userId")]
            ).done(function (data) {
                var noOfTemplates = data.length;
                console.log(noOfTemplates)
                console.log(data)
                for (let i = 0; i < noOfTemplates; i++) {
                    let postId = data[i]['idgebruiker'];
                    let photoUrl = "https://dev-is106-3.fys.cloud/uploads/" + postId + ".png";
                    appendTitel = data[i]['titel'];
                    appendPost = data[i]['post'];
                    appendPostId = postId;
                    var explorer = data[i]["explorer"];
                    var sportieveling = data[i]["sportieveling"];
                    var relaxer = data[i]["relaxer"];
                    var partygoer = data[i]["partygoer"];
                    var winterSport = data[i]["wintersport"];
                    var tropisch = data[i]["tropisch"];
                    var backpacker = data[i]["backpacker"];
                    var resort = data[i]["resort"];

                    appendTag = "";
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
                        appendTag += " wintersport ";
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
                    console.log(appendTag)
                    if (appendTag.includes("null")) {
                        tags = appendTag.replace("null ", "")
                    } else {
                        tags = appendTag;
                    }

                    let img = new Image();
                    img.src = photoUrl;
                    appendDate = data[i]["datum"];
                    console.log(appendDate);
                    let costumElement = makeAnElement(appendTitel, appendPost, photoUrl, appendPostId, tags, appendDate);
                    nieuwePost.appendChild(costumElement);
                    appendTag = "";
                }
                appendTag = "";
            }).fail(function (reason) {
                console.log(reason);
                console.log("fout");
            })
        }).fail(function (reason) {
            console.log(reason);
        })


        var img = new Image()
        img.src = "https://dev-is106-3.fys.cloud/uploads/133.png"
        console.log("height = " + img.height);
    }

    //Hier voeg ik een waarde toe aan de session storage zodat je alleen maar de resultaten van de DB terug krijgt, die voldoen aan jouw filter.
    console.log(sessionStorage.getItem("filter"))
    forum(sessionStorage.getItem("filter"))
    $("#filter_all").on("click", function () {
        sessionStorage.setItem("filter", "")
        location.reload()
    })
    $("#filter_volgend").on("click", function () {
        sessionStorage.setItem("filter", "")
        location.reload()
    })
    $("#filter_explorer").on("click", function () {
        sessionStorage.setItem("filter", " AND post_tags.explorer = 1")
        location.reload()
    })
    $("#filter_sportieveling").on("click", function () {
        sessionStorage.setItem("filter", " AND post_tags.sportieveling = 1")
        location.reload()
    })
    $("#filter_relaxer").on("click", function () {
        sessionStorage.setItem("filter", " AND post_tags.relaxer = 1")
        location.reload()
    })
    $("#filter_partygoer").on("click", function () {
        sessionStorage.setItem("filter", " AND post_tags.partygoer = 1")
        location.reload()
    })
    $("#filter_backpacker").on("click", function () {
        sessionStorage.setItem("filter", " AND post_tags.backpacker = 1")
        location.reload()
    })
    $("#filter_wintersport").on("click", function () {
        sessionStorage.setItem("filter", " AND post_tags.wintersport = 1")
        location.reload()
    })
    $("#filter_tropisch").on("click", function () {
        sessionStorage.setItem("filter", " AND post_tags.tropisch = 1")
        location.reload()
    })
    $("#filter_resort").on("click", function () {
        sessionStorage.setItem("filter", " AND post_tags.resort = 1")
        location.reload()
    })

    var img = new Image()
    img.src = "https://dev-is106-3.fys.cloud/uploads/133.png"
    console.log("height = " + img.height);

});
