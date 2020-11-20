$(document).ready(function (qualifiedName, value) {

    $(".tag_div label").click(function (tag) {
        tag.preventDefault();
        $(this).find("i").toggleClass("fas fa-plus fas fa-check");


    })

});

