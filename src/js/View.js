import "./import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";
import asymmetricEncryption from "./shapes/AsymmetricEncryption.js";
import asymmetricPrivateKey from "./shapes/AsymmetricPrivateKey.js"
import symmetricEncryption from "./shapes/SymmetricEncryption.js";
import signature from "./shapes/Signature.js";
import mac from "./shapes/MAC.js";
import hash from "./shapes/Hash.js";
import Group from "./shapes/Group.js";
import nonce from "./shapes/Nonce.js";
import idCertificate from "./shapes/IDCertificate.js";
import bitstring from "./shapes/BitString.js";
import symmetricKey from "./shapes/SymmetricKey.js";
import asymmetricPublicKey from "./shapes/AsymmetricPublicKey.js";
import Message from "./shapes/Message.js";
import timestamp from "./shapes/Timestamp.js";

export default draw2d.Canvas.extend({
    NAME: 'View',

    init: function (id, parser) {
        this._super(id, 2000, 2000);

        this.setScrollArea("#" + id);

        this.parser = parser;

        this.asymprivkey = 0;
        this.nonce = 0;
        this.idcert = 0;
        this.bitstring = 0;
        this.symkey = 0;
        this.asympubkey = 0;
        this.message = 0;
        this.timestamp = 0;
        this.types = {
            "asymmetricEncryption": asymmetricEncryption, "asymmetricPrivateKey": asymmetricPrivateKey,
            "symmetricEncryption": symmetricEncryption, "signature": signature, "mac": mac, "hash": hash, "Group": Group,
            "nonce": nonce, "idCertificate": idCertificate, "bitstring": bitstring, "symmetricKey": symmetricKey,
            "asymmetricPublicKey": asymmetricPublicKey, "Message": Message, "timestamp": timestamp
        };
    },

    /**
     * @method
     * Called if the user drop the droppedDomNode onto the canvas.<br>
     * <br>
     * Draw2D use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     * 
     * @param {HTMLElement} droppedDomNode The dropped DOM element.
     * @param {Number} x the x coordinate of the drop
     * @param {Number} y the y coordinate of the drop
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     * @private
     **/
    onDrop: function (droppedDomNode, x, y, shiftKey, ctrlKey) {
        var type = $(droppedDomNode).data("shape");
        if ((this.message < 1 || type !== "Message") && (this.nonce < 1 || type !== "nonce") && (this.timestamp < 1 || type !== "timestamp")
            && (this.idcert < 1 || type !== "idCertificate") && (this.bitstring < 1 || type !== "bitstring")
            && (this.symkey < 1 || type !== "symmetricKey") && (this.asympubkey < 1 || type !== "asymmetricPublicKey")
            && (this.asymprivkey < 1 || type !== "asymmetricPrivateKey")) {

            var figure = new this.types[type]();
            if (type === "Message")
                figure.addInOut(this.parser);
            else
                figure.addInOut(true);  // parameter used only by knowledge elements

            switch (type) {
                case "symmetricEncryption": figure.setName("AES"); break;
                case "asymmetricEncryption": figure.setName("RSA"); break;
                case "signature": figure.setName("DSA"); break;
                case "mac": figure.setName("mac"); break;
                case "hash": figure.setName("SHA3"); break;
                case "Message": figure.setName("Message Name"); this.message = this.message + 1; break;
                case "Group": figure.setName("Group"); break;
                case "nonce": figure.setName("nonce"); this.nonce = this.nonce + 1; break;
                case "idCertificate": figure.setName("ID Certificate"); this.idcert = this.idcert + 1; break;
                case "bitstring": figure.setName("bitstring"); this.bitstring = this.bitstring + 1; break;
                case "timestamp": figure.setName("timestamp"); this.timestamp = this.timestamp + 1; break;
                case "symmetricKey": figure.setName("Symmetric Key"); this.symkey = this.symkey + 1; break;
                case "asymmetricPublicKey": figure.setName("Asymmetric Public Key"); this.asympubkey = this.asympubkey + 1; break;
                case "asymmetricPrivateKey": figure.setName("Asymmetric Private Key"); this.asymprivkey = this.asymprivkey + 1; break;
                default: console.log("error 404: Type not Found");
            }

            // create a command for the undo/redo support
            var command = new draw2d.command.CommandAdd(this, figure, x, y);
            this.getCommandStack().execute(command);
        }
    },

    removeInstance: function (name) {
        switch (name) {
            case "Message": this.message--; break;
            case "nonce": this.nonce--; break;
            case "idCertificate": this.idcert--; break;
            case "bitstring": this.bitstring--; break;
            case "timestamp": this.timestamp--; break;
            case "symmetricKey": this.symkey--; break;
            case "asymmetricPublicKey": this.asympubkey--; break;
            case "asymmetricPrivateKey": this.asymprivkey--; break;
        }
    }
});