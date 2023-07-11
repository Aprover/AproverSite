import "../import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";

export default draw2d.shape.basic.Rectangle.extend({
    NAME: "WorkArea",

    init: function (attr, setter, getter) {
        this._super($.extend({ stroke: 1, color: '#ececec' }, attr), setter, getter);
    },
});