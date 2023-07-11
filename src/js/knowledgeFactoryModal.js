/* HTML for each knowledge element */

import '../scss/modalKnowledge.scss'
// Load Bootstrap init
import { initBootstrap } from "./bootstrap.js";
import KnowledgeManager from './KnowledgeManager.js';

// Loading bootstrap with optional features
initBootstrap({
    tooltip: true,
    popover: true,
    toasts: true,
});
//
import "./import-jquery.js";
import "jquery-ui-bundle"; // you also need this
import "jquery-ui-bundle/jquery-ui.css";
import draw2d from "draw2d_aprover";

window.$ = jQuery;
window.jQuery = jQuery;

const HTML_PUB_KEY = `
<div class="modal" id="modal-pub-key" tabindex="-1" role="dialog">
<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header header_color">
            <h5 class="modal-title">Asym. Public Key</h5>
        </div>
        <div class="modal-body">
            <form>
                <div class="container">
                    <div class="d-flex flex-column">
                    </div>
                    <div class="mt-auto p-2">
                    <label  class="form-label modal_label_text">Derived from:</label>
                    <select class="form-select " aria-label="Default select example" id="selectDerivedFrom">
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                </div>
                <div class="d-flex flex-column flex-fill p-2">
                    <label  class="form-label modal_label_text">Shared with:</label>
                        <fieldset class="border rounded-3 p-3" legend class="float-none w-auto px-3">
                           
                            <div class="form-check">
                                <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckAlice_pub-key"></input> 
                                <label class="form-check-label" for="flexCheckAlice_pub-key">Alice</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckBob_pub-key"></input> 
                                <label class="form-check-label" for="flexCheckBob_pub-key">Bob</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckServer_pub-key"></input> 
                                <label class="form-check-label" for="flexCheckServer_pub-key">Server</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckAttacker_pub-key"></input> 
                                <label class="form-check-label" for="flexCheckAttacker_pub-key">Attacker</label>
                            </div>
                        </fieldset>
                </div>
            </form>
        </div>
        <div class="modal-footer border-0">
            <button type="button" id="cancel-pub-key" class="btn btn-danger" data-dismiss="modal">Cancel</button>
            <button type="button" id="submit-pub-key" class="btn btn-primary" data-dismiss="modal">Add</button>
        </div>
    </div>
</div>
</div>
    `;

const HTML_PRIV_KEY = `
    <div class="modal" id="modal-priv-key" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header header_color">
                <h5 class="modal-title">Asym. Private Key</h5>
            </div>
            <div class="modal-body">
                <form>
                    <div class="container">
                        <div class="d-flex flex-column">
                            <div class="p-2">
                                <label for="userInput_priv-key" class="form-label modal_label_text">Symbolic Name:</label>
                                <input type="text" class="form-control" id="userInput_priv-key" value="KPRIV_A" required></input>
                                <div class="valid-feedback"></div>
                            </div>
                            <div class="d-flex flex-column flex-fill p-2">
                            <label  class="form-label modal_label_text" style="color: #990000;">Leaked:</label>
                                <fieldset class="border rounded-3 p-3" legend class="float-none w-auto px-3" style="border: #990000 !important;border-style: solid !important;">
                                   
                                    <div class="form-check">
                                        <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckLeakAlice_priv-key"></input> 
                                        <label class="form-check-label" for="flexCheckLeakAlice_priv-key">Alice</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckLeakBob_priv-key"></input> 
                                        <label class="form-check-label" for="flexCheckLeakBob_priv-key">Bob</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckLeakServer_priv-key"></input> 
                                        <label class="form-check-label" for="flexCheckLeakServer_priv-key">Server</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckLeakAttacker_priv-key"></input> 
                                        <label class="form-check-label" for="flexCheckLeakAttacker_priv-key">Attacker</label>
                                    </div>
                                </fieldset>
                            </div>
                            <div class="p-2">
                            <label for="userInputDerived_priv-key" class="form-label modal_label_text">Derived Public Key:</label>
                            <input type="text" class="form-control" id="userInputDerived_priv-key" value="KPUB_A" required></input> 
                            <div class="valid-feedback"></div>
                        </div>
                        <div class="d-flex flex-column flex-fill p-2">
                        <label class="form-label modal_label_text">Shared with:</label>
                        <fieldset class="border rounded-3 p-3" legend class="float-none w-auto px-3">
                           
                            <div class="form-check">
                                <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckAlice_priv-key" checked></input> 
                                <label class="form-check-label" for="flexCheckAlice_priv-key">Alice</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckBob_priv-key" checked></input> 
                                <label class="form-check-label" for="flexCheckBob_priv-key">Bob</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckServer_priv-key" checked></input> 
                                <label class="form-check-label" for="flexCheckServer_priv-key">Server</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckAttacker_priv-key" checked></input> 
                                <label class="form-check-label" for="flexCheckAttacker_priv-key">Attacker</label>
                            </div>
                        </fieldset>
                    </div>
                       
                    </div>
                </form>
            </div>
            <div class="modal-footer border-0">
                <button type="button" id="cancel-priv-key" class="btn btn-danger" data-dismiss="modal">Cancel</button>
                <button type="button" id="submit-priv-key" class="btn btn-primary" data-dismiss="modal">Add</button>
            </div>
        </div>
    </div>
    </div>
        `;

