import "../import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";
import ExtendedVerticalLayout from "./ExtendedVerticalLayout.js";

export default ExtendedVerticalLayout.extend({

    NAME: "ExtendedFunctionVerticalLayout",

    init: function (attr) {
        this._super($.extend({ bgColor: "#dbddde", color: "#d7d7d7", stroke: 1, radius: 3, resizeable: true, }, attr));
    },

    /**
     * @method 
     * Return an objects with all important attributes for XML or JSON serialization
     * 
     * @returns {Object}
     */
    getPersistentAttributes: function () {
        var memento = this._super(false);

        this.children.each(function (i, e) {
            var labelJSON = e.figure.getPersistentAttributes();
            labelJSON.locator = e.locator.NAME;
            memento.labels.push(labelJSON);
            if (i > 0) { // skip the header of the figure
                var child = e.figure.children.data;
                for (i = 0; i < child.length; i++) {
                    memento.entities.push({
                        text: child[i].figure.text,
                        id: child[i].figure.id
                    });
                };
            }
        });
        return memento;
    },

    getOutputPorts: function () {
        var outport = this.getChildren().get(1).getChildren().get(1).getPorts().get(0);
        return outport;
    },

    /**
    * @method
    * Called if the value of any port has been changed
    *
    * @param {draw2d.Port} relatedPort
    */
    onPortValueChanged: function (relatedPort) {
        var data = [];
        this.getInputPorts().each(function (i, port) {
            data.push(port.getValue());
        });
        this.getOutputPorts().setValue("{" + data[1] + "}<sub>" + data[0] + "</sub>");
    }
});