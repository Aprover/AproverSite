
import "../import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";

export default draw2d.shape.basic.Rectangle.extend({
    NAME: "PrincipalLabel",

    init: function (attr) {
        this._super($.extend({ bgColor: "#0b5394", height: "60", width: "120" }), attr);
    },

    setActor: function (name) {
        if (this.label)
            this.label.setText(name)
        else {
            this.label = new draw2d.shape.basic.Label({
                text: name,
                color: "#0b5394",
                fontColor: "#ffffff",
                outlineStroke: 1,
                outlineColor: "#5e5e5e",
                fontSize: "22",
                bold: true
            });

            // add the new decoration to the connection with a position locator.
            //
            this.add(this.label, new draw2d.layout.locator.CenterLocator(this));
        }
        return this;
    },

    setActorColor: function (col) {
        this.setBackgroundColor(col);
        this.getChildren().first().setColor(col);
        return this;
    }
});