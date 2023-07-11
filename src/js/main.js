// Load Styles
import '../scss/main.scss';

import Iconify from '@iconify/iconify';

// Load Bootstrap init
import { initBootstrap } from "./bootstrap.js";

// Loading bootstrap with optional features
initBootstrap({
    tooltip: true,
    popover: true,
    toasts: true,
});

import "./import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";

window.$ = jQuery;
window.jQuery = jQuery;

// support for undo button
if (!sessionStorage.history)
    sessionStorage.history = "[]";

if (!sessionStorage.incomingMessage)
    sessionStorage.incomingMessage = "false";

if (!sessionStorage.showAttacker)
    sessionStorage.showAttacker = "false";
if (!sessionStorage.showServer)
    sessionStorage.showServer = "false";

import knowledgeFactoryModal from './knowledgeFactoryModal.js';
import PrincipalBuilder from './PrincipalBuilder.js'    // don't delete
import Principal from './actors/Principal.js';

//collapse or expand menu
const arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e) => {
        let arrowParent = e.currentTarget.parentElement.parentElement; //selecting main parent of arrow
        $(arrowParent).toggleClass(function () {
            return $(this).is('.hidemenu, .showmenu') ? 'hidemenu showmenu' : 'hidemenu';
        })
    });
}

// undo button
document.getElementById("undoButton").addEventListener("click", function () {
    let history = JSON.parse(sessionStorage.history);
    if (history.length) {
        let last = history.pop();

        switch (last.key) {
            // undo of add or remove knowledge
            case "knowledge":
                sessionStorage.knowledge = JSON.stringify(last.knowledge);
                break;

            // undo send message
            case "submitMessage":
                sessionStorage.result = JSON.stringify(last.result);

                let aux = JSON.parse(sessionStorage.message);
                aux.pop();
                sessionStorage.message = JSON.stringify(aux);

                aux = JSON.parse(sessionStorage.parsedMessages);
                aux.pop();
                sessionStorage.parsedMessages = JSON.stringify(aux);

                sessionStorage.incomingMessage = "false";
                break;

            // undo receive message
            case "openReception":
                sessionStorage.knowledge = JSON.stringify(last.knowledge);
                sessionStorage.incomingMessage = "true";
                break;
        }
        sessionStorage.history = JSON.stringify(history);
        location.reload();
    }
});

// setup knowledge
if (!sessionStorage.knowledge)
    sessionStorage.knowledge = JSON.stringify({
        "nonce": [],
        "idCertificate": [],
        "timestamp": [],
        "bitstring": [],
        "symmetricKey": [],
        "asymmetricPrivateKey": []
    });

// listener for knowledge
const htmlModalKnowledge = {
    "pub-key": "HTML_PUB_KEY", "priv-key": "HTML_PRIV_KEY", "symm-key": "HTML_SYMM_KEY",
    "nonce": "HTML_NONCE", "timestamp": "HTML_TIMESTAMP", "bitstring": "HTML_BITSTRING", "cert": "HTML_CERTIFICATE"
};
const addButton = document.querySelectorAll(".add");

if (!window.modalKnowledge) {
    window.modalKnowledge = new knowledgeFactoryModal();
    for (var i = 0; i < addButton.length; i++) {
        addButton[i].addEventListener("click", (e) => {
            let buttonClass = e.currentTarget.classList[1]; //selecting main parent of arrow
            window.modalKnowledge.click(htmlModalKnowledge[buttonClass]);
        });
    }
}

// listener to open and close the side bars
const sidebar = document.querySelector(".sidebar");
const sidebarBtnSend = document.querySelector(".sender-btn");
const sidebarBtnRec = document.querySelector(".receiver-btn");
const sidebarBtnAtk = document.querySelector(".attacker-btn");
const sidebarBtnServ = document.querySelector(".server-btn");

var userSelect = 0;

// open-close knowledge bar for sender
sidebarBtnSend.addEventListener("click", () => {
    var element = $(event.currentTarget);
    element.clicks = (element.clicks || 0) + 1;
    if (userSelect != 0) {
        userSelect = 0;
        element.clicks = 0;
        sidebarBtnSend.childNodes[1].classList.toggle("active");
        sidebarBtnRec.childNodes[1].classList.remove("active");
        sidebarBtnAtk.childNodes[1].classList.remove("active");
        sidebarBtnServ.childNodes[1].classList.remove("active");
        sidebar.classList.toggle("senderdb");
        sidebar.classList.remove("receiverdb");
        sidebar.classList.remove("attackerdb");
        sidebar.classList.remove("serverdb");
    } else {
        sidebar.classList.toggle("close");
    };
});

// open-close knowledge bar for receiver
sidebarBtnRec.addEventListener("click", () => {
    var element = $(event.currentTarget);
    element.clicks = (element.clicks || 0) + 1;
    if (userSelect != 1) {
        userSelect = 1;
        element.clicks = 0;

        sidebarBtnSend.childNodes[1].classList.remove("active");
        sidebarBtnRec.childNodes[1].classList.toggle("active");
        sidebarBtnAtk.childNodes[1].classList.remove("active");
        sidebarBtnServ.childNodes[1].classList.remove("active");

        sidebar.classList.remove("senderdb");
        sidebar.classList.toggle("receiverdb");
        sidebar.classList.remove("attackerdb");
        sidebar.classList.remove("serverdb");
    } else {
        sidebar.classList.toggle("close");
    };
});

