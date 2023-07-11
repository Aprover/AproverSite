import "../import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";


export default draw2d.policy.figure.SelectionPolicy.extend({
	NAME: "SelectionMenuPolicy",

	init: function (attr, setter, getter) {
		this.overlay = null; // div DOM node
		this._super(attr, setter, getter);
	},

	/**
	 * @method
	 *
	 * @template
	 * @param {draw2d.Canvas} canvas the related canvas
	 * @param {draw2d.Figure} figure the selected figure
	 * @param {boolean} isPrimarySelection
	 */
	onSelect: function (canvas, figure, isPrimarySelection) {
		this._super(canvas, figure, isPrimarySelection);

		if (this.overlay === null) {
			let url = null;
			if (sessionStorage.incomingMessage == "true") {
				this.overlay = $("<div class='overlayMenu'><i class='iconify ico-overlay' data-icon='mdi:email-open'  data-align='left' style='color: #242424;'></i></div>");
				url = "receptionBuilder.html";
			}
			else {
				this.overlay = $("<div class='overlayMenu'><i class='iconify ico-overlay' data-icon='mdi:email-plus'  data-align='center' style='color: #242424;'></i></div>");
				url = "messageBuilder.html";
			}
			$(".seqdiagram").append(this.overlay);

			this.overlay.on("click", function () {
				window.open(url, '_self');
			})
		}
		this.posOverlay(figure);
	},

	/**
	 * @method
	 *
	 * @param {draw2d.Canvas} canvas the related canvas
	 * @param {draw2d.Figure} figure the unselected figure
	 */
	onUnselect: function (canvas, figure) {
		this._super(canvas, figure);

		this.overlay.remove();
		this.overlay = null;
	},

	onDrag: function (canvas, figure) {
		this._super(canvas, figure);
		this.posOverlay(figure);
	},

	posOverlay: function (figure) {
		this.overlay.css({
			"top": figure.getAbsoluteY() - 20,
			"left": figure.getAbsoluteX() + figure.getWidth() + 20
		});
	}
});