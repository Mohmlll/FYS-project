$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));

    import{postId} from '.profiel.js'
    FYSCloud.API.queryDatabase(
        "SELECT profiel_foto, voornaam, achternaam, geslacht, DATE (geboorte_datum), woonplaats, telefoon_nummer, interesse, bio FROM gebruiker_profiel WHERE gebruikerid = ?",
        [161]
    ).done(function (data) {
        console.log(data)
        let datum = data[0]["DATE (geboorte_datum)"];
        datum = datum.slice(0, 10);
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



});