import "../scss/messageBuilder.scss"
// Load Bootstrap init

import { initBootstrap } from "./bootstrap.js";

import Iconify from '@iconify/iconify';

// Loading bootstrap with optional features
initBootstrap({
    tooltip: true,
    popover: true,
    toasts: true,
});
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.js';

import "./import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";

window.$ = jQuery;
window.jQuery = jQuery;

import Application from "./Application.js";

$(document.addEventListener("DOMContentLoaded", function () {
    var app = new Application();
    var sec = document.getElementsByClassName("collapsible_security");
    var mes = document.getElementsByClassName("collapsible_message");
    var know = document.getElementsByClassName("collapsible_knowledge");
    sec[0].addEventListener("click", function () {
        this.classList.toggle("active_sec");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
    mes[0].addEventListener("click", function () {
        this.classList.toggle("active_mess");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
    know[0].addEventListener("click", function () {
        this.classList.toggle("active_knowledge");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });

    // hide knowledge shapes the sender does not know
    let knowledge = JSON.parse(sessionStorage.knowledge);
    for (const [key, value] of Object.entries(knowledge)) {
        let found = false;
        for (let i = 0; i < knowledge[key].length && !found; i++) {
            if (knowledge[key][i].knownBy.includes(sessionStorage.sender))
                found = true;
        }
        if (!found) {
            document.getElementById("layer_header_" + key).style.display = 'none';
        }

        // check also public keys
        if (key == "asymmetricPrivateKey") {
            found = false;
            for (let i = 0; i < knowledge[key].length && !found; i++) {
                if (knowledge[key][i].derivedPublicKey.knownBy.includes(sessionStorage.sender))
                    found = true;
            }
            if (!found) {
                document.getElementById("layer_header_asymmetricPublicKey").style.display = 'none';
            }
        }
    }

    // choose the receiver 
    var recDialog;
    $(function () {
        recDialog = new Modal(document.getElementById('modal-receiver'), {
            focus: true,
            backdrop: 'static',
            keyboard: false
        });
        document.getElementById("sender").innerHTML = sessionStorage.sender;
        let index = 0;
        switch (sessionStorage.sender) {
            case "Alice":
                index = 0;
                break;
            case "Bob":
                index = 1;
                break;
            case "Server":
                index = 2;
                break;
        }
        // prevent from sending to self
        document.getElementById("receiver").remove(index);
        recDialog.show();
    });

    // receiver chosen
    $(function () {
        $("#next").on('click', function (event) {
            let message = {};
            let messageArray = [];
            if (sessionStorage.message) {
                messageArray = JSON.parse(sessionStorage.message);

                // prevent the creation of empty messages (happens if the page is reloaded)
                while (messageArray.length && messageArray[messageArray.length - 1].messageName == "")
                    messageArray.pop();
                if (messageArray.length) {
                    Object.assign(message, messageArray[messageArray.length - 1]);
                    message.messageId++;
                }
                else
                    message.messageId = 0;
            }
            else {
                message.messageId = 0;
            }
            message.sender = sessionStorage.sender;
            var rec = document.getElementById("receiver");
            message.receiver = rec.options[rec.selectedIndex].text;
            sessionStorage.receiver = message.receiver;
            message.messageName = "";
            message.messageFields = [];
            messageArray.push(message);
            sessionStorage.message = JSON.stringify(messageArray);
            recDialog.hide();
        });
    });
}));