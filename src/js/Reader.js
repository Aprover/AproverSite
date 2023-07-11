import "./import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";

import AsymmetricEncryption from "./shapes/AsymmetricEncryption.js";
import AsymmetricPrivateKey from "./shapes/AsymmetricPrivateKey.js"
import SymmetricEncryption from "./shapes/SymmetricEncryption.js";
import Signature from "./shapes/Signature.js";
import MAC from "./shapes/MAC.js";
import Hash from "./shapes/Hash.js";
import Group from "./shapes/Group.js";
import Nonce from "./shapes/Nonce.js";
import IdCertificate from "./shapes/IDCertificate.js";
import Bitstring from "./shapes/BitString.js";
import SymmetricKey from "./shapes/SymmetricKey.js";
import AsymmetricPublicKey from "./shapes/AsymmetricPublicKey.js";
import Message from "./shapes/Message.js";
import Timestamp from "./shapes/Timestamp.js";
import MyConnection from "./shapes/MyConnection.js";

export default draw2d.io.json.Reader.extend({
    init: function () {
        this.types = {
            "asymmetricEncryption": AsymmetricEncryption,
            "asymmetricPrivateKey": AsymmetricPrivateKey,
            "symmetricEncryption": SymmetricEncryption,
            "signature": Signature,
            "mac": MAC,
            "hash": Hash,
            "Group": Group,
            "nonce": Nonce,
            "idCertificate": IdCertificate,
            "bitstring": Bitstring,
            "symmetricKey": SymmetricKey,
            "asymmetricPublicKey": AsymmetricPublicKey,
            "Message": Message,
            "timestamp": Timestamp,
            "MyConnection": MyConnection
        };
    },

    /**
     *
     *
     * get the specified port of a given figure
     *
     * @param {draw2d.figure} node the given figure
     * @param {String} target the port name
     * @returns {draw2d.Port}
     */
    getPort: function (node, target) {
        let shape = node.children.data[1].figure;
        let type = node.cssClass;

        if (["asymmetricEncryption", "symmetricEncryption", "signature", "mac", "Group"].includes(type)) {
            if (shape.children.data[0].figure.inputPorts.data[0].name == target)    // key
                return shape.children.data[0].figure.inputPorts.data[0];
            else if (shape.children.data[1].figure.outputPorts.data[0].name == target)  // chipertext
                return shape.children.data[1].figure.outputPorts.data[0];
            else if (shape.children.data[2].figure.inputPorts.data[0].name == target)   // knowledge
                return shape.children.data[2].figure.inputPorts.data[0];
        }
        else switch (type) {
            case "hash":
                if (shape.children.data[0].figure.inputPorts.data[0].name == target)    // knowledge
                    return shape.children.data[0].figure.inputPorts.data[0];
                else if (shape.children.data[1].figure.outputPorts.data[0].name == target)  // digest
                    return shape.children.data[1].figure.outputPorts.data[0];
                break;
            case "Message":
                for (let i = 0; i < shape.children.data.length; i++)
                    if (shape.children.data[i].figure.inputPorts.data[0].name == target)
                        return shape.children.data[i].figure.inputPorts.data[0];
                break;
            default:    // knowledge
                return shape.outputPorts.data[0];
        }
    },

    /**
     *
     *
     * Restore the canvas from a given JSON object.
     *
     * @param {draw2d.Canvas} canvas the canvas to restore
     * @param {Object|String} json the json object to load.
     */
    unmarshal: function (canvas, json, parser) {
        if (typeof json === "string") {
            json = JSON.parse(json);
        }

        let node = null;
        json.forEach((e) => {
            let element;    // get only some attributes
            if (e.type == "MyConnection")
                element = {
                    "type": e.type,
                    "id": e.id,
                    "name": e.name,
                    "source": {
                        "node": e.source.node,
                        "port": e.source.port
                    },
                    "target": {
                        "node": e.target.node,
                        "port": e.target.port
                    },
                    "vertex": e.vertex
                };
            else
                element = {
                    "type": e.type,
                    "id": e.id,
                    "name": e.name,
                    "x": e.x,
                    "y": e.y,
                    "width": e.width,
                    "height": e.height,
                    "radius": e.radius
                };

            let source = null;
            let target = null;
            let shape = new this.types[element.type]();
            shape.id = element.id;
            if (element.type != "MyConnection") {
                if (element.type == "Message")
                    shape.addInOut(null, e.ports.length);
                else
                    shape.addInOut();

                shape.setName(element.name);
            }
            else {  // if it is a connection get the source and the target
                let val = element.source;
                node = canvas.getFigure(val.node);
                if (!node) {
                    throw "Source figure with id '" + val.node + "' not found";
                }
                source = this.getPort(node, val.port);
                if (!source) {
                    throw "Unable to find source port '" + val.port + "' at figure '" + val.node + "' to unmarschal '" + element.type + "'";
                }

                val = element.target;
                node = canvas.getFigure(val.node);
                if (!node) {
                    throw "Target figure with id '" + val.node + "' not found";
                }
                target = this.getPort(node, val.port);
                if (!target) {
                    throw "Unable to find target port '" + val.port + "' at figure '" + val.node + "' to unmarschal '" + element.type + "'";
                }

                if (source !== null && target !== null) {
                    // don't change the order or the source/target set.
                    // TARGET must always be the second one because some applications needs the "source"
                    // port in the "connect" event of the target.
                    shape.setSource(source);
                    shape.setTarget(target);
                }
            }

            shape.setPersistentAttributes(element);

            // set the original port names
            if (element.type != "MyConnection") {
                if (["asymmetricEncryption", "symmetricEncryption", "signature", "mac", "Group"].includes(element.type)) {
                    shape.children.data[1].figure.children.data[0].figure.inputPorts.data[0].name = e.ports[0].name;
                    shape.children.data[1].figure.children.data[1].figure.outputPorts.data[0].name = e.ports[1].name;
                    shape.children.data[1].figure.children.data[2].figure.inputPorts.data[0].name = e.ports[2].name;
                }
                else switch (element.type) {
                    case "hash":
                        shape.children.data[1].figure.children.data[0].figure.inputPorts.data[0].name = e.ports[0].name;
                        shape.children.data[1].figure.children.data[1].figure.outputPorts.data[0].name = e.ports[1].name;
                        break;
                    case "Message":
                        e.ports.forEach((p, i) => shape.children.data[1].figure.children.data[i].figure.inputPorts.data[0].name = p.name);
                        break;
                    default:    //knowledge
                        shape.children.data[1].figure.outputPorts.data[0].name = e.ports[0].name;
                        break;
                }
            }

            canvas.add(shape);
        });

        // recalculate all crossings and repaint the connections with
        // possible crossing decoration
        canvas.calculateConnectionIntersection();
        canvas.getLines().each((i, line) => {
            line.svgPathString = null;
            line.repaint();
        });
        canvas.linesToRepaintAfterDragDrop = canvas.getLines().clone();

        canvas.showDecoration();
    }
});