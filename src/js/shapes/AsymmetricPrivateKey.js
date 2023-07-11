import "../import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";
import LabelRight from "./LabelRight.js";
import ExtendedVerticalLayout from "./ExtendedVerticalLayout.js";

export default ExtendedVerticalLayout.extend({

    NAME: "asymmetricPrivateKey",

    init: function (attr) {
        this._super($.extend({ bgColor: "#dbddde", color: "#d7d7d7", stroke: 1, radius: 3, resizeable: true, }, attr));

        this.classLabel = new draw2d.shape.basic.Label({
            text: "Asymmetric Private Key",
            bold: true,
            stroke: 1,
            fontColor: "#FFFFFF",
            bgColor: "#7AE1BF",
            color: "#61B498",
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
            port.setSemanticGroup("asymprivkey");
            port.setColor("#7AE1BF");
            port.setBackgroundColor("#7AE1BF");
            port.setValue(txt);

            this.add(label);
        }
        else {
            // get all asymmetric private keys the actor knows
            let knowledge = JSON.parse(sessionStorage.knowledge);
            knowledge.asymmetricPrivateKey.forEach(element => {
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
                    port.setSemanticGroup("asymprivkey");
                    port.setColor("#7AE1BF");
                    port.setBackgroundColor("#7AE1BF");
                    port.setValue(element.value);

                    this.add(label);
                }
            });
        }

        return container;
    }
});