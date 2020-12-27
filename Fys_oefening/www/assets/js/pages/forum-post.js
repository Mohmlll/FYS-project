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
            sessionStorage.setItem("volgorde", "aantal_bekijks DESC")
            location.reload()
        } else {
            console.log("Error")
        }
        console.log(sessionStorage.getItem("volgorde"))
    }

    function tijdGeleden(oudeDatum) {
        let datum = new Date(Date.parse(oudeDatum))
        let datumNu = new Date()
        let datumVerschil = datumNu.getTime() - datum.getTime() + 3600000;
        console.log(datumVerschil)

        if (datumVerschil < 1000) {
            return 'Nu';
        }

        let sec = datumVerschil / 1000;

        if (sec < 60) {
            return Math.floor(sec) + ' seconden geleden';
        }

        let min = sec / 60;
        if (min < 60) {
            if (min < 2) {
                return Math.floor(min) + ' minuut geleden';
            } else {
                return Math.floor(min) + ' minuten geleden';
            }
        }

        let uur = min / 60;
        if (uur < 24) {
            return Math.floor(uur) + ' uur geleden';
        }

        let dag = uur / 24;
        if (dag < 7) {
            if (dag < 2) {
                return Math.floor(dag) + ' dag geleden';
            } else {
                return Math.floor(dag) + ' dagen geleden';
            }
        }

        let week = dag / 7;
        if (week < 52.1429 / 12) {
            if (week < 2) {
                return Math.floor(week) + ' week geleden';
            } else {
                return Math.floor(week) + ' weken geleden';
            }
        }

        let maand = week / 52.1429 * 12;
        if (maand < 12) {
            if (maand < 2) {
                return Math.floor(maand) + ' maand geleden';
            } else {
                console.log(maand)
                return Math.floor(maand) + ' maanden geleden';
            }
        }

        let jaar = maand / 12;
        if (jaar) {
            if (jaar < 2) {
                return Math.floor(jaar) + ' jaar geleden';
            } else {
                return Math.floor(jaar) + ' jaaren geleden';
            }

        }

        console.log(datumVerschil)
        return datumVerschil
    }

    function aantalBekijks(idPost, idforumPost) {
        console.log(idPost)
        FYSCloud.API.queryDatabase(
            "SELECT aantal_bekijks FROM forum_post WHERE idforum_post = ?",
            [idforumPost]
        ).done(function (data) {
            console.log(data);
            let bekijkAantal = data[0]["aantal_bekijks"] + 1;
            FYSCloud.API.queryDatabase(
                "UPDATE forum_post SET aantal_bekijks = ? WHERE idforum_post = ?",
                [bekijkAantal, idforumPost]
            ).done(function (data) {
                console.log(data);
                FYSCloud.URL.redirect("profiel.html", {
                    id: idPost
                })
            }).fail(function (reason) {
                console.log(reason);
            });
        }).fail(function (reason) {
            console.log(reason);
        });
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
        } else if (selectVolgorde === "aantal_bekijks DESC") {
            document.getElementById("beste_volgorde").selected = true;
        }
        console.log(selectVolgorde)

        function makeAnElement(titel, content, foto, postId, tag, date, idforumPost, voornaam) {
            template = document.importNode(document.getElementById("post_template").content, true);
            let post_header_titel = template.getElementById("post_header_titel");
            template.getElementById("post_profiel_img").src = foto;
            let content_date = template.getElementById("post_date");
            let content_naam = template.getElementById("voornaam_post");
            let content_text_div = template.getElementById("post_content");
            let content_text = template.getElementById("content_text");
            let content_tag = template.getElementById("tags");
            let btn = template.getElementById("post_header");
            let contact_button = template.getElementById("contact_verzoek_button");
            contact_button.addEventListener('click', (event) => {
                aantalBekijks(postId, idforumPost)
            })
            let post_profiel_foto = template.getElementById("post_profiel_foto");
            post_profiel_foto.addEventListener('click', (event) => {
                aantalBekijks(postId, idforumPost)
            })
            content_date.innerHTML = date
            post_header_titel.innerHTML = titel
            content_text.innerHTML = content
            content_tag.innerHTML = tag
            content_naam.innerHTML = voornaam


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
        let appendVoornaam;


        FYSCloud.API.queryDatabase(
            "SELECT * FROM interesse WHERE idgebruiker = ?",
            [userId]
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
                "SELECT voornaam, forum_post.idgebruiker, forum_post.idforum_post, titel, post, datum, post_tags.explorer, post_tags.sportieveling, " +
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
                "JOIN gebruiker_profiel ON (gebruiker_profiel.gebruikerid = interesse.idgebruiker) " +
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
                    let idforumPost = data[i]["idforum_post"];
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
                    if (appendTag.includes("null")) {
                        tags = appendTag.replace("null ", "")
                    } else {
                        tags = appendTag;
                    }
                    appendVoornaam = data[i]['voornaam'];

                    let img = new Image();
                    img.src = photoUrl;
                    appendDate = data[i]["datum"];
                    let tijd = tijdGeleden(appendDate)
                    let costumElement = makeAnElement(appendTitel, appendPost, photoUrl, appendPostId, tags, tijd, idforumPost, appendVoornaam);
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
    function filterForum() {
        sessionStorage.setItem("zoekTekst", null)
        sessionStorage.setItem("filter", "")

        let input = document.getElementById("zoekfunctie").value;
        let explorer = document.getElementById("filter_explorer").checked;
        let sportieveling = document.getElementById("filter_sportieveling").checked;
        let relaxer = document.getElementById("filter_relaxer").checked;
        let partygoer = document.getElementById("filter_partygoer").checked;
        let backpacker = document.getElementById("filter_backpacker").checked;
        let wintersport = document.getElementById("filter_wintersport").checked;
        let tropisch = document.getElementById("filter_tropisch").checked;
        let resort = document.getElementById("filter_resort").checked;

        let filters = "";

        console.log(input)
        if (input !== "") {
            filters += " AND (post LIKE '%" + input + "%' OR titel LIKE '%" + input + "%')";
        }
        if (explorer) {
            filters += " AND post_tags.explorer = 1";
        }
        if (sportieveling) {
            filters += " AND post_tags.sportieveling = 1";
        }
        if (relaxer) {
            filters += " AND post_tags.relaxer = 1";
        }
        if (partygoer) {
            filters += " AND post_tags.partygoer = 1";
        }
        if (backpacker) {
            filters += " AND post_tags.backpacker = 1";
        }
        if (wintersport) {
            filters += " AND post_tags.wintersport = 1";
        }
        if (tropisch) {
            filters += " AND post_tags.tropisch = 1";
        }
        if (resort) {
            filters += " AND post_tags.resort = 1";
        }
        console.log(filters);
        sessionStorage.setItem("zoekTekst", input)
        sessionStorage.setItem("filter", filters);
        location.reload()
    }

    function filterChecked() {
        let filters = sessionStorage.getItem("filter");
        let input = sessionStorage.getItem("zoekTekst");

        document.getElementById("zoekfunctie").setAttribute("value", input);
        if (filters.includes("explorer")) {
            document.getElementById("filter_explorer").checked = true;
        }
        if (filters.includes("sportieveling")) {
            document.getElementById("filter_sportieveling").checked = true;
        }
        if (filters.includes("relaxer")) {
            document.getElementById("filter_relaxer").checked = true;
        }
        if (filters.includes("partygoer")) {
            document.getElementById("filter_partygoer").checked = true;
        }
        if (filters.includes("backpacker")) {
            document.getElementById("filter_backpacker").checked = true;
        }
        if (filters.includes("wintersport")) {
            document.getElementById("filter_wintersport").checked = true;
        }
        if (filters.includes("tropisch")) {
            document.getElementById("filter_tropisch").checked = true;
        }
        if (filters.includes("resort")) {
            document.getElementById("filter_resort").checked = true;
        }
    }

    filterChecked()
    let input = document.getElementById("zoekfunctie");
    input.addEventListener("keyup", function (zoeken) {
        if (zoeken.key === "Enter") {
            zoeken.preventDefault();
            console.log(input.value)
        }
    })

    $("#filteren").on("click", function (zoeken) {
        zoeken.preventDefault();
        console.log(input.value)
        filterForum()
    })
    console.log(sessionStorage.getItem("filter"))

    var img = new Image()
    img.src = "https://dev-is106-3.fys.cloud/uploads/133.png"
    console.log("height = " + img.height);

});
