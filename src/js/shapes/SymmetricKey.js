import "../import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";
import LabelRight from "./LabelRight.js";
import ExtendedVerticalLayout from "./ExtendedVerticalLayout.js";

export default ExtendedVerticalLayout.extend({

    NAME: "symmetricKey",

    init: function (attr) {
        this._super($.extend({ bgColor: "#dbddde", color: "#d7d7d7", stroke: 1, radius: 3, resizeable: true, }, attr));

        this.classLabel = new draw2d.shape.basic.Label({
            text: "Symmetric Key",
            bold: true,
            stroke: 1,
            fontColor: "#FBFCFC",
            bgColor: "#00C389",
            color: "#009C6D",
            radius: this.getRadius(),
            padding: 10,
            resizeable: true
        });

        this.add(this.classLabel);
    },

    /**
     * @method
     * Add an entity to the db shape
     * 
     * @param {boolean} input true=right label
     * @param {String} txt label text, optional
     */
    addInOut: function (input = true, txt) {
        let label = null;
        let port;

        if (txt) {
            if (input) {
                label = new LabelRight({
                    text: txt,
                    stroke: 0,
                    radius: 0,
                    bgColor: null,
                    padding: { left: 10, top: 3, right: 10, bottom: 5 },
                    fontColor: "#4a4a4a",
                    resizeable: true,
                });
                port = label.createPort("output");
                port.setName("output_" + label.id);
            }
            else {
                label = new draw2d.shape.basic.Label({
                    text: txt,
                    stroke: 0,
                    radius: 0,
                    bgColor: null,
                    padding: { left: 10, top: 3, right: 10, bottom: 5 },
                    fontColor: "#4a4a4a",
                    resizeable: true,
                });
                port = label.createPort("input");
                port.setName("input_" + label.id);
            }

            port.uninstallEditPolicy(new draw2d.policy.port.IntrusivePortsFeedbackPolicy());
            port.installEditPolicy(new draw2d.policy.port.FlowPortsFeedbackPolicy());
            port.setSemanticGroup("symmetrickey");
            port.setColor("#00C389");
            port.setBackgroundColor("#00C389");
            port.setValue(txt);

            this.add(label);
        }
        else {
            // get all symmetric keys the actor knows
            let knowledge = JSON.parse(sessionStorage.knowledge);
            knowledge.symmetricKey.forEach(element => {
                label = null;
                if (input && element.knownBy.includes(sessionStorage.sender)) {
                    label = new LabelRight({
                        text: element.value,
                        stroke: 0,
                        radius: 0,
                        bgColor: null,
                        padding: { left: 10, top: 3, right: 10, bottom: 5 },
                        fontColor: "#4a4a4a",
                        resizeable: true,
                    });
                    port = label.createPort("output");
                    port.setName("output_" + label.id);
                }
                else if (!input && element.knownBy.includes(sessionStorage.receiver)) {
                    label = new draw2d.shape.basic.Label({
                        text: element.value,
                        stroke: 0,
                        radius: 0,
                        bgColor: null,
                        padding: { left: 10, top: 3, right: 10, bottom: 5 },
                        fontColor: "#4a4a4a",
                        resizeable: true,
                    });
                    port = label.createPort("input");
                    port.setName("input_" + label.id);
                }

                if (label) {
                    port.uninstallEditPolicy(new draw2d.policy.port.IntrusivePortsFeedbackPolicy());
                    port.installEditPolicy(new draw2d.policy.port.FlowPortsFeedbackPolicy());
                    port.setSemanticGroup("symmetrickey");
                    port.setColor("#00C389");
                    port.setBackgroundColor("#00C389");
                    port.setValue(element.value);

                    this.add(label);
                }
            });
        }

        return container;
    }
});