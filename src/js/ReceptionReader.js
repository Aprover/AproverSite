import "./import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";

import AsymmetricPrivateKey from "./shapes/AsymmetricPrivateKey.js"
import Nonce from "./shapes/Nonce.js";
import IdCertificate from "./shapes/IDCertificate.js";
import Bitstring from "./shapes/BitString.js";
import SymmetricKey from "./shapes/SymmetricKey.js";
import AsymmetricPublicKey from "./shapes/AsymmetricPublicKey.js";
import Message from "./shapes/Message.js";
import Timestamp from "./shapes/Timestamp.js";

import MyConnection from "./shapes/MyConnection.js";

import AsymmetricDecryption from "./shapes/AsymmetricDecryption.js";
import SymmetricDecryption from "./shapes/SymmetricDecryption.js";
import SignatureVerification from "./shapes/SignatureVerification.js";
import MACVerification from "./shapes/MACVerification.js";
import HashVerification from "./shapes/HashVerification.js";
import Split from "./shapes/Split.js";

export default draw2d.io.json.Reader.extend({
	init: function () {
	},

	/**
	 *
	 *
	 * get the input port of a given figure
	 *
	 * @param {draw2d.figure} node the given figure
	 * @param {Boolean} keyPort key port insstead of input value port
	 */
	getInputPort: function (node, keyPort = false) {
		let shape = node.children.data[1].figure;
		let type = node.cssClass;

		if (["asymmetricEncryption", "symmetricEncryption", "signature", "mac", "Group", "asymmetricDecryption", "symmetricDecryption", "signatureVerification", "macVerification"].includes(type)) {
			if (keyPort)
				return shape.children.data[0].figure.inputPorts.data[0];
			else
				return shape.children.data[2].figure.inputPorts.data[0];
		}
		else if (!keyPort) {
			if (type == "hash" || type == "hashVerification" || type == "Split") {
				return shape.children.data[0].figure.inputPorts.data[0];
			}
			else if (type != "Message") {   // knowledge, message has no input in reception
				return shape.inputPorts.data[0];
			}
		}
		return null;
	},

	/**
	 *
	 *
	 * get the output port of a given figure
	 *
	 * @param {draw2d.figure} node the given figure
	 * @param {Integer} index the message/split field index
	 */
	getOutputPort: function (node, index) {
		let shape = node.children.data[1].figure;
		let type = node.cssClass;

		if (["asymmetricEncryption", "symmetricEncryption", "signature", "mac", "Group", "asymmetricDecryption", "symmetricDecryption", "signatureVerification", "macVerification", "hash", "hashVerification"].includes(type))
			return shape.children.data[1].figure.outputPorts.data[0];
		else if (type == "Message" || type == "Split")
			return shape.children.data[index].figure.outputPorts.data[0];
		else    // knowledge
			return shape.outputPorts.data[0];
	},

	/**
	 *
	 *
	 * create and connect TargetType shape to sourcePort
	 * 
	 * @param {draw2d.canvas} canvas canvas
	 * @param {Obj} messageJson message data
	 * @param {String} targetType new shape type
	 * @param {draw2d.Port} sourcePort port used to connect the shape
	 * @param {Obj} funcInfoParam info
	 */
	createElementAndConnection: function (canvas, messageJson, targetType, sourcePort, funcInfoParam) {
		if ((!targetType) && (!sourcePort && targetType != "Message"))
			return;

		let resultJson = JSON.parse(sessionStorage.result);

		if (targetType == "Message") {
			// find the message and create it
			let messageIndex = messageJson.messageFields.findIndex(e => { return e.message });
			let messageShape = new Message();
			messageShape.addInOut(null, messageJson.messageFields[messageIndex].message.length, true); // true = reception mode

			// restore its attributes
			let shapeAttributes = resultJson.find(e => e.type == "Message");
			let reducedshapeAttributes = {
				"type": shapeAttributes.type,
				"id": shapeAttributes.id,
				"name": shapeAttributes.name,
				"x": shapeAttributes.x,
				"y": shapeAttributes.y,
				"width": shapeAttributes.width,
				"height": shapeAttributes.height,
				"radius": shapeAttributes.radius
			};
			messageShape.setPersistentAttributes(reducedshapeAttributes);
			canvas.add(messageShape);
			return messageShape;
		}
		else {
			let node = null;
			let isFunction = false;
			let funcInfo = funcInfoParam;
			let name = null;

			switch (targetType) {
				case "asymmetricEncryption":
					node = new AsymmetricDecryption();
					isFunction = true;
					name = " decryption";
					break;
				case "symmetricEncryption":
					node = new SymmetricDecryption();
					isFunction = true;
					name = " decryption";
					break;
				case "signature":
					node = new SignatureVerification();
					isFunction = true;
					name = " verification";
					break;
				case "mac":
					node = new MACVerification();
					isFunction = true;
					name = " verification";
					break;
				case "hash":
					node = new HashVerification();
					isFunction = true;
					name = " verification";
					break;
				case "Group":
					node = new Split();
					isFunction = true;
					name = " split";
					break;
				case "nonce":
					node = new Nonce();
					break;
				case "idCertificate":
					node = new IdCertificate();
					break;
				case "bitstring":
					node = new Bitstring();
					break;
				case "symmetricKey":
					node = new SymmetricKey();
					break;
				case "asymmetricPublicKey":
					node = new AsymmetricPublicKey();
					break;
				case "asymmetricPrivateKey":
					node = new AsymmetricPrivateKey();
					break;
				case "timestamp":
					node = new Timestamp();
					break;
			}

			let shapeAttributes;
			let txt = null;
			let inputKeyShape = false;

			if (isFunction) {	// setup shape title
				shapeAttributes = resultJson.find(e => e.id == funcInfo.referenceId);
				name = shapeAttributes.name + name;
			}
			else {	// setup text content
				// if creating the key for decryption/verification
				if (funcInfo?.invertedFunction) {
					if (targetType == "asymmetricPrivateKey")
						targetType = "asymmetricPublicKey";
					else if (targetType == "asymmetricPublicKey")
						targetType = "asymmetricPrivateKey";
				}
				shapeAttributes = resultJson.find(e => e.type == targetType);
				txt = (funcInfo?.keyValue) ? funcInfo.keyValue : shapeAttributes.labels[1].text;
				if (funcInfo?.inputKeyShape)
					inputKeyShape = true;   // false = response
			}

			node.addInOut(inputKeyShape, txt);
			if (!name)
				name = node.classLabel.text;

			let reducedshapeAttributes = {
				"type": shapeAttributes.type,
				"id": shapeAttributes.id,
				"name": name,
				"x": inputKeyShape ? shapeAttributes.x : canvas.getWidth() - shapeAttributes.x,
				"y": shapeAttributes.y,
				"width": shapeAttributes.width,
				"height": shapeAttributes.height,
				"radius": shapeAttributes.radius
			};

			node.setPersistentAttributes(reducedshapeAttributes);
			canvas.add(node);   // add the shape

			// set the connection
			let nodePort = inputKeyShape ? this.getOutputPort(node) : this.getInputPort(node);
			let connection = new MyConnection();
			connection.setSource(sourcePort);
			connection.setTarget(nodePort);
			canvas.add(connection);   // add the shape

			return {
				"node": node,
				"isFunction": isFunction
			};
		}
	},


	/**
	 *
	 * function activated by menu label click
	 * create the specified figure, then add menus
	 * 
	 * @param {draw2d.canvas} canvas canvas
	 * @param {Obj} messageJson message data
	 * @param {String} targetType new shape type
	 * @param {draw2d.Port} sourcePort port used to connect the shape
	 * @param {Obj} funcInfoParam info
	 * @param {ReceptionReader} reader istance of this class
	 */
	contextMenu: function (canvas, messageJson, targetType, sourcePort, funcInfoParam, reader) {
		let res = reader.createElementAndConnection(canvas, messageJson, targetType, sourcePort, funcInfoParam);
		let node = res.node;
		let isFunction = res.isFunction;

		if (isFunction) {
			// connect the key for decryption
			if (targetType != "Group") {
				let keyType = "";
				if (targetType == "symmetricEncryption" || targetType == "mac")
					keyType = "symmetricKey";
				else if (targetType == "asymmetricEncryption")
					keyType = "asymmetricPrivateKey";
				else if (targetType == "signature")
					keyType = "asymmetricPublicKey";
				reader.createElementAndConnection(canvas, messageJson, keyType, reader.getInputPort(node, true), { "inputKeyShape": true, "invertedFunction": true, "keyValue": funcInfoParam.keyValue });
			}

			// find the connected shape
			let nextTarget = [];    // referenceId
			let simpleShapes = [];  // knowledge elements
			if (targetType != "Group") {
				if (messageJson.messageFields[funcInfoParam.targetIndex].argument.referenceId)
					nextTarget.push(messageJson.messageFields.find(e => { return e.id == messageJson.messageFields[funcInfoParam.targetIndex].argument.referenceId }));
				else
					simpleShapes.push(messageJson.messageFields[funcInfoParam.targetIndex].argument);
			}
			else {
				messageJson.messageFields[funcInfoParam.targetIndex].knowledgeGroup.forEach((e, i) => {
					if (e.referenceId) {
						nextTarget.push(messageJson.messageFields.find(el => { return el.id == e.referenceId }));
						nextTarget[nextTarget.length - 1].index = (i * 2) + 1;
					}
					else {
						simpleShapes.push(e);
						simpleShapes[simpleShapes.length - 1].index = (i * 2) + 1;
					}
				});
			}

			// create and connect all knowledge elements
			for (let i = 0; i < simpleShapes.length; i++) {
				let simpleShape = null;

				if (simpleShapes[i].nonce)
					simpleShape = "nonce";
				else if (simpleShapes[i].idCertificate)
					simpleShape = "idCertificate";
				else if (simpleShapes[i].bitstring)
					simpleShape = "bitstring";
				else if (simpleShapes[i].symmetricKey)
					simpleShape = "symmetricKey";
				else if (simpleShapes[i].asymmetricPublicKey)
					simpleShape = "asymmetricPublicKey";
				else if (simpleShapes[i].asymmetricPrivateKey)
					simpleShape = "asymmetricPrivateKey";
				else if (simpleShapes[i].timestamp)
					simpleShape = "timestamp";

				reader.createElementAndConnection(canvas, messageJson, simpleShape, reader.getOutputPort(node, simpleShapes[i].index), { "keyValue": simpleShapes[i][simpleShape] });

				let knowledge = JSON.parse(sessionStorage.knowledge);
				let field = null;
				if (simpleShape != "asymmetricPublicKey")
					field = knowledge[simpleShape].find(e => e.value == simpleShapes[i][simpleShape]);
				else {
					field = knowledge.asymmetricPrivateKey.find(e => e.derivedPublicKey.value == simpleShapes[i][simpleShape]);
					field = field.derivedPublicKey;
				}

				if (!field.knownBy.includes(messageJson.receiver))
					field.knownBy.push(messageJson.receiver);
				if (funcInfoParam.noChiper && !field.knownBy.includes("Attacker"))
					field.knownBy.push("Attacker");
				sessionStorage.knowledge = JSON.stringify(knowledge);
			}

			let noChiper = funcInfoParam.noChiper;	// true = data not encrypted
			for (let i = 0; i < nextTarget.length; i++) {
				let funcInfo = {
					"targetIndex": funcInfoParam.targetIndex,
					"noCipher": funcInfoParam.noChiper
				}
				funcInfo.referenceId = nextTarget[i].id;
				funcInfo.targetIndex = messageJson.messageFields.findIndex(e => e.id == nextTarget[i].id);
				funcInfo.securityConcept = nextTarget[i].securityConcept;

				// check if receiver knows key for decryption/verification
				let found = true;
				if (["asymmetricEncryption", "symmetricEncryption", "signature", "mac"].includes(nextTarget[i].securityConcept)) {
					let funcKey = "";
					if (nextTarget[i].securityConcept == "signature")
						funcKey = "signatureKey"
					else if (nextTarget[i].securityConcept == "mac")
						funcKey = "authenticationKey"
					else
						funcKey = "encryptionKey";

					for (const [key, value] of Object.entries(nextTarget[i][funcKey])) {
						let knowledge = JSON.parse(sessionStorage.knowledge);
						let otherKey = null;
						switch (nextTarget[i].securityConcept) {
							case "asymmetricEncryption":
								otherKey = (knowledge.asymmetricPrivateKey.find(e => { return (e.derivedPublicKey.value == value) }));
								found = otherKey.knownBy.includes(messageJson.receiver);
								if (found)
									funcInfo.keyValue = otherKey.value;
								break;
							case "symmetricEncryption":
								found = (knowledge.symmetricKey.findIndex(e => { return (e.value == value && e.knownBy.includes(messageJson.receiver)) }) != -1);
								break;
							case "signature":
								otherKey = (knowledge.asymmetricPrivateKey.find(e => { return (e.value == value) }));
								found = otherKey.derivedPublicKey.knownBy.includes(messageJson.receiver);
								if (found)
									funcInfo.keyValue = otherKey.derivedPublicKey.value;
								break;
							case "mac":
								found = (knowledge.symmetricKey.findIndex(e => { return (e.value == value && e.knownBy.includes(messageJson.receiver)) }) != -1);
								break;
							default:
								found = false
								break;
						}
					}
				}

				let name;
				if (!found) {
					name = nextTarget[i].securityConcept + ": no valid key found";
				}
				else if (nextTarget[i].knowledgeGroup) {
					name = "Group: Split";
					funcInfo.noChiper = noChiper;
				}
				else if (nextTarget[i].securityConcept == "hash" || nextTarget[i].securityConcept == "mac") {
					name = [nextTarget[i].securityConcept] + ": Verify";
					funcInfo.noChiper = false;
				}
				else if (["asymmetricEncryption", "symmetricEncryption", "signature"].includes(nextTarget[i].securityConcept)) {
					name = [nextTarget[i].securityConcept] + ": Decrypt";
					funcInfo.noChiper = false;
				}

				let sourceField = targetType == "Group" ? nextTarget[i].index : 1;
				let sourcePort = reader.getOutputPort(node, sourceField);

				// set the menu for extraction
				node.children.data[1].figure.children.data[sourceField].figure.on("contextmenu", function ExtractionMenu(emitter, event) {
					$.contextMenu({
						selector: 'body',
						events:
						{
							hide: function () { $.contextMenu('destroy'); }
						},
						callback: $.proxy(function (key, options) {
							switch (key) {
								case "apply":
									if (found)
										reader.contextMenu(canvas, messageJson, (nextTarget[i].securityConcept || "Group"), sourcePort, Object.assign(funcInfo), reader);
									break;
								default:
									break;
							}
						}, reader),
						x: event.x,
						y: event.y,
						items: {
							"apply": { "name": name }
						}
					});
				});
			}
		}
	}
});