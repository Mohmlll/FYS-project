$(document).ready(function () {
    console.log(sessionStorage.getItem("userId"));

        var noOfTemplates = 5;
        var nieuwePost = document.getElementById("forum_main_id");
        var template;


        function makeAnElement(text1, text2){
            template = document.importNode(document.getElementById("post_template").content, true);
            template.getElementById("post").innerText = text1;
            template.getElementById("post_profiel_img").innerText = text2;
            template.getElementById("post_content").innerText = text2;
            return template.firstElementChild
        }

        var customElement;
        for (var i = 0; i < noOfTemplates; i++){

            nieuwePost.appendChild(customElement)
        }

});