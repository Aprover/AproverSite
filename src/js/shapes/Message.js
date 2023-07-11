import "../import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";
import CommandDelete from '../CommandDelete.js';
import FlowPortsFeedbackPolicy from "../policy/FlowPortsFeedbackPolicy.js";
import ExtendedFunctionVerticalLayout from "./ExtendedFunctionVerticalLayout.js";
import LabelRight from "./LabelRight.js"

export default ExtendedFunctionVerticalLayout.extend({

    NAME: "Message",

    init: function (attr) {
        this._super($.extend({ bgColor: "#dbddde", color: "#d7d7d7", stroke: 1, radius: 3 }, attr));

        this.parser = null;

        this.classLabel = new draw2d.shape.basic.Label({
            text: "ClassName",
            bold: true,
            stroke: 1,
            fontColor: "#FBFCFC",
            bgColor: "#16679a",
            color: "#11527B",
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
        let label = new draw2d.shape.basic.Label({
            text: txt,
            stroke: 0,
            radius: 0,
            bgColor: null,
            padding: { left: 10, top: 3, right: 10, bottom: 5 },
            fontColor: "#4a4a4a",
            resizeable: true,
        });

        let input = label.createPort("input");
        input.uninstallEditPolicy(new draw2d.policy.port.IntrusivePortsFeedbackPolicy());
        input.installEditPolicy(new FlowPortsFeedbackPolicy());
        input.setName("input_" + label.id);
        input.setColor("#04773b");
        input.setBackgroundColor("#04773b");
        input.setMaxFanOut(1);

        let _table = this;

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
                                _table.addEntity(container, "Field").onDoubleClick();
                                _table.onPortValueChanged();
                            }, 10);
                            break;
                        case "delete":
                            // with undo/redo support
                            var cmd = new CommandDelete(emitter, true);
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
        });

        container.add(label);
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
    addInOut: function (parser, nFields = 1, reception = false) {
        if (nFields < 1)
            return -1;

        this.parser = parser;
        let _table = this;
        let container = new draw2d.shape.layout.VerticalLayout({
            bgColor: null,
            color: null,
            radius: this.getRadius(),
            resizeable: true,
            padding: { top: 5 }
        });

        let label;
        let input;
        if (reception) {
            label = new LabelRight({
                text: "Field",
                stroke: 0,
                radius: 0,
                bgColor: null,
                padding: { left: 10, top: 3, right: 10, bottom: 5 },
                fontColor: "#4a4a4a",
                resizeable: true,
            });
            input = label.createPort("output");
            input.setName("output_" + label.id);
        }
        else {
            label = new draw2d.shape.basic.Label({
                text: "Field",
                stroke: 0,
                radius: 0,
                bgColor: null,
                padding: { left: 10, top: 3, right: 10, bottom: 5 },
                fontColor: "#4a4a4a",
                resizeable: true,
            });
            input = label.createPort("input");
            input.setName("input_" + label.id);

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
                                    _table.addEntity(container, "Field").onDoubleClick();
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
                        "new": { name: "New Entity" },
                        "sep1": "---------"
                    }
                });
            });
        }

        input.uninstallEditPolicy(new draw2d.policy.port.IntrusivePortsFeedbackPolicy());
        input.installEditPolicy(new FlowPortsFeedbackPolicy());
        input.setColor("#04773b");
        input.setBackgroundColor("#04773b");
        input.setMaxFanOut(1);

        container.add(label);

        input.on("connect", (element, event) => {
            var connections = input.getConnections();
            connections.each((i, conn) => {
                var targetPort = conn.getTarget();
                targetPort?.setValue(conn.getSource().getValue());
            });
        });

        for (let i = 1; i < nFields; i++) {
            let label;
            let input;
            if (reception) {
                label = new LabelRight({
                    text: "Field",
                    stroke: 0,
                    radius: 0,
                    bgColor: null,
                    padding: { left: 10, top: 3, right: 10, bottom: 5 },
                    fontColor: "#4a4a4a",
                    resizeable: true,
                });
                input = label.createPort("output");
                input.setName("output_" + label.id);
            }
            else {
                label = new draw2d.shape.basic.Label({
                    text: "Field",
                    stroke: 0,
                    radius: 0,
                    bgColor: null,
                    padding: { left: 10, top: 3, right: 10, bottom: 5 },
                    fontColor: "#4a4a4a",
                    resizeable: true,
                });
                input = label.createPort("input");
                input.setName("input_" + label.id);

                // da cambiare
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
                                        _table.addEntity(container, "Field").onDoubleClick();
                                        _table.onPortValueChanged();
                                    }, 10);
                                    break;
                                case "delete":
                                    // with undo/redo support
                                    var cmd = new CommandDelete(emitter, true);
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
                });
            }

            input.uninstallEditPolicy(new draw2d.policy.port.IntrusivePortsFeedbackPolicy());
            input.installEditPolicy(new FlowPortsFeedbackPolicy());
            input.setColor("#04773b");
            input.setBackgroundColor("#04773b");
            input.setMaxFanOut(1);

            container.add(label);

            input.on("connect", (element, event) => {
                var connections = input.getConnections();
                connections.each((i, conn) => {
                    var targetPort = conn.getTarget();
                    targetPort?.setValue(conn.getSource().getValue());
                });
            });
        }

        this.add(container);

        return container;
    },

    /**
     * @method
     * Remove the entity with the given index from the DB table shape.<br>
     * This method removes the entity without care of existing connections. Use
     * a draw2d.command.CommandDelete command if you want to delete the connections to this entity too
     * 
     * @param {Number} index the index of the entity to remove
     */
    removeEntity: function (index) {
        this.remove(this.children.get(index + 1).figure);
    },

    /**
     * @method
     * Returns the entity figure with the given index
     * 
     * @param {Number} index the index of the entity to return
     */
    getEntity: function (index) {
        return this.children.get(index + 1).figure;
    },

    /**
     * @method 
     * Read all attributes from the serialized properties and transfer them into the shape.
     *
     * @param {Object} memento
     * @return
     */
    setPersistentAttributes: function (memento) {
        this._super(memento);

        this.setName(memento.name);

        if (typeof memento.entities !== "undefined") {
            $.each(memento.entities, $.proxy(function (i, e) {
                var entity = this.addEntityIn(e.text);
                entity.id = e.id;
                entity.getInputPort(0).setName("input_" + e.id);
            }, this));
        }

        return this;
    },

    getInputPorts: function () {
        var inports = new draw2d.util.ArrayList();
        var inport1 = this.getChildren().get(1).getChildren().get(0).getPorts().get(0);
        inports.add(inport1);
        var size = this.getChildren().get(1).getChildren().getSize();
        for (let i = 1; i < size; i++) {
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
        if (this.parser) {
            var data = [];
            this.getInputPorts().each(function (i, port) {
                data.push(port.getValue());
            });
            var html = "";
            for (let i = 0; i < data.length; i++) {
                html += data[i];
                if (i < data.length - 1)
                    html += ', ';
            }
            this.parser.setMessage(html);
        }
    }
});