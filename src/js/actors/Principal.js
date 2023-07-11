/* Assemble name and lifeline for Principals */

import "../import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";
import PrincipalLabel from "./PrincipalLabel.js";
import OutputPrincipalPortLocator from "./OutputPrincipalPortLocator.js";
import EndPrincipal from "./EndPrincipal.js";
import InputPrincipalPortLocator from "./InputPrincipalPortLocator.js";
import WorkArea from "./WorkArea.js";
import TimeLinePrincipal from "./TimeLinePrincipal.js";


export default Class.extend({
    NAME: "Principal",

    init: function (name, canvas) {

        this.knowledgemarks = [];
        this.name = name;

        this.principalTop = new PrincipalLabel();
        this.principalTop.setActor(name);
        let TopPort = this.principalTop.createPort("output", new OutputPrincipalPortLocator());
        TopPort.setSemanticGroup(name + "_Top");
        this.principalTop.setDraggable(false);
        this.principalTop.setSelectable(false);

        this.principalEnd = new EndPrincipal();
        let EndPort = this.principalEnd.createPort("input", new InputPrincipalPortLocator());
        EndPort.setSemanticGroup(name + "_End");
        this.principalEnd.setSelectable(false);
        this.principalEnd.setDraggable(false);

        this.jail = new WorkArea($.extend({ height: canvas.getHeight(), width: (canvas.getWidth() / 5) }));
        this.jail.setBackgroundColor(null);
        this.jail.setSelectable(false);
        this.jail.setDraggable(false);
        //add calculation
        let position = null;
        switch (name) {
            case "Alice":
                position = 1;
                break;
            case "Bob":
                position = 2;
                this.principalTop.setActorColor("#38761d");
                break;
            case "Server":
                position = window.AttackerRight ? 4 : 3;
                this.principalTop.setActorColor("#a64d79");
                break;
            case "AttackerLeft":
                position = 1;
                this.principalTop.setActorColor("#cc0000");
                break;
            case "AttackerRight":
                position = 3;
                this.principalTop.setActorColor("#cc0000");
                break;
        }
        canvas.add(this.jail, position * canvas.getWidth() / 5, 0);
        canvas.add(this.principalTop, (position * 2 + 1) * (canvas.getWidth() / 10) - 60, 20);
        canvas.add(this.principalEnd, (position * 2 + 1) * (canvas.getWidth() / 10) - 75, canvas.getHeight() - 30);

        this.timeLine = new TimeLinePrincipal({
            source: this.principalTop.getPorts().first(),
            target: this.principalEnd.getPorts().first()
        });
        this.timeLine.setDraggable(false);
        this.timeLine.setSelectable(false);

        canvas.add(this.timeLine);
    },

    setName: function (name) {

        this.principalTop.setActor(name);

    },

    getName: function () {

        return this.name;

    },

    getTopX: function () {

        return this.principalTop.getAbsoluteX();

    },

    getTopY: function () {

        return this.principalTop.getAbsoluteY();

    },
    getEndX: function () {

        return this.principalEnd.getAbsoluteX();

    },

    getEndY: function () {

        return this.principalEnd.getAbsoluteY();

    },

    getJailX: function () {

        return this.jail.getAbsoluteX();

    },

    getJailY: function () {

        return this.jail.getAbsoluteY();

    },

    getTimeLineUpX: function () {

        return this.timeLine.getStartX();

    },

    getTimeLineUpY: function () {

        return this.timeLine.getStartY();

    },

    setVisibility: function (show) {
        if (!show) {
            var command1 = new draw2d.command.CommandDelete(this.principalTop);
            canvas.getCommandStack().execute(command1);
            var command2 = new draw2d.command.CommandDelete(this.principalEnd);
            canvas.getCommandStack().execute(command2);
            var command3 = new draw2d.command.CommandDelete(this.jail);
            canvas.getCommandStack().execute(command3);
        }
    },

    translate: function (side) {
        switch (side) {
            case 'left':
                this.principalEnd.translate((-(canvas.getWidth() / 5)), 0);
                this.principalTop.translate((-(canvas.getWidth() / 5)), 0);
                this.jail.translate((-(canvas.getWidth() / 5)), 0);

                for (const element of this.knowledgemarks) {
                    if (element.isSelected()) {
                        element.editPolicy.data[0].onUnselect();
                    }
                    element.uninstallEditPolicy(new draw2d.policy.figure.RegionEditPolicy(element.getAbsoluteX(), element.getAbsoluteY(), element.getWidth(), element.getHeight()));
                    element.translate((-(canvas.getWidth() / 5)), 0);
                    element.installEditPolicy(new draw2d.policy.figure.RegionEditPolicy(element.getAbsoluteX(), element.getAbsoluteY(), element.getWidth(), element.getHeight()));
                    if (element.isSelected()) {
                        element.editPolicy.data[0].onSelect(canvas, element, true);
                    }
                }
                break;
            case 'right':
                this.principalEnd.translate(((canvas.getWidth() / 5)), 0);
                this.principalTop.translate(((canvas.getWidth() / 5)), 0);
                this.jail.translate(((canvas.getWidth() / 5)), 0);

                for (const element of this.knowledgemarks) {
                    element.uninstallEditPolicy(new draw2d.policy.figure.RegionEditPolicy(element.getAbsoluteX(), element.getAbsoluteY(), element.getWidth(), element.getHeight()));
                    element.translate(((canvas.getWidth() / 5)), 0);
                    element.installEditPolicy(new draw2d.policy.figure.RegionEditPolicy(element.getAbsoluteX(), element.getAbsoluteY(), element.getWidth(), element.getHeight()));
                }
                break;
            default:
                console.log(`Sorry, the movement ${expr} is unkwown.`);
        }
    },

    addKnowledgeMark: function (kmark) {

        this.knowledgemarks.push(kmark);
        sessionStorage.sender = this.name;

    },

    lastKnowledgeMark: function () {
        if (this.knowledgemarks.length)
            return this.knowledgemarks[this.knowledgemarks.length - 1];
        else
            return null;
    },

    hideTimeLine: function () {
        this.timeLine.setVisible(false);
    }
});
