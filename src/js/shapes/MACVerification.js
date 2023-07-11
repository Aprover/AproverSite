import "../import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";
import LabelRight from "./LabelRight.js";
import ExtendedFunctionVerticalLayout from "./ExtendedFunctionVerticalLayout.js";

export default ExtendedFunctionVerticalLayout.extend({

    NAME: "macVerification",

    init: function (attr) {
        this._super($.extend({ bgColor: "#dbddde", color: "#d7d7d7", stroke: 1, radius: 3, resizeable: true, }, attr));

        this.classLabel = new draw2d.shape.basic.Label({
            text: "ClassName",
            bold: true,
            stroke: 1,
            fontColor: "#FBFCFC",
            bgColor: "#c75146",
            color: "#9F4038",
            radius: this.getRadius(),
            padding: 10,
            resizeable: true,
            editor: new draw2d.ui.LabelInplaceEditor()
        });

        this.add(this.classLabel);
    },

    /**
     * @method
     * Add an entity to the db shape
     * 
     * @param {String} txt the label to show
     * @param {Number} [optionalIndex] index where to insert the entity
     */
    addInOut: function () {
        var labelKey = new draw2d.shape.basic.Label({
            text: "Symmetric Key",
            stroke: 0,
            radius: 0,
            bgColor: null,
            padding: { left: 10, top: 3, right: 10, bottom: 5 },
            fontColor: "#4a4a4a",
            resizeable: true,
        });

        var labelTag = new draw2d.shape.basic.Label({
            text: "Tag",
            stroke: 0,
            radius: 0,
            bgColor: null,
            padding: { left: 10, top: 3, right: 10, bottom: 5 },
            fontColor: "#4a4a4a",
            resizeable: true,
        });

        var labelVerification = new LabelRight({
            text: "Verification",
            stroke: 0,
            radius: 0,
            bgColor: null,
            padding: { left: 10, top: 3, right: 10, bottom: 5 },
            fontColor: "#4a4a4a",
            resizeable: true,
        });

        var labelEmpty = new draw2d.shape.basic.Label({
            stroke: 0,
            fontColor: "#FFFFFF",
            bgColor: null,
            outlineStroke: 0,
            outlineColor: new draw2d.util.Color(null)
        });

        var input1 = labelKey.createPort("input");
        input1.uninstallEditPolicy(new draw2d.policy.port.IntrusivePortsFeedbackPolicy());
        input1.installEditPolicy(new draw2d.policy.port.FlowPortsFeedbackPolicy());
        input1.setSemanticGroup("symmetrickey");
        input1.setName("input_" + labelKey.id);
        input1.setColor("#00C389");
        input1.setBackgroundColor("#00C389");
        input1.setMaxFanOut(1);

        var input2 = labelTag.createPort("input");
        input2.uninstallEditPolicy(new draw2d.policy.port.IntrusivePortsFeedbackPolicy());
        input2.installEditPolicy(new draw2d.policy.port.FlowPortsFeedbackPolicy());
        input2.setName("input_" + labelTag.id);
        input2.setColor("#04773b");
        input2.setBackgroundColor("#04773b");
        input2.setMaxFanOut(1);

        var output = labelVerification.createPort("output");
        output.uninstallEditPolicy(new draw2d.policy.port.IntrusivePortsFeedbackPolicy());
        output.installEditPolicy(new draw2d.policy.port.FlowPortsFeedbackPolicy());
        output.setName("output_" + labelVerification.id);
        output.setColor("#04773b");
        output.setBackgroundColor("#04773b");

        let container = new draw2d.shape.layout.TableLayout({
            bgColor: null,
            color: null,
            radius: this.getRadius(),
            resizeable: true,
            padding: { top: 5 }
        });

        container.addRow(labelKey, labelVerification);
        container.addRow(labelTag);

        this.add(container);

        input2.on("connect", (element, event) => {
            var connections = input2.getConnections();
            connections.each((i, conn) => {
                var targetPort = conn.getTarget();
                targetPort?.setValue(conn.getSource().getValue());
            });
        });

        input1.on("connect", (element, event) => {
            var connections = input1.getConnections();
            connections.each((i, conn) => {
                var targetPort = conn.getTarget();
                targetPort?.setValue(conn.getSource().getValue());
            });
        });

        output.on("change:value", (element, event) => {
            var connections = output.getConnections();
            connections.each((i, conn) => {
                var targetPort = conn.getTarget();
                targetPort?.setValue(conn.getSource().getValue());
            });
        });

        return container;
    },

    getInputPorts: function () {
        var inports = new draw2d.util.ArrayList();
        var inport1 = this.getChildren().get(1).getChildren().get(0).getPorts().get(0);
        var inport2 = this.getChildren().get(1).getChildren().get(2).getPorts().get(0);
        inports.add(inport1);
        inports.add(inport2);
        return inports;
    },

    /**
    * @method
    * Called if the value of any port has been changed
    *
    * @param {draw2d.Port} relatedPort
    * @template
    */
    onPortValueChanged: function (relatedPort) {
        var data = [];
        this.getInputPorts().each(function (i, port) {
            data.push(port.getValue());
        });
        this.getOutputPorts().setValue('Mv(' + data[0] + '){' + data[1] + '}');
    }
});