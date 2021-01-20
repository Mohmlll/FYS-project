$(document).ready(function () {
    let userId = sessionStorage.getItem('userId');


    document.getElementById("volgorde").onchange = function () {
        let value = document.getElementById("volgorde").value
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
    }

    function tijdGeleden(oudeDatum) {
        let datum = new Date(Date.parse(oudeDatum))
        let datumNu = new Date()
        let datumVerschil = datumNu.getTime() - datum.getTime() + 3600000;

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
        return datumVerschil
    }

    let aantalRecords;
    let paginaAantal;
    let noOfTemplates = 5;

    FYSCloud.API.queryDatabase(
        "SELECT COUNT(*) FROM forum_post WHERE idgebruiker != ?",
        [userId]
    ).done(function (data) {
        aantalRecords = data[0]["COUNT(*)"];
        paginaAantal = aantalRecords / noOfTemplates;
    }).fail(function (reason) {
        console.log(reason);
    })
    let buttn = document.getElementById("expand_filterid");
    let filter = document.getElementById("forum_filter")

    buttn.addEventListener('click', (event) => {
        if (filter.className === "forum_topics__options") {
            filter.className += "block";
        } else {
            filter.className = "forum_topics__options";
        }
    })


    function paginationNr(paginanummer) {
        var paginaInt = parseInt(paginanummer)
        const paginanr = paginaInt + 1;
        document.getElementById("paginanr").innerHTML = "<b>" + paginanr + "</b>"
    }

    function pagina(kant) {
        let paginanummer = sessionStorage.getItem("pagina")
        if (paginanummer === null) {
            paginanummer = 0;
        }

        var paginaInt = parseInt(paginanummer)
        const paginanr = paginaInt + 1;
        document.getElementById("paginanr").innerHTML = "<b>" + paginanr + "</b>"
        if (kant === "left" && paginanummer > 0) {
            paginanummer--;
            sessionStorage.setItem("pagina", paginanummer)
            paginationNr(paginanummer);
            $("#template_div").load(document.URL + " #template_div")
            forum(sessionStorage.getItem("filter"))
        }

        if (kant === "right" && paginanummer < paginaAantal - 1) {
            paginanummer++;
            sessionStorage.setItem("pagina", paginanummer)
            paginationNr(paginanummer);
            $("#template_div").load(document.URL + " #template_div")
            forum(sessionStorage.getItem("filter"))

        }
    }

    paginationNr(0);
    $("#left_page").on("click", function () {
        pagina("left")
    })

    $("#right_page").on("click", function () {
        pagina("right")
    })


    function aantalBekijks(idPost, idforumPost) {
        FYSCloud.API.queryDatabase(
            "SELECT aantal_bekijks FROM forum_post WHERE idforum_post = ?",
            [idforumPost]
        ).done(function (data) {
            let bekijkAantal = data[0]["aantal_bekijks"] + 1;
            FYSCloud.API.queryDatabase(
                "UPDATE forum_post SET aantal_bekijks = ? WHERE idforum_post = ?",
                [bekijkAantal, idforumPost]
            ).done(function (data) {
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
        var nieuwePost = document.getElementById("template_div");
        var template;
        let volgorde = sessionStorage.getItem("volgorde");
        if (filter === null) {
            filter = ""
        }
        if (volgorde === null) {
            volgorde = "datum DESC"
        }

        if (volgorde === "datum DESC") {
            document.getElementById("nieuw_volgorde").selected = true;
        } else if (volgorde === "score DESC") {
            document.getElementById("aanbevolen_volgorde").selected = true;
        } else if (volgorde === "aantal_bekijks DESC") {
            document.getElementById("beste_volgorde").selected = true;
        }

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
                    content_text_div.className += "block";

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
            var backpacker = data[0]["backpacker"];
            var explorer = data[0]["explorer"];
            var sportieveling = data[0]["sportieveling"];
            var relaxer = data[0]["relaxer"];
            var partygoer = data[0]["partygoer"];
            var wintersport = data[0]["wintersport"];
            var tropisch = data[0]["tropisch"];
            var resort = data[0]["resort"];
            var noOfTemplates = 5;
            var paginaNummer = sessionStorage.getItem("pagina");

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
                + filter + " ORDER BY " + volgorde + " LIMIT " + (paginaNummer * noOfTemplates) + ", " + noOfTemplates,
                [backpacker, backpacker, explorer, explorer, sportieveling, sportieveling, relaxer, relaxer,
                    partygoer, partygoer, wintersport, wintersport, tropisch, tropisch, resort, resort, userId]
            ).done(function (data) {
                var noOfTemplates = data.length;
                for (let i = 0; i < noOfTemplates; i++) {
                    let postId = data[i]['idgebruiker'];
                    let idforumPost = data[i]["idforum_post"];
                    let photoUrl = window.location.protocol + "//" + window.location.host + "/uploads/" + postId + ".png";
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

                    let tagArray = [explorer, sportieveling, relaxer, partygoer, winterSport, tropisch, backpacker, resort];
                    let tagNaam = ["explorer", "sportieveling", "relaxer", "partygoer", "wintersport", "tropisch", "backpacker", "resort"];
                    appendTag = "";

                    for (let j = 0; j < tagArray.length; j++) {
                        if (tagArray[j] === 1) {
                            appendTag += " " + tagNaam[j] + " ";
                        }
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
    }


//Hier voeg ik een waarde toe aan de session storage zodat je alleen maar de resultaten van de DB terug krijgt, die voldoen aan jouw filter.
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

        let filterTagNaam = [explorer, sportieveling, relaxer, partygoer, backpacker, wintersport, tropisch, resort];
        let filterNaam = ["explorer", "sportieveling", "relaxer", "partygoer", "backpacker", "wintersport", "tropisch", "resort"];
        let filters = "";

        if (input !== "") {
            filters += " AND (post LIKE '%" + input + "%' OR titel LIKE '%" + input + "%')";
        }

        for (let i = 0; i < filterTagNaam.length; i++) {
            if (filterTagNaam[i]) {
                filters += " AND post_tags." + filterNaam[i] + " = 1";
            }
        }

        sessionStorage.setItem("zoekTekst", input)
        sessionStorage.setItem("filter", filters);
        $("#template_div").load(document.URL + " #template_div")
        sessionStorage.setItem("pagina", 0)
        forum(sessionStorage.getItem("filter"))
    }

    function filterChecked() {
        let filters = sessionStorage.getItem("filter");
        let input = sessionStorage.getItem("zoekTekst");
        if (filters !== null) {
            document.getElementById("zoekfunctie").setAttribute("value", input);
            let filterSelected = ["explorer", "sportieveling", "relaxer", "partygoer", "backpacker", "wintersport", "tropisch", "resort"];
            for (let i = 0; i < filterSelected.length; i++) {
                if (filters.includes(filterSelected[i])) {
                    document.getElementById("filter_" + filterSelected[i]).checked = true;
                }
            }
        }
    }

    filterChecked()
    let input = document.getElementById("zoekfunctie");
    input.addEventListener("keyup", function (zoeken) {
        if (zoeken.key === "Enter") {
            zoeken.preventDefault();
        }
    })

    $("#filteren").on("click", function (zoeken) {
        zoeken.preventDefault();
        filterForum()
    })
})
;
