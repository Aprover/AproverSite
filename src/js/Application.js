import "./import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";

import View from "./View.js";
import ToolbarMessage from "./ToolbarMessage.js";
import Parser from "./Parser.js";
import MyConnection from "./shapes/MyConnection.js";
import DragConnectionCreatePolicy2 from "./policy/DragConnectionCreatePolicy2.js";

export default Class.extend({
    NAME: "Application",

    init: function () {
        this.parser = new Parser();
        this.view = new View("canvas", this.parser);
        this.view.installEditPolicy(new DragConnectionCreatePolicy2({
            createConnection: function () {
                return new MyConnection();
            }
        }));
        this.toolbar = new ToolbarMessage("toolbar", "submit", this.view);
    }
});