/* Create Principals and connections */

import "./import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";
import Principal from "./actors/Principal.js";
import KnowledgeMark from "./actors/KnowledgeMark.js";
import KnowledgeMarkAtk from "./actors/KnowledgeMarkAtk.js";
import InterceptorPolicy from "./policy/InterceptorPolicy.js"

window.canvas = null;
window.Alice = null;
window.Bob = null;
window.Server = null;
window.AttackerLeft = null;
window.AttackerRight = null;

// create arrow with message ontop
window.createConnection = function (sourcePort, targetPort, data) {
    var arrow = new draw2d.decoration.connection.ArrowDecorator();
    arrow.setDimension(15, 12);
    arrow.setBackgroundColor("#191919");
    var conn = new draw2d.Connection({
        router: new draw2d.layout.connection.InteractiveManhattanConnectionRouter(),
        targetDecorator: arrow,
        stroke: 2,
        color: "#191919",
        radius: 10,
        outlineColor: "#191919",
        source: sourcePort,
        target: targetPort
    });

    // message shown on the arrow
    if (data) {
        let fontSize = 15
        let fontSizeSub = 10 // for subscript
        // function to create text tag
        const text = function (x, sub = false) {
            let t = '<text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" '
            if (sub) { // subscript
                t += 'font-size="' + fontSizeSub + '" '
                t += 'y="7"'
            }
            else {
                t += 'font-size="' + fontSize + '" '
                t += 'y="0"'
            }
            t += 'x="' + x + '"'
            t += ' stroke="#000" fill="#000000">'
            return t
        }
        let msg = ''
        let x = 0   // x coordinate
        // replace "<sub>txt</sub>" with a text section for subscript
        data = data.split("<sub>")
        for (let i = 0; i < data.length; i++) {
            if (i > 0) { // if you find a "</sub>", there is a subscript
                let aux = data[i].split("</sub>")
                msg += text(x, true) + aux[0] + "</text>"
                x += aux[0].length * fontSizeSub / 1.5
                msg += text(x) + aux[1] + "</text>"
                x += aux[1].length * fontSize / 2.2
            }
            else { // the first cannot be subscript
                msg += text(x) + data[i] + "</text>"
                x += data[i].length * fontSize / 2.2
            }
        }
        if (x > (window.canvas.getWidth() / 5 - 50))
            x = window.canvas.getWidth() / 5 - 50
        msg = '<svg width="' + x + '" height="20" xmlns="http://www.w3.org/2000/svg">' + msg + '</svg>'
        let svgMsg = new draw2d.SVGFigure();
        svgMsg.setSVG(msg)
        conn.add(svgMsg, new draw2d.layout.locator.ParallelMidpointLocator());
    }

    // since version 3.5.6
    //
    conn.on("dragEnter", function (emitter, event) {
        conn.attr({
            outlineStroke: 2
        });
    });
    conn.on("dragLeave", function (emitter, event) {
        conn.attr({
            outlineStroke: 0
        });
    });

    return conn;
};

