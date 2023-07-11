import "../import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";
import LeftPortKnowledgeMarkAtk from "./LeftPortKnowledgeMarkAtk.js";
import RightPortKnowledgeMarkAtk from "./RightPortKnowledgeMarkAtk.js";

export default draw2d.shape.basic.Rectangle.extend({
    NAME: 'KnowledgeMarkAtk',
    init: function (attr, setter, getter) {
        this._super($.extend({ bgColor: '#db4c4c', color: '#cc000', height: "20", width: "10" }),
            $.extend({
                messageNumb: this.setMessageNumb,
            }, setter),
            getter, attr);

        this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
    },

    setMessageNumb: function (n) {
        this.messageNumb = n;
        var show = function () { this.setVisible(true); };
        var hide = function () { this.setVisible(false); };
        let left = new LeftPortKnowledgeMarkAtk();
        let right = new RightPortKnowledgeMarkAtk();
        let output, input
        if (n == 0) {
            output = this.createPort("output", left);
            input = this.createPort("input", right);
        } else {
            output = this.createPort("output", right);
            input = this.createPort("input", left);
        }
        input.on("connect", hide, input);
        input.on("disconnect", show, input);
        output.on("connect", hide, output);
        output.on("disconnect", show, output);
        return this;

    },
    /**
     * @method
     * Called if the user drop this element onto the dropTarget. 
     * 
     * In this Example we create a "smart insert" of an existing connection.
     * COOL and fast network editing.
     * 
     * @param {draw2d.Figure} dropTarget The drop target.
     * @param {Number} x the x coordinate of the drop
     * @param {Number} y the y coordinate of the drop
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     * @private
     **/
    onDrop: function (dropTarget, x, y, shiftKey, ctrlKey, i) {
        // make knowledge mark not movable
        this.installEditPolicy(new draw2d.policy.figure.RegionEditPolicy(this.getAbsoluteX(), this.getAbsoluteY(), this.getWidth(), this.getHeight()));
        // Activate a "smart insert" If the user drop this figure on connection
        if (dropTarget instanceof draw2d.Connection) {
            let oldSource = dropTarget.getSource();
            let oldTarget = dropTarget.getTarget();

            let insertionSource = this.getOutputPort(0)
            let insertionTarget = this.getInputPort(0)

            // ensure that oldSource ---> insertionTarget.... insertionSource ------>oldTarget
            if (oldSource instanceof draw2d.InputPort) {
                oldSource = dropTarget.getTarget();
                oldTarget = dropTarget.getSource();
            }
            dropTarget.setTarget(insertionTarget)

            // add parser txt
            let txt = null
            if (sessionStorage.parsedMessages) {
                let parsedMessages = JSON.parse(sessionStorage.parsedMessages);
                txt = parsedMessages[i]
            }
            window.canvas.add(window.createConnection(insertionSource, oldTarget, txt));
        } else {
            console.log("not connection");
        }
    },

    onRemove: function () {
        let insertionSource = this.getOutputPort(0);
        let insertionTarget = this.getInputPort(0);
        let connection = insertionSource.getConnections().get(0);
        let newSource = insertionTarget.getConnections().get(0).getSource();
        window.canvas.remove(insertionTarget.getConnections().get(0));
        window.canvas.remove(this);
        connection.setSource(newSource);
    }
});