const HTML_SYMM_KEY = `
        <div class="modal" id="modal-symm-key" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header header_color">
                    <h5 class="modal-title">Symmetric Key</h5>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="container">
                            <div class="d-flex flex-column">
                                <div class="p-2">
                                    <label for="userInput_symm-key" class="form-label modal_label_text">Symbolic Name:</label>
                                    <input type="text" class="form-control" id="userInput_symm-key" value="SymKey" required></input> 
                                    <div class="valid-feedback"></div>
                                </div>
                            </div>

                            <div class="d-flex flex-column flex-fill p-2">
                                <label class="form-label modal_label_text">Shared with:</label>
                                <fieldset class="border rounded-3 p-3" legend class="float-none w-auto px-3">
                                    <div class="form-check">
                                        <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckAlice_symm-key"></input> 
                                        <label class="form-check-label" for="flexCheckAlice_symm-key">Alice</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckBob_symm-key"></input> 
                                        <label class="form-check-label" for="flexCheckBob_symm-key">Bob</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckServer_symm-key"></input> 
                                        <label class="form-check-label" for="flexCheckServer_symm-key">Server</label>
                                    </div>
                                </fieldset>
                            </div>
                            
                            <div class="d-flex flex-column flex-fill p-2">
                            <label  class="form-label modal_label_text" style="color: #990000;">Leaked:</label>
                                <fieldset class="border rounded-3 p-3" legend class="float-none w-auto px-3" style="border: #990000 !important;border-style: solid !important;">
                                    <div class="form-check">
                                        <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckAttacker_symm-key"></input> 
                                        <label class="form-check-label" for="flexCheckAttacker_symm-key">Attacker</label>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" id="cancel-symm-key" class="btn btn-danger" data-dismiss="modal">Cancel</button>
                    <button type="button" id="submit-symm-key" class="btn btn-primary" data-dismiss="modal">Add</button>
                </div>
            </div>
        </div>
        </div>
            `;

