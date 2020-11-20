$(document).ready(function (qualifiedName, value) {

    var initialLanguage = "en";

    var translations = {
        homepage: {
            button: {
                nl: "Registreren",
                en: "Register"
            }
        },
    };

    FYSCloud.Localization.setTranslations(translations);
    FYSCloud.Localization.switchLanguage(initialLanguage);

    $("#localizationLanguageSwitch").val(initialLanguage);

    $("#localizationLanguageSwitch").on("change", function () {
        FYSCloud.Localization.switchLanguage($(this).val());
    });

    $("#localizationDynamicClick").on("click", function () {
        var template = $("#localizationDynamicTemplate").html();

        var element = $(template);

        $(".localizationSubheaderTarget").append(element);

        FYSCloud.Localization.translate();
    })
});