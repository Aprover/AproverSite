import "../import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";
import LeftPortKnowledgeMark from "./LeftPortKnowledgeMark.js";
import RightPortKnowledgeMark from "./RightPortKnowledgeMark.js";
import SelectionMenuPolicy from "../policy/SelectionMenuPolicy.js";

export default draw2d.shape.basic.Rectangle.extend({
    NAME: 'KnowledgeMark',

    init: function (attr, setter, getter) {
        this._super($.extend({ bgColor: '#5486b4', height: "30", width: "10" }),
            $.extend({
                portConfig: this.setPortConfig,
                sender: this.setSender,
                receiver: this.setReceiver
            }, setter),
            $.extend({
                sender: this.getSender,
                receiver: this.getReceiver,
                bottomY: this.getBottomY
            }, getter), attr);

        if (this.receiver == this.sender) {
            canvas.add(this, this.receiver.getTimeLineUpX() - 5, this.receiver.getTimeLineUpY() + 15);
        } else {
            canvas.add(this, this.receiver.getTimeLineUpX() - 5, this.sender.lastKnowledgeMark().getBottomY());
        }

        this.installEditPolicy(new SelectionMenuPolicy());
        this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
        this.installEditPolicy(new draw2d.policy.figure.RegionEditPolicy(this.getAbsoluteX(), this.getAbsoluteY(), this.getWidth(), this.getHeight()));
    },


    setPortConfig: function (actor) {
        var show = function () {
            this.setVisible(true);
            if (this.getName().includes('output')) {
                this.getParent().installEditPolicy(new SelectionMenuPolicy());
            }
        };
        var hide = function () {
            this.setVisible(false);
            if (this.getName().includes('output')) {
                this.getParent().uninstallEditPolicy(new SelectionMenuPolicy());
            }
        };

        let input = null;
        let output = null;
        let leftLocator = new LeftPortKnowledgeMark(false);
        let rightLocator = new RightPortKnowledgeMark(false);
        switch (actor) {
            case "init":
                output = this.createPort("output", new RightPortKnowledgeMark(true));
                break;

            case "Server":
                input = this.createPort("input", leftLocator);
                output = this.createPort("output", leftLocator);
                break;

            case "Alice":
                input = this.createPort("input", rightLocator);
                output = this.createPort("output", rightLocator);
                break;

            case "AliceBobServer":
                input = this.createPort("input", leftLocator);
                output = this.createPort("output", new RightPortKnowledgeMark(true));
                break;

            case "ServerBobAlice":
                input = this.createPort("input", rightLocator);
                output = this.createPort("output", new LeftPortKnowledgeMark(true));
                break;
        }
        input?.on("connect", hide, input);
        input?.on("disconnect", show, input);
        output.on("connect", hide, output);
        output.on("disconnect", show, output);

        return this;
    },

    setSender: function (s) {
        this.sender = s;
        return this;
    },

    setReceiver: function (r) {
        if (r.getName() == "Alice") {
            this.setBackgroundColor('#5486b4');
        } else if (r.getName() == "Bob") {
            this.setBackgroundColor('#739F60');
        } else if (r.getName() == "Server") {
            this.setBackgroundColor('#c082a1');
        } else {
            this.setBackgroundColor('#db4c4c');
        }
        this.receiver = r;
        return this;
    },

    getBottomY: function () {
        return this.getAbsoluteY() + this.getHeight();
    }
})