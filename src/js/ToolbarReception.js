
import "./import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";


export default Class.extend({

	NAME: 'ToolbarReception',

	init: function (elementIdSubmit) {
		this.html = $("#" + elementIdSubmit);
		this.elements = null;

		this.applyButton = $("<button class='apply'>Apply</button>");
		this.html.append(this.applyButton);

		// create the message
		this.applyButton.click($.proxy(function () {
			sessionStorage.incomingMessage = "false";
			window.open("index.html", "_self");
		}, this));
	},

	/**
	 * @method
	 * Called if the selection in the canvas has been changed. You must register this
	 * class on the canvas to receive this event.
	 *
	 * @param {draw2d.Canvas} emitter
	 * @param {Object} event
	 * @param {draw2d.Figure} event.figure
	 */
	onSelectionChanged: function (emitter, event) {
		this.disableButton(this.deleteButton, event.figure === null);
	},

	/**
	 * @method
	 * Sent when an event occurs on the command stack. draw2d.command.CommandStackEvent.getDetail() 
	 * can be used to identify the type of event which has occurred.
	 * 
	 * @template
	 * 
	 * @param {draw2d.command.CommandStackEvent} event
	 **/
	stackChanged: function (event) {
		this.disableButton(this.undoButton, !event.getStack().canUndo());
		this.disableButton(this.redoButton, !event.getStack().canRedo());
	},

	disableButton: function (button, flag) {
		button.prop("disabled", flag);
		if (flag) {
			button.addClass("disabled");
		}
		else {
			button.removeClass("disabled");
		}
	}
});