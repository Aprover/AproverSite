export default Class.extend({

    NAME: "Parser",

    init: function () {
        if (!sessionStorage.parsedMessages)
            sessionStorage.parsedMessages = "[]";
        this.message = "";
    },

    setMessage: function (message) {
        this.message = message;
        document.getElementById("toolbar_message_preview").innerHTML = message;
    }
});