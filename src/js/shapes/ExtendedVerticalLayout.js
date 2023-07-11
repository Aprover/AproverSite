import "../import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";

export default draw2d.shape.layout.VerticalLayout.extend({

    NAME: "ExtendedVerticalLayout",

    init: function (attr) {
        this._super($.extend({ bgColor: "#dbddde", color: "#d7d7d7", stroke: 1, radius: 3, resizeable: true, }, attr));
    },

    /**
     * @method
     * Add an entity to the db shape
     * 
     * @param {String} txt the label to show
     * @param {Number} [optionalIndex] index where to insert the entity
     */
    addEntityIn: function (txt) {
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
        input.uninstallEditPolicy(new draw2d.policy.port.IntrusivePortsFeedbackPolicy());
        input.installEditPolicy(new draw2d.policy.port.FlowPortsFeedbackPolicy());

        input.setName("input_" + label.id);

        return label;
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
     * Add an entity to the db shape
     * 
     * @param {String} txt the label to show
     * @param {Number} [optionalIndex] index where to insert the entity
     */
    addEntityOut: function (txt) {
        var label = new LabelRight({
            text: txt,
            stroke: 0,
            radius: 0,
            bgColor: null,
            padding: { left: 10, top: 3, right: 10, bottom: 5 },
            fontColor: "#4a4a4a",
            resizeable: true,
        });

        //var input = label.createPort("input");
        var output = label.createPort("output");
        output.uninstallEditPolicy(new draw2d.policy.port.IntrusivePortsFeedbackPolicy());
        output.installEditPolicy(new draw2d.policy.port.FlowPortsFeedbackPolicy());
        //input.setName("input_" + label.id);
        output.setName("output_" + label.id);

        return label;
    },

    /**
     * @method
     * Set the name of the DB table. Visually it is the header of the shape
     * 
     * @param name
     */
    setName: function (name) {
        this.classLabel.setText(name);

        return this;
    },

    /**
     * @method 
     * Return an objects with all important attributes for XML or JSON serialization
     * 
     * @returns {Object}
     */
    getPersistentAttributes: function (simpleShape = true) {
        var memento = this._super();

        memento.name = this.classLabel.getText();
        memento.entities = [];
        memento.labels = [];
        if (simpleShape)
            this.children.each(function (i, e) {
                var labelJSON = e.figure.getPersistentAttributes();
                labelJSON.locator = e.locator.NAME;
                memento.labels.push(labelJSON);
                if (i > 0) { // skip the header of the figure
                    memento.entities.push({
                        text: e.figure.getText(),
                        id: e.figure.id
                    });
                }
            });
        return memento;
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
        let container = new draw2d.shape.layout.TableLayout({
            bgColor: null,
            color: null,
            radius: this.getRadius(),
            resizeable: true
        });
        if ((typeof memento.entitiesInput !== "undefined") && (typeof memento.entitiesOutput !== "undefined")) {
            var lenOut = (memento.entitiesOutput).length

            $.each(memento.entitiesInput, $.proxy(function (i, e) {
                var entityin = this.addEntityIn(e.text);
                entityin.id = e.id;
                entityin.getInputPort(0).setName("input_" + e.id);
                //entityin.setLabelAligment(PositionConstants.LEFT);
                if (i == 0) {
                    container.attr({
                        padding: { top: 5 }
                    });
                }
                if (i < lenOut) {
                    var entityout = this.addEntityOut((memento.entitiesOutput)[i].text);
                    entityout.id = (memento.entitiesOutput)[i].id;
                    entityout.getOutputPort(0).setName("output_" + (memento.entitiesOutput)[i].id);
                    //entityout.text-anchor = "";
                    container.addRow(entityin, entityout);
                    container.setCellAlign(i, 1, "right");
                } else {
                    container.addRow(entityin);
                }
            }, this));
        }
        this.add(container);
        return this;
    }
});