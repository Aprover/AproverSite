import "../import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";
import LabelRight from "./LabelRight.js";
import ExtendedFunctionVerticalLayout from "./ExtendedFunctionVerticalLayout.js";

export default ExtendedFunctionVerticalLayout.extend({

    NAME: "Split",

    init: function (attr) {
        this._super($.extend({ bgColor: "#dbddde", color: "#d7d7d7", stroke: 1, radius: 3, resizeable: true, }, attr));

        this.classLabel = new draw2d.shape.basic.Label({
            text: "ClassName",
            bold: true,
            stroke: 1,
            fontColor: "#FBFCFC",
            bgColor: "#0899ba",
            color: "#067A94",
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
    addEntity: function (container, txt) {
        var label = new draw2d.shape.basic.Label({
            text: txt,
            stroke: 0,
            radius: 0,
            bgColor: null,
            padding: { left: 10, top: 3, right: 10, bottom: 5 },
            fontColor: "#4a4a4a",
            resizeable: true,
        });

        var input = label.createPort("input");
        input.setName("input_" + label.id);
        input.setColor("#04773b");
        input.setBackgroundColor("#04773b");
        input.setMaxFanOut(1);

        var _table = this;

        container.addRow(label);
        this.updateCachedPort(input);

        input.on("connect", (element, event) => {
            var connections = input.getConnections();
            connections.each((i, conn) => {
                var targetPort = conn.getTarget();
                targetPort?.setValue(conn.getSource().getValue());
            });
        });

        return label;
    },

    /**
     * @method
     * Add an entity to the db shape
     * 
     * @param {String} txt the label to show
     * @param {Number} [optionalIndex] index where to insert the entity
     */
    addInOut: function () {
        var labelKnowledge1 = new LabelRight({
            text: "Knowledge 1",
            stroke: 0,
            radius: 0,
            bgColor: null,
            padding: { left: 10, top: 3, right: 10, bottom: 5 },
            fontColor: "#4a4a4a",
            resizeable: true,
        });

        var labelKnowledge2 = new LabelRight({
            text: "Knowledge 2",
            stroke: 0,
            radius: 0,
            bgColor: null,
            padding: { left: 10, top: 3, right: 10, bottom: 5 },
            fontColor: "#4a4a4a",
            resizeable: true,
        });

        var labelTag = new draw2d.shape.basic.Label({
            text: "Group",
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

        var output1 = labelKnowledge1.createPort("output");
        output1.uninstallEditPolicy(new draw2d.policy.port.IntrusivePortsFeedbackPolicy());
        output1.installEditPolicy(new draw2d.policy.port.FlowPortsFeedbackPolicy());
        output1.setName("output_" + labelKnowledge1.id);
        output1.setColor("#04773b");
        output1.setBackgroundColor("#04773b");
        output1.setMaxFanOut(1);

        var output2 = labelKnowledge2.createPort("output");
        output2.uninstallEditPolicy(new draw2d.policy.port.IntrusivePortsFeedbackPolicy());
        output2.installEditPolicy(new draw2d.policy.port.FlowPortsFeedbackPolicy());
        output2.setName("output_" + labelKnowledge2.id);
        output2.setColor("#04773b");
        output2.setBackgroundColor("#04773b");
        output2.setMaxFanOut(1);

        var input = labelTag.createPort("input");
        input.uninstallEditPolicy(new draw2d.policy.port.IntrusivePortsFeedbackPolicy());
        input.installEditPolicy(new draw2d.policy.port.FlowPortsFeedbackPolicy());
        input.setName("input_" + labelTag.id);
        input.setColor("#04773b");
        input.setBackgroundColor("#04773b");

        let container = new draw2d.shape.layout.TableLayout({
            bgColor: null,
            color: null,
            radius: this.getRadius(),
            resizeable: true,
            padding: { top: 5 }
        });

        container.addRow(labelTag, labelKnowledge1);
        container.addRow(labelEmpty, labelKnowledge2);

        var _table = this;

        this.add(container);

        output1.on("connect", (element, event) => {
            var connections = output1.getConnections();
            connections.each((i, conn) => {
                var targetPort = conn.getTarget();
                targetPort?.setValue(conn.getSource().getValue());
            });
        });

        output2.on("connect", (element, event) => {
            var connections = output2.getConnections();
            connections.each((i, conn) => {
                var targetPort = conn.getTarget();
                targetPort?.setValue(conn.getSource().getValue());
            });
        });

        input.on("change:value", (element, event) => {
            var connections = input.getConnections();
            connections.each((i, conn) => {
                var targetPort = conn.getTarget();
                targetPort?.setValue(conn.getSource().getValue());
            });
        });

        return container;
    },

    getInputPorts: function () {
        return this.getChildren().get(1).getChildren().get(1).getPorts().get(0);
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

        var temp = "";
        for (let i = 0; i < data.length - 1; i++)
            temp = temp + data[i] + ', ';
        temp = temp + data[data.length - 1];
        //this.getOutputPorts().get(0).setValue('{' + data[1] + '}<sub>' + data[0] + '<sub>')

        this.getOutputPorts().setValue(temp);
    }
});