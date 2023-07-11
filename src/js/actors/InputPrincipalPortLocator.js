

import "../import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";

export default draw2d.layout.locator.PortLocator.extend({
    NAME: "InputPrincipalPortLocator",

    init: function () {
        this._super();
    },

    relocate: function (index, figure) {
        this.applyConsiderRotation(figure, figure.getParent().getWidth() / 2, 0);
    }
});