const HTML_NONCE = `
            <div class="modal" id="modal-nonce" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header header_color">
                        <h5 class="modal-title">nonce</h5>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="container">
                                <div class="d-flex flex-column">
                                    <div class="p-2">
                                        <label for="userInput_nonce" class="form-label modal_label_text">Symbolic Name:</label>
                                        <input type="text" class="form-control" id="userInput_nonce" value="nonce" required></input> 
                                        <div class="valid-feedback"></div>
                                    </div>
                                    
                                </div>
                                <div class="d-flex flex-column flex-fill p-2">
                                <label  class="form-label modal_label_text">Shared with:</label>
                                    <fieldset class="border rounded-3 p-3" legend class="float-none w-auto px-3">
                                   
                                        <div class="form-check">
                                            <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckAlice_nonce"></input> 
                                            <label class="form-check-label" for="flexCheckAlice_nonce">Alice</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckBob_nonce"></input> 
                                            <label class="form-check-label" for="flexCheckBob_nonce">Bob</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckServer_nonce"></input> 
                                            <label class="form-check-label" for="flexCheckServer_nonce">Server</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckAttacker_nonce"></input> 
                                            <label class="form-check-label" for="flexCheckAttacker_nonce">Attacker</label>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" id="cancel-nonce" class="btn btn-danger" data-dismiss="modal">Cancel</button>
                        <button type="button" id="submit-nonce" class="btn btn-primary" data-dismiss="modal">Add</button>
                    </div>
                </div>
            </div>
            </div>
                `;

const HTML_TIMESTAMP = `
            <div class="modal" id="modal-timestamp" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header header_color">
                        <h5 class="modal-title">Timestamp</h5>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="container">
                                <div class="d-flex flex-column">
                                    <div class="p-2">
                                        <label for="userInput_timestamp" class="form-label modal_label_text">Symbolic Name:</label>
                                        <input type="text" class="form-control" id="userInput_timestamp" value="timestamp" required></input> 
                                        <div class="valid-feedback"></div>
                                    </div>
                                    
                                </div>
                                <div class="d-flex flex-column flex-fill p-2">
                                <label  class="form-label modal_label_text">Shared with:</label>
                                    <fieldset class="border rounded-3 p-3" legend class="float-none w-auto px-3">
                                   
                                        <div class="form-check">
                                            <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckAlice_timestamp"></input> 
                                            <label class="form-check-label" for="flexCheckAlice_timestamp">Alice</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckBob_timestamp"></input> 
                                            <label class="form-check-label" for="flexCheckBob_timestamp">Bob</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckServer_timestamp"></input> 
                                            <label class="form-check-label" for="flexCheckServer_timestamp">Server</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckAttacker_timestamp"></input> 
                                            <label class="form-check-label" for="flexCheckAttacker_timestamp">Attacker</label>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" id="cancel-timestamp" class="btn btn-danger" data-dismiss="modal">Cancel</button>
                        <button type="button" id="submit-timestamp" class="btn btn-primary" data-dismiss="modal">Add</button>
                    </div>
                </div>
            </div>
            </div>
                `;

const HTML_BITSTRING = `
        <div class="modal" id="modal-bitstring" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header header_color">
                    <h5 class="modal-title">Bitstring</h5>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="container">
                            <div class="d-flex flex-column">
                                <div class="p-2">
                                    <label for="userInput_bitstring" class="form-label modal_label_text">Symbolic Name:</label>
                                    <input type="text" class="form-control" id="userInput_bitstring" value="bitstring" required></input> 
                                    <div class="valid-feedback"></div>
                                </div>
                                
                            </div>
                            <div class="d-flex flex-column flex-fill p-2">
                            <label  class="form-label modal_label_text">Shared with:</label>
                                <fieldset class="border rounded-3 p-3" legend class="float-none w-auto px-3">
                                    
                                    <div class="form-check">
                                            <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckAlice_bitstring"></input> 
                                            <label class="form-check-label" for="flexCheckAlice_bitstring">Alice</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckBob_bitstring"></input> 
                                            <label class="form-check-label" for="flexCheckBob_bitstring">Bob</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckServer_bitstring"></input> 
                                            <label class="form-check-label" for="flexCheckServer_bitstring">Server</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckAttacker_bitstring"></input> 
                                            <label class="form-check-label" for="flexCheckAttacker_bitstring">Attacker</label>
                                        </div>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" id="cancel-bitstring" class="btn btn-danger" data-dismiss="modal">Cancel</button>
                    <button type="button" id="submit-bitstring" class="btn btn-primary" data-dismiss="modal">Add</button>
                </div>
            </div>
        </div>
        </div>
            `;

