
import "./import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";


export default Class.extend({

	NAME: 'ToolbarMessage',

	init: function (elementIdTool, elementIdSubmit, view) {
		this.html = $("#" + elementIdTool);
		this.html1 = $("#" + elementIdSubmit);
		this.view = view;
		this.elements = null;

		// register this class as event listener for the canvas
		// CommandStack. This is required to update the state of 
		// the Undo/Redo Buttons.
		//
		view.getCommandStack().addEventListener(this);

		// Register a Selection listener for the state handling
		// of the Delete Button
		//
		view.on("select", $.proxy(this.onSelectionChanged, this));

		// Inject the UNDO Button and the callbacks
		//
		this.undoButton = $("<button class='gray undo'>Undo</button>");
		this.html.append(this.undoButton);
		this.undoButton.click($.proxy(function () {
			this.view.getCommandStack().undo();
		}, this));

		// Inject the REDO Button and the callback
		//
		this.redoButton = $("<button class='gray redo'>Redo</button>");
		this.html.append(this.redoButton);
		this.redoButton.click($.proxy(function () {
			this.view.getCommandStack().redo();
		}, this));

		this.delimiter = $("<span class='toolbar_delimiter'>&nbsp;</span>");
		this.html.append(this.delimiter);

		// Inject the DELETE Button
		//
		this.deleteButton = $("<button class='gray delete'>Delete</button>");
		this.html.append(this.deleteButton);
		this.deleteButton.click($.proxy(function () {
			var node = this.view.getPrimarySelection();
			this.view.removeInstance(node.NAME);
			var command = new draw2d.command.CommandDelete(node);
			this.view.getCommandStack().execute(command);
		}, this));

		this.disableButton(this.undoButton, true);
		this.disableButton(this.redoButton, true);
		this.disableButton(this.deleteButton, true);

		this.html.append($("<div id='toolbar_message_preview'>WAITING...</div>"));

		this.applyButton = $("<button class='apply'>Apply</button>");
		this.html1.append(this.applyButton);

		// create the message
		this.applyButton.click($.proxy(function () {
			// get all infos about the figures
			let result = [];
			view.getFigures().each((i, figure) => {
				result.push(figure.getPersistentAttributes());
			});
			view.getLines().each((i, figure) => {
				result.push(figure.getPersistentAttributes());
			});

			// select only useful shape and connection infos
			let shapeInfo = [];
			let connInfo = [];
			result.forEach(e => {
				let portInfo = [];
				if (e.type == "MyConnection") {
					portInfo = {
						"source": e.source,
						"target": e.target
					};
					connInfo.push({
						"type": e.type,
						"id": e.id,
						"name": e.name,
						"entities": e.entities,
						"ports": portInfo,
						"used": false
					});
				}
				else {	//is a shape
					e.ports?.forEach(port => {
						// work around for broken delete (entities are deleted, while ports are not)
						if (e.type != "Message" || e.entities.findIndex(entity => { return port.name == "input_" + entity.id }) != -1)
							portInfo.push({
								"name": port.name,
								"used": false
							});
					});
					shapeInfo.push({
						"type": e.type,
						"id": e.id,
						"name": e.name,
						"entities": e.entities,	//inner labels
						"ports": portInfo
					});
				}
			});

			let messageArray = JSON.parse(sessionStorage.message);
			let message = messageArray[messageArray.length - 1];
			message.messageFields = [];
			let badMessage = false;
			let cryptographicFunctions = ["asymmetricEncryption", "symmetricEncryption", "signature", "mac", "hash"];

			// find connected shapes and create its message
			const findConnectedShapes = (sourceShapeIndex, callback) => {
				shapeInfo[sourceShapeIndex].ports.forEach(sourceShapePort => {
					// for each input port, works backwards since we are starting from Message
					if (sourceShapePort.name.split("_")[0] == "output")
						return;
					// find the related connection
					let shapesConnection = connInfo.find(conn => { return (sourceShapePort.name == conn.ports.source.port || sourceShapePort.name == conn.ports.target.port) });
					if (shapesConnection) {
						let targetPort = null;	// the other end of the connection's port
						if (shapesConnection.ports.source.port == sourceShapePort.name)
							targetPort = shapesConnection.ports.target.port;
						else if (shapesConnection.ports.target.port == sourceShapePort.name)
							targetPort = shapesConnection.ports.source.port;
						// find the other end of the connection
						shapeInfo.forEach((targetShape, targetIndex) => {
							// find the target port
							let targetPortIndex = targetShape.ports.findIndex(port => { return targetPort == port.name });
							if (targetPortIndex != -1) {
								callback(targetIndex, targetPortIndex);
								targetShape.ports[targetPortIndex].used = true;
								sourceShapePort.used = true;
								shapesConnection.used = true;
							}
						});
					}
				});
			};

			// create the group content
			const createKnowledgeGroup = (sourceShapeIndex) => {
				// if the knowledge already exists
				if (shapeInfo[sourceShapeIndex].knowledgeGroup) return;

				shapeInfo[sourceShapeIndex].knowledgeGroup = [];

				findConnectedShapes(sourceShapeIndex, (targetIndex, targetPortIndex) => {
					if (shapeInfo[targetIndex].type == "Group") {
						shapeInfo[sourceShapeIndex].knowledgeGroup.push({ "referenceId": shapeInfo[targetIndex].id });
						createKnowledgeGroup(targetIndex);
					}
					else if (cryptographicFunctions.includes(shapeInfo[targetIndex].type)) {
						shapeInfo[sourceShapeIndex].knowledgeGroup.push({ "referenceId": shapeInfo[targetIndex].id });
						createCryptoFunContent(targetIndex);
					}
					else {
						shapeInfo[sourceShapeIndex].knowledgeGroup.push({ [shapeInfo[targetIndex].type]: shapeInfo[targetIndex].entities[targetPortIndex].text });
					}
				});
				message.messageFields.push({
					"id": shapeInfo[sourceShapeIndex].id,
					"knowledgeGroup": shapeInfo[sourceShapeIndex].knowledgeGroup
				});
			};

			// create the function content
			const createCryptoFunContent = (sourceShapeIndex) => {
				// if the knowledge already exists
				if (shapeInfo[sourceShapeIndex].cryptoFunContent) return;

				shapeInfo[sourceShapeIndex].cryptoFunContent = {
					"id": shapeInfo[sourceShapeIndex].id,
					"securityConcept": shapeInfo[sourceShapeIndex].type,
					"algorithm": shapeInfo[sourceShapeIndex].name
				};

				// required key for each function
				let key = "", JSONkeyName = "";
				switch (shapeInfo[sourceShapeIndex].type) {
					case "asymmetricEncryption":
						key = "asymmetricPublicKey";
						JSONkeyName = "encryptionKey";
						break;
					case "symmetricEncryption":
						key = "symmetricKey";
						JSONkeyName = "encryptionKey";
						break;
					case "mac":
						key = "symmetricKey";
						JSONkeyName = "authenticationKey";
						break;
					case "signature":
						key = "asymmetricPrivateKey";
						JSONkeyName = "signatureKey";
						break;
					case "hash":
						key = "";
						JSONkeyName = "";
						break;
					default:
						badMessage = true;
						break;
				}
				if (badMessage) return;

				findConnectedShapes(sourceShapeIndex, (targetIndex, targetPortIndex) => {
					if (shapeInfo[targetIndex].type == key) {	// if it is the key
						shapeInfo[sourceShapeIndex].cryptoFunContent[JSONkeyName] = { [key]: shapeInfo[targetIndex].entities[targetPortIndex].text };
					}
					else if (cryptographicFunctions.includes(shapeInfo[targetIndex].type)) {
						shapeInfo[sourceShapeIndex].cryptoFunContent.argument = { "referenceId": shapeInfo[targetIndex].id };
						createCryptoFunContent(targetIndex);
					}
					else if (shapeInfo[targetIndex].type == "Group") {
						shapeInfo[sourceShapeIndex].cryptoFunContent.argument = { "referenceId": shapeInfo[targetIndex].id };
						createKnowledgeGroup(targetIndex);
					}
					else {
						shapeInfo[sourceShapeIndex].cryptoFunContent.argument = { [shapeInfo[targetIndex].type]: shapeInfo[targetIndex].entities[targetPortIndex].text };
					}
				});
				message.messageFields.push(shapeInfo[sourceShapeIndex].cryptoFunContent);
			};

			// start from the message and go backwards
			let messageShapeIndex = shapeInfo.findIndex(e => { return e.type == "Message" });
			if (messageShapeIndex != -1) {
				message.messageName = shapeInfo[messageShapeIndex].name;	// add message name
				shapeInfo[messageShapeIndex].message = [];
				findConnectedShapes(messageShapeIndex, (targetIndex, targetPortIndex) => {
					if (cryptographicFunctions.includes(shapeInfo[targetIndex].type)) {
						shapeInfo[messageShapeIndex].message.push({ "referenceId": shapeInfo[targetIndex].id });
						createCryptoFunContent(targetIndex);
					}
					else if (shapeInfo[targetIndex].type == "Group") {
						shapeInfo[messageShapeIndex].message.push({ "referenceId": shapeInfo[targetIndex].id });
						createKnowledgeGroup(targetIndex);
					}
					else {
						shapeInfo[messageShapeIndex].message.push({ [shapeInfo[targetIndex].type]: shapeInfo[targetIndex].entities[targetPortIndex].text });
					}
				});
				message.messageFields.push({ "message": shapeInfo[messageShapeIndex].message });
			}
			else
				badMessage = true;

			// check if every port is used, except knowledge ones
			for (let i = 0; !badMessage && i < shapeInfo.length; i++)
				if (!["asymmetricPrivateKey", "asymmetricPublicKey", "symmetricKey", "bitstring", "timestamp", "idCertificate", "nonce"].includes(shapeInfo[i].type))
					for (let j = 0; !badMessage && j < shapeInfo[i].ports.length; j++)
						badMessage = !shapeInfo[i].ports[j].used

			// store message in session
			if (!badMessage) {
				let history = JSON.parse(sessionStorage.history);
				history.push({
					"key": "submitMessage",
					"result": sessionStorage.result ? JSON.parse(sessionStorage.result) : []
				});
				sessionStorage.history = JSON.stringify(history);

				sessionStorage.result = JSON.stringify(result); // used by reception

				messageArray[messageArray.length - 1] = message;
				sessionStorage.message = JSON.stringify(messageArray);

				sessionStorage.incomingMessage = "true";

				let parsedMessages = JSON.parse(sessionStorage.parsedMessages)
				parsedMessages.push(document.getElementById("toolbar_message_preview").innerHTML)
				sessionStorage.parsedMessages = JSON.stringify(parsedMessages)

				window.open("index.html", '_self');
			}
			else {
				alert("Message composition wrong");
			}
		}, this));

		this.cancelButton = $("<button class='cancel'>Cancel</button>");
		this.html1.append(this.cancelButton);
		this.cancelButton.click($.proxy(function () {
			let msg = JSON.parse(sessionStorage.message);
			msg.pop();
			if (msg.length > 0)
				sessionStorage.message = JSON.stringify(msg);
			else
				sessionStorage.removeItem("message");
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