import "../import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";

export default draw2d.layout.locator.PortLocator.extend({
    NAME: "OutputPrincipalPortLocator",

    init: function () {
        this._super();
    },

    relocate: function (index, figure) {
        var p = figure.getParent();
        this.applyConsiderRotation(figure, p.getWidth() / 2, p.getHeight());
    }
});