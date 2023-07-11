import "../import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";
import LabelRight from "./LabelRight.js";
import ExtendedFunctionVerticalLayout from "./ExtendedFunctionVerticalLayout.js";
import CommandDelete from "../CommandDelete.js";

export default ExtendedFunctionVerticalLayout.extend({

    NAME: "Group",

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

        //        label.installEditor(new draw2d.ui.LabelEditor());
        var input = label.createPort("input");
        input.setName("input_" + label.id);
        input.setColor("#04773b");
        input.setBackgroundColor("#04773b");
        input.setMaxFanOut(1);


        var _table = this;
        /*
        label.on("contextmenu", function (emitter, event) {
            $.contextMenu({
                selector: 'body',
                events:
                {
                    hide: function () { $.contextMenu('destroy'); }
                },
                callback: $.proxy(function (key, options) {
                    switch (key) {
                        case "new":
                            setTimeout(function () {
                                _table.addEntity(container, "_new_").onDoubleClick();
                                _table.onPortValueChanged();
                            }, 10);
                            break;
                        case "delete":
                            // with undo/redo support
                            var cmd = new CommandDelete(emitter);
                            emitter.getCanvas().getCommandStack().execute(cmd);
                            _table.onPortValueChanged();
                        default:
                            break;
                    }
                }, this),
                x: event.x,
                y: event.y,
                items:
                {
                    "new": { name: "New Entity" },
                    "sep1": "---------",
                    "delete": { name: "Delete" }
                }
            });
        });*/

        container.addRow(label);
        this.updateCachedPort(input);

        input.on("connect", (element, event) => {
            var connections = input.getConnections();
            connections.each((i, conn) => {
                var targetPort = conn.getTarget();
                targetPort.setValue(conn.getSource().getValue());
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
        var labelKnowledge1 = new draw2d.shape.basic.Label({
            text: "Knowledge 1",
            stroke: 0,
            radius: 0,
            bgColor: null,
            padding: { left: 10, top: 3, right: 10, bottom: 5 },
            fontColor: "#4a4a4a",
            resizeable: true,
        });

        var labelKnowledge2 = new draw2d.shape.basic.Label({
            text: "Knowledge 2",
            stroke: 0,
            radius: 0,
            bgColor: null,
            padding: { left: 10, top: 3, right: 10, bottom: 5 },
            fontColor: "#4a4a4a",
            resizeable: true,
        });

        var labelTag = new LabelRight({
            text: "Group",
            stroke: 0,
            radius: 0,
            bgColor: null,
            padding: { left: 10, top: 3, right: 10, bottom: 5 },
            fontColor: "#4a4a4a",
            resizeable: true,
        });

        var input1 = labelKnowledge1.createPort("input");
        input1.uninstallEditPolicy(new draw2d.policy.port.IntrusivePortsFeedbackPolicy());
        input1.installEditPolicy(new draw2d.policy.port.FlowPortsFeedbackPolicy());
        input1.setName("input_" + labelKnowledge1.id);
        input1.setColor("#04773b");
        input1.setBackgroundColor("#04773b");
        input1.setMaxFanOut(1);

        var input2 = labelKnowledge2.createPort("input");
        input2.uninstallEditPolicy(new draw2d.policy.port.IntrusivePortsFeedbackPolicy());
        input2.installEditPolicy(new draw2d.policy.port.FlowPortsFeedbackPolicy());
        input2.setName("input_" + labelKnowledge2.id);
        input2.setColor("#04773b");
        input2.setBackgroundColor("#04773b");
        input2.setMaxFanOut(1);

        var output = labelTag.createPort("output");
        output.uninstallEditPolicy(new draw2d.policy.port.IntrusivePortsFeedbackPolicy());
        output.installEditPolicy(new draw2d.policy.port.FlowPortsFeedbackPolicy());
        output.setName("output_" + labelTag.id);
        output.setColor("#04773b");
        output.setBackgroundColor("#04773b");

        let container = new draw2d.shape.layout.TableLayout({
            bgColor: null,
            color: null,
            radius: this.getRadius(),
            resizeable: true,
            padding: { top: 5 }
        });

        container.addRow(labelKnowledge1, labelTag);
        container.addRow(labelKnowledge2);

        var _table = this;

        /*labelKnowledge1.on("contextmenu", function (emitter, event) {
            $.contextMenu({
                selector: 'body',
                events:
                {
                    hide: function () { $.contextMenu('destroy'); }
                },
                callback: $.proxy(function (key, options) {
                    switch (key) {
                        case "new":
                            setTimeout(function () {
                                _table.addEntity(container, "_new_").onDoubleClick();
                                _table.onPortValueChanged();
                            }, 10);
                            break;
                        default:
                            break;
                    }

                }, this),
                x: event.x,
                y: event.y,
                items:
                {
                    "new": { name: "New Entity" }
                }
            });
        });

        labelKnowledge2.on("contextmenu", function (emitter, event) {
            $.contextMenu({
                selector: 'body',
                events:
                {
                    hide: function () { $.contextMenu('destroy'); }
                },
                callback: $.proxy(function (key, options) {
                    switch (key) {
                        case "new":
                            setTimeout(function () {
                                _table.addEntity(container, "_new_").onDoubleClick();
                                _table.onPortValueChanged();
                            }, 10);
                            break;
                        default:
                            break;
                    }

                }, this),
                x: event.x,
                y: event.y,
                items:
                {
                    "new": { name: "New Entity" }
                }
            });
        });*/

        this.add(container);

        input1.on("connect", (element, event) => {
            var connections = input1.getConnections();
            connections.each((i, conn) => {
                var targetPort = conn.getTarget();
                targetPort.setValue(conn.getSource().getValue());
            });
        });

        input2.on("connect", (element, event) => {
            var connections = input2.getConnections();
            connections.each((i, conn) => {
                var targetPort = conn.getTarget();
                targetPort.setValue(conn.getSource().getValue());
            });
        });

        output.on("change:value", (element, event) => {
            var connections = output.getConnections();
            connections.each((i, conn) => {
                var targetPort = conn.getTarget();
                targetPort.setValue(conn.getSource().getValue());
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
        var size = this.getChildren().get(1).getChildren().getSize();
        for (let i = 3; i < size; i++) {
            inports.add(this.getChildren().get(1).getChildren().get(i).getPorts().get(0));
        }
        return inports
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

        this.getOutputPorts().setValue(temp);
    }
});