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

import "./import-jquery.js";
import "jquery-ui-bundle"; // you also need reader
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";

window.$ = jQuery;
window.jQuery = jQuery;

import ReceptionReader from "./ReceptionReader.js";
import ToolbarReception from "./ToolbarReception.js";

$(document.addEventListener("DOMContentLoaded", function () {
    {
        let history = JSON.parse(sessionStorage.history);
        if (history[history.length - 1].key != "openReception") {
            let knowledge = JSON.parse(sessionStorage.knowledge)
            history.push({
                "key": "openReception",
                "knowledge": knowledge
            });
            sessionStorage.history = JSON.stringify(history);
        }
    }

    let canvas = new draw2d.Canvas("canvas");
    let toolbar = new ToolbarReception("submit");   // create toolbar
    let messageArray = JSON.parse(sessionStorage.message);
    // get the last message
    let message = messageArray[messageArray.length - 1];
    let reader = new ReceptionReader();

    // find the message and create it
    let messageIndex = message.messageFields.findIndex(e => { return e.message });
    let messageShape = reader.createElementAndConnection(canvas, message, "Message");

    // loop message fields
    message.messageFields[messageIndex].message.forEach((element, i) => {
        // if it is a knowledge element
        if (!element.referenceId) {
            let simpleType = null;
            if (element.nonce)
                simpleType = "nonce";
            else if (element.idCertificate)
                simpleType = "idCertificate";
            else if (element.bitstring)
                simpleType = "bitstring";
            else if (element.symmetricKey)
                simpleType = "symmetricKey";
            else if (element.asymmetricPublicKey)
                simpleType = "asymmetricPublicKey";
            else if (element.asymmetricPrivateKey)
                simpleType = "asymmetricPrivateKey";
            else if (element.timestamp)
                simpleType = "timestamp";
            // create it
            reader.createElementAndConnection(canvas, message, simpleType, reader.getOutputPort(messageShape, i), { "keyValue": element[simpleType] });

            // find it in the knowledge
            let knowledge = JSON.parse(sessionStorage.knowledge);
            let field = null;
            if (simpleType != "asymmetricPublicKey")
                field = knowledge[simpleType].find(e => e.value == element[simpleType]);
            else {
                field = knowledge.asymmetricPrivateKey.find(e => e.derivedPublicKey.value == element[simpleType]);
                field = field.derivedPublicKey;
            }
            // and add it to the receiver
            if (!field.knownBy.includes(message.receiver))
                field.knownBy.push(message.receiver);
            // and also to the attacker since it is not encrypted
            if (!field.knownBy.includes("Attacker"))
                field.knownBy.push("Attacker");
            sessionStorage.knowledge = JSON.stringify(knowledge);
        }
        else {
            // a function is referenced
            let funcIndex = message.messageFields.findIndex(e => { return element.referenceId == e.id });
            let funcShape = message.messageFields[funcIndex];
            let funcInfo = {
                "referenceId": element.referenceId, // message[shapeIndex].referenceId
                "targetIndex": funcIndex,    // index of the shape connected to messageIndex port in message
                "securityConcept": funcShape.securityConcept || "Group", // message[shapeIndex].securityConcept
                "encryptedData": false   // if true info are not crypted, so the Attacker will get them
            };

            let found = true;
            if (["asymmetricEncryption", "symmetricEncryption", "signature", "mac"].includes(funcShape.securityConcept)) {
                let funcKey = "";
                if (funcShape.securityConcept == "signature")
                    funcKey = "signatureKey"
                else if (funcShape.securityConcept == "mac")
                    funcKey = "authenticationKey"
                else
                    funcKey = "encryptionKey";

                // check if the receiver knows the key to decrypt
                for (const [key, value] of Object.entries(funcShape[funcKey])) {
                    // for loops only once
                    let knowledge = JSON.parse(sessionStorage.knowledge);
                    let otherKey = null;
                    switch (funcShape.securityConcept) {
                        case "asymmetricEncryption":
                            otherKey = (knowledge.asymmetricPrivateKey.find(e => { return (e.derivedPublicKey.value == value) }));
                            found = otherKey.knownBy.includes(message.receiver);
                            if (found)
                                funcInfo.keyValue = otherKey.value;
                            break;
                        case "symmetricEncryption":
                            found = (knowledge.symmetricKey.findIndex(e => { return (e.value == value && e.knownBy.includes(message.receiver)) }) != -1);
                            break;
                        case "signature":
                            otherKey = (knowledge.asymmetricPrivateKey.find(e => { return (e.value == value) }));
                            found = otherKey.derivedPublicKey.knownBy.includes(message.receiver);
                            if (found)
                                funcInfo.keyValue = otherKey.derivedPublicKey.value;
                            break;
                        case "mac":
                            found = (knowledge.symmetricKey.findIndex(e => { return (e.value == value && e.knownBy.includes(message.receiver)) }) != -1);
                            break;
                        default:
                            found = false
                            break;
                    }
                }
            }

            if (!found) {
                funcInfo.name = funcShape.securityConcept + ": no valid key found";
            }
            else if (funcShape.knowledgeGroup) {
                funcInfo.name = "Group: Split";
                funcInfo.encryptedData = true;
            }
            else if (funcShape.securityConcept == "hash" || funcShape.securityConcept == "mac") {
                funcInfo.name = funcShape.securityConcept + ": Verify";
            }
            else if (["asymmetricEncryption", "symmetricEncryption", "signature"].includes(funcShape.securityConcept)) {
                funcInfo.name = funcShape.securityConcept + ": Decrypt";
            }

            // set the menu for extraction
            let sourcePort = reader.getOutputPort(messageShape, i);
            messageShape.children.data[1].figure.children.data[i].figure.on("contextmenu", function ExtractionMenu(emitter, event) {
                $.contextMenu({
                    selector: 'body',
                    events:
                    {
                        hide: function () { $.contextMenu('destroy'); }
                    },
                    callback: $.proxy(function (key, options) {
                        switch (key) {
                            case "apply":
                                // execute message unfold
                                if (found)
                                    reader.contextMenu(canvas, message, funcInfo.securityConcept, sourcePort, funcInfo, reader);
                                break;
                            default:
                                break;
                        }
                    }, reader),
                    x: event.x,
                    y: event.y,
                    items: {
                        "apply": { "name": funcInfo.name }
                    }
                });
            });
        }
    });
}));