// create all the message connections
window.displayMessages = function () {
    // delete all messages
    var messages = window.canvas.getLines().clone();
    for (let i = 0; i < messages.getSize(); i++) {
        var element = messages.get(i);
        if (element.NAME != 'TimeLinePrincipal')
            window.canvas.remove(element)
    }
    // create the first mark for Alice
    let markType = 'init'
    let initVbus = new KnowledgeMark($.extend({ portConfig: markType, sender: window.Alice, receiver: window.Alice }));
    initVbus.getPorts().get(0).setVisible(true);
    window.Alice.addKnowledgeMark(initVbus);

    // if there were messages, create the connections
    if (sessionStorage.message) {
        let messageArray = JSON.parse(sessionStorage.message);

        let parsedMessages; // text to be shown on the connections
        if (sessionStorage.parsedMessages)
            parsedMessages = JSON.parse(sessionStorage.parsedMessages);

        let initVbus1;  // target mark
        let connection;
        let attacker = sessionStorage.showAttacker == "true"
        let markAtkInfo = {}
        for (let i = 0; i < messageArray.length; i++) {
            switch (messageArray[i].receiver) {
                case "Alice":
                    markType = "Alice";
                    if (attacker)
                        markAtkInfo = {
                            "type": 0,  // left to right
                            "position": window.AttackerLeft.getTimeLineUpX() - 5
                        }
                    break;

                case "Bob":
                    // knowledge mark type
                    if (messageArray[i].sender == "Alice")
                        markType = "AliceBob";
                    else
                        markType = "ServerBob";
                    // if there are more messages
                    if (messageArray.length > i + 1 && messageArray[i + 1].receiver == "Alice")
                        markType += "Alice";
                    else
                        markType += "Server";

                    if (markType == "AliceBob" || markType == "AliceBobAlice")
                        markType = "Server";
                    else if (markType == "ServerBob" || markType == "ServerBobServer")
                        markType = "Alice";

                    // attacker knowledge mark type
                    if (attacker) {
                        if (messageArray[i].sender == "Alice")
                            markAtkInfo = {
                                "type": 1,
                                "position": window.AttackerLeft.getTimeLineUpX() - 5
                            }
                        else if (messageArray[i].sender == "Server")
                            markAtkInfo = {
                                "type": 0,
                                "position": window.AttackerRight.getTimeLineUpX() - 5
                            }
                    }
                    break;

                case "Server":
                    markType = "Server";
                    if (attacker)
                        markAtkInfo = {
                            "type": 1,  // right to left
                            "position": window.AttackerRight.getTimeLineUpX() - 5
                        }
                    break;

                default:
                    break;
            }
            // target mark
            initVbus1 = new KnowledgeMark($.extend({ portConfig: markType, sender: window[messageArray[i].sender], receiver: window[messageArray[i].receiver] }));
            window[messageArray[i].receiver].addKnowledgeMark(initVbus1);
            if (i == 0)
                connection = createConnection(initVbus.getPorts().get(0), initVbus1.getPorts().get(0), parsedMessages[i]);
            else
                connection = createConnection(initVbus.getPorts().get(1), initVbus1.getPorts().get(0), parsedMessages[i]);
            window.canvas.add(connection);
            // add attacker mark
            if (attacker) {
                let markAtk = new KnowledgeMarkAtk($.extend({ messageNumb: markAtkInfo.type }));
                window.canvas.add(markAtk, markAtkInfo.position, initVbus.getBottomY() - 10);
                // split the connection at attacker mark
                markAtk.onDrop(connection, markAtk.getAbsoluteX(), markAtk.getAbsoluteY(), false, false, i);
            }
            // initVbus is always the source
            initVbus = Object.assign(initVbus1);
            initVbus1 = null;
        }
        sessionStorage.message = JSON.stringify(messageArray);
    }
};

$(window.addEventListener("DOMContentLoaded", function () {
    // create the canvas for the user interaction
    window.canvas = new draw2d.Canvas("gfx_holder");
    window.canvas.uninstallEditPolicy(new draw2d.policy.canvas.WheelZoomPolicy());

    window.canvas.installEditPolicy(new draw2d.policy.connection.DragConnectionCreatePolicy({ createConnection: createConnection }));
    window.canvas.installEditPolicy(new InterceptorPolicy());
    window.canvas.installEditPolicy(new draw2d.policy.canvas.CoronaDecorationPolicy());

    // create and add two nodes which contains Ports (In and OUT)
    window.Alice = new Principal("Alice", window.canvas);
    window.Bob = new Principal("Bob", window.canvas);

    // create server if selected
    if (sessionStorage.showServer == "true") {
        try {
            // For modern browsers:
            var event = new CustomEvent('change', {});
        } catch (err) {
            // If IE
            // Create the event.
            var event = document.createEvent('Event');
            event.initEvent('change', true, true);
        }
        // Dispatch/Trigger/Fire the event
        document.querySelector("#checkbox1").dispatchEvent(event);
    }
    // create attacker if selected
    if (sessionStorage.showAttacker == "true") {
        try {
            // For modern browsers:
            var event = new CustomEvent('change', {});
        } catch (err) {
            // If IE
            // Create the event.
            var event = document.createEvent('Event');
            event.initEvent('change', true, true);
        }
        // Dispatch/Trigger/Fire the event
        document.querySelector("#checkbox2").dispatchEvent(event);
    }
    else    // prevent double call on this function
        window.displayMessages()
}));