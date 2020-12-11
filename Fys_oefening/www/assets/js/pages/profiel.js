$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));
    var profielId = FYSCloud.URL.queryString("id", 0);
    console.log(profielId);
    FYSCloud.API.queryDatabase(
        "SELECT profiel_foto, voornaam, achternaam, geslacht, DATE (geboorte_datum), woonplaats, telefoon_nummer, interesse, bio FROM gebruiker_profiel WHERE gebruikerid = ?",
        [profielId]
    ).done(function (data) {
        console.log(data)
        let datum = data[0]["DATE (geboorte_datum)"];
        datum = datum.slice(0, 10);
        if (profielId !== null) {
            document.getElementById("profielFoto").setAttribute("src", "https://dev-is106-3.fys.cloud/uploads/" + profielId + ".png");
            console.log("src", "https://dev-is106-3.fys.cloud/uploads/" + profielId + ".png");
        }

        document.getElementById("profiel_input_voornaam").setAttribute("placeholder", data[0]["voornaam"]);
        document.getElementById("profiel_input_achternaam").setAttribute("placeholder", data[0]["achternaam"]);
        document.getElementById("profiel_input_geslacht").setAttribute("placeholder", data[0]["geslacht"]);
        document.getElementById("profiel_input_geboortedatum").setAttribute("placeholder", datum);
        document.getElementById("profiel_input_woonplaats").setAttribute("placeholder", data[0]["woonplaats"]);
        document.getElementById("profiel_input_telefoonnr").setAttribute("placeholder", data[0]["telefoon_nummer"]);
        document.getElementById("profiel_input_bio").setAttribute("placeholder", data[0]["bio"]);
    }).fail(function (reason) {
        console.log(reason);
        console.log("fout");
    })

    FYSCloud.API.queryDatabase(
        "SELECT * FROM interesse WHERE idgebruiker = ?",
        [profielId]
    ).done(function (data) {
        console.log(data);
        console.log(data[0])
        $(".tag_div").hide();
        if (data[0]["backpacker"] === 1) {
            document.getElementById("tag_backpacker").checked = true;
            document.getElementById("backpacker").style.display = "block";
        }
        if (data[0]["explorer"] === 1) {
            document.getElementById("tag_explorer").checked = true;
            document.getElementById("explorer").style.display = "block";
        }
        if (data[0]["sportieveling"] === 1) {
            document.getElementById("tag_sportieveling").checked = true;
            document.getElementById("sportieveling").style.display = "block";
        }
        if (data[0]["relaxer"] === 1) {
            document.getElementById("tag_relaxer").checked = true;
            document.getElementById("relaxer").style.display = "block";
        }
        if (data[0]["partygoer"] === 1) {
            document.getElementById("tag_partygoer").checked = true;
            document.getElementById("partygoer").style.display = "block";
        }
        if (data[0]["wintersport"] === 1) {
            document.getElementById("tag_wintersport").checked = true;
            document.getElementById("wintersport").style.display = "block";
        }
        if (data[0]["tropisch"] === 1) {
            document.getElementById("tag_tropisch").checked = true;
            document.getElementById("tropisch").style.display = "block";
        }
        if (data[0]["resort"] === 1) {
            document.getElementById("tag_resort").checked = true;
            document.getElementById("resort").style.display = "block";
        }
    }).fail(function (reason) {
        console.log(reason);
    })

});