// open-close knowledge bar for attacker
sidebarBtnAtk.addEventListener("click", () => {
    var element = $(event.currentTarget);
    element.clicks = (element.clicks || 0) + 1;
    if (userSelect != 2) {
        userSelect = 2;
        element.clicks = 0;
        sidebarBtnSend.childNodes[1].classList.remove("active");
        sidebarBtnRec.childNodes[1].classList.remove("active");
        sidebarBtnAtk.childNodes[1].classList.toggle("active");
        sidebarBtnServ.childNodes[1].classList.remove("active");

        sidebar.classList.remove("senderdb");
        sidebar.classList.remove("receiverdb");
        sidebar.classList.toggle("attackerdb");
        sidebar.classList.remove("serverdb");
    } else {
        sidebar.classList.toggle("close");
    };
});

// open-close knowledge bar for server
sidebarBtnServ.addEventListener("click", () => {
    var element = $(event.currentTarget);
    element.clicks = (element.clicks || 0) + 1;
    if (userSelect != 3) {
        userSelect = 3;
        element.clicks = 0;
        sidebarBtnSend.childNodes[1].classList.remove("active");
        sidebarBtnRec.childNodes[1].classList.remove("active");
        sidebarBtnAtk.childNodes[1].classList.remove("active");
        sidebarBtnServ.childNodes[1].classList.toggle("active");
        sidebar.classList.remove("senderdb");
        sidebar.classList.remove("receiverdb");
        sidebar.classList.remove("attackerdb");
        sidebar.classList.toggle("serverdb");
    } else {
        sidebar.classList.toggle("close");
    };
});

//show-hide Attacker
let checkedAtk = document.querySelector("#checkbox2");
checkedAtk.addEventListener('change', function () {
    if (this.checked) { // show
        sessionStorage.showAttacker = "true";
        sidebarBtnAtk.style.display = "block";
        window.Alice.translate('left');
        window.AttackerLeft = new Principal("AttackerLeft", window.canvas);
        window.AttackerLeft.setName("Attacker")
        if (sessionStorage.showServer == "true") {
            if (window.Server)
                window.Server.translate("right")
            window.AttackerRight = new Principal("AttackerRight", window.canvas)
            window.AttackerRight.setName("Attacker")
        }
        // split message arrows
        window.displayMessages();
    }
    else {  // hide
        sessionStorage.showAttacker = "false";
        sidebarBtnAtk.style.display = "none";
        window.AttackerLeft.setVisibility(false);

        // remove all knowledgeMarkAtk
        var marks_atk = window.canvas.getFigures().clone();
        for (let i = 0; i < marks_atk.getSize(); i++) {
            var element = marks_atk.get(i);
            if (element.NAME == 'KnowledgeMarkAtk')
                element.onRemove();
        }
        window.Alice.translate('right');

        if (window.Server) {
            window.AttackerRight.setVisibility(false);
            window.Server.translate('left');
        }
    }
});
checkedAtk.checked = sessionStorage.showAttacker == "true";

//show-hide server
let checkedServer = document.querySelector("#checkbox1");
checkedServer.addEventListener('change', function () {
    if (this.checked) {
        sessionStorage.showServer = "true";
        sidebarBtnServ.style.display = "block";
        // create the attacker right only if there is the left one, else it will be created twice
        if (sessionStorage.showAttacker == "true" && window.AttackerLeft) {
            window.AttackerRight = new Principal("AttackerRight", window.canvas)
            window.AttackerRight.setName("Attacker")
        }
        window.Server = new Principal("Server", window.canvas);
    } else {
        if (window.Server.lastKnowledgeMark()) {
            alert("Impossible to remove Server: actor already involved in a communication")
            this.checked = true;
        }
        else {
            sessionStorage.showServer = "false";
            sidebarBtnServ.style.display = "none";
            window.Server.setVisibility(false);
            if (sessionStorage.showAttacker == "true")
                window.AttackerRight.setVisibility(false)
        }
    }
});
checkedServer.checked = sessionStorage.showServer == "true";


function reset(cb) {
    var resetDialog = new bootstrap.Modal(document.getElementById('modal-close-new'), {
        focus: true,
        backdrop: 'static',
        keyboard: false
    });

    document.getElementById("Yes").addEventListener("click", e => {
        sessionStorage.clear();
        if (cb)
            cb()
        location.reload();
    });
    document.getElementById("No").addEventListener("click", (e) => {
        resetDialog.hide();
    });
    resetDialog.show();

}
// example management
import DiffieHellman from './examples/DiffieHellman.js';
document.getElementById("Diffie-Hellman").addEventListener("click", e => {
    reset(() => {
        sessionStorage.message = JSON.stringify(DiffieHellman.message);
        sessionStorage.parsedMessages = JSON.stringify(DiffieHellman.parsedMessages);
        sessionStorage.knowledge = JSON.stringify(DiffieHellman.knowledge);
    })
})

import NeedhamSchroeder from './examples/NeedhamSchroeder.js';
document.getElementById("Needham-Schroeder").addEventListener("click", e => {
    reset(() => {
        sessionStorage.message = JSON.stringify(NeedhamSchroeder.message);
        sessionStorage.parsedMessages = JSON.stringify(NeedhamSchroeder.parsedMessages);
        sessionStorage.knowledge = JSON.stringify(NeedhamSchroeder.knowledge);
        sessionStorage.showServer = "true";
    })
})

import NeedhamSchroederLowe from './examples/NeedhamSchroederLowe.js';
document.getElementById("Needham-Schroeder-Lowe").addEventListener("click", e => {
    reset(() => {
        sessionStorage.message = JSON.stringify(NeedhamSchroederLowe.message);
        sessionStorage.parsedMessages = JSON.stringify(NeedhamSchroederLowe.parsedMessages);
        sessionStorage.knowledge = JSON.stringify(NeedhamSchroederLowe.knowledge);
        sessionStorage.showServer = "true";
    })
})

// reset button
document.getElementById("newButton").addEventListener("click", function () {
    reset()
});