const HTML_CERTIFICATE = `
            <div class="modal" id="modal-cert" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header header_color">
                        <h5 class="modal-title">Certificate</h5>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="container">
                                <div class="d-flex flex-column">
                                    <div class="p-2">
                                        <label for="userInput_cert" class="form-label modal_label_text">Symbolic Name:</label>
                                        <input type="text" class="form-control" id="userInput_cert" value="ID Certificate" required></input> 
                                        <div class="valid-feedback"></div>
                                    </div>
                                    
                                </div>
                                <div class="d-flex flex-column flex-fill p-2">
                                <label  class="form-label modal_label_text">Shared with:</label>
                                    <fieldset class="border rounded-3 p-3" legend class="float-none w-auto px-3">
                                        
                                        <div class="form-check">
                                            <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckAlice_cert"></input> 
                                            <label class="form-check-label" for="flexCheckAlice_cert">Alice</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckBob_cert"></input> 
                                            <label class="form-check-label" for="flexCheckBob_cert">Bob</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckServer_cert"></input> 
                                            <label class="form-check-label" for="flexCheckServer_cert">Server</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input actor_checkbox" type="checkbox" value="" id="flexCheckAttacker_cert"></input> 
                                            <label class="form-check-label" for="flexCheckAttacker_cert">Attacker</label>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" id="cancel-cert" class="btn btn-danger" data-dismiss="modal">Cancel</button>
                        <button type="button" id="submit-cert" class="btn btn-primary" data-dismiss="modal">Add</button>
                    </div>
                </div>
            </div>
            </div>
                `;

const mapModalObject = {
    "HTML_PUB_KEY": HTML_PUB_KEY, "HTML_PRIV_KEY": HTML_PRIV_KEY, "HTML_SYMM_KEY": HTML_SYMM_KEY,
    "HTML_NONCE": HTML_NONCE, "HTML_TIMESTAMP": HTML_TIMESTAMP, "HTML_BITSTRING": HTML_BITSTRING, "HTML_CERTIFICATE": HTML_CERTIFICATE
};

const mapId = {
    "HTML_PUB_KEY": 'pub-key', "HTML_PRIV_KEY": 'priv-key', "HTML_SYMM_KEY": 'symm-key', "HTML_NONCE": 'nonce',
    "HTML_TIMESTAMP": 'timestamp', "HTML_BITSTRING": 'bitstring', "HTML_CERTIFICATE": 'cert'
};

export default Class.extend({
    NAME: 'knowledgeFactoryModal',

    init: function () {
        this.knowledgeManager = new KnowledgeManager(true);
        this.recDialog = {}
    },

    // show section to add knowledge
    click: function (knowledgeID) {
        var kM = this.knowledgeManager;
        // the first time creates the modal and its events
        if (!document.getElementById("modal-" + mapId[knowledgeID])) {
            $('body').append(mapModalObject[knowledgeID]);
            const submitButton = document.getElementById("submit-" + mapId[knowledgeID]);

            submitButton.addEventListener("click", e => {
                if (kM.addKnowledge(mapId[knowledgeID])) // true if correct addition
                    recDialog.hide();
            });

            const cancelButton = document.getElementById("cancel-" + mapId[knowledgeID]);
            cancelButton.addEventListener("click", (e) => {
                recDialog.hide();
            });
        }
        let recDialog = null
        if (!this.recDialog[mapId[knowledgeID]])
            this.recDialog[mapId[knowledgeID]] = new bootstrap.Modal(document.getElementById("modal-" + mapId[knowledgeID]), {
                focus: true,
                backdrop: 'static',
                keyboard: false
            });
        recDialog = this.recDialog[mapId[knowledgeID]]
        recDialog.show()
    },

    toggle: function (source) {
        var checkboxes = document.getElementsByClassName('actor_checkbox');
        for (let i = 0, n = checkboxes.length; i < n; i++) {
            checkboxes[i].checked = source.checked;
        }
    }
})