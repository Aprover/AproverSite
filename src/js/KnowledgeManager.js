export default Class.extend({

    NAME: 'knowledgeManager',
    init: function (firstTime = false) {
        if (sessionStorage.knowledge && firstTime) {
            sessionStorage.currentKnowledgeActor = "Alice";
            this.switchKnowledge();

            document.querySelector(".sender-btn").addEventListener("click", () => {
                if (sessionStorage.currentKnowledgeActor != "Alice") {
                    sessionStorage.currentKnowledgeActor = "Alice";
                    this.switchKnowledge();
                }
            });
            document.querySelector(".receiver-btn").addEventListener("click", () => {
                if (sessionStorage.currentKnowledgeActor != "Bob") {
                    sessionStorage.currentKnowledgeActor = "Bob";
                    this.switchKnowledge();
                }
            });
            document.querySelector(".attacker-btn").addEventListener("click", () => {
                if (sessionStorage.currentKnowledgeActor != "Attacker") {
                    sessionStorage.currentKnowledgeActor = "Attacker";
                    this.switchKnowledge();
                }
            });
            document.querySelector(".server-btn").addEventListener("click", () => {
                if (sessionStorage.currentKnowledgeActor != "Server") {
                    sessionStorage.currentKnowledgeActor = "Server";
                    this.switchKnowledge();
                }
            });
        }
    },

    // add knowledge to JSON
    // returns true if knowledge is added
    addKnowledge: function (type) {
        let jsonType = null;
        switch (type) {
            case "cert":
                jsonType = "idCertificate";
                break;
            case "symm-key":
                jsonType = "symmetricKey";
                break;
            case "priv-key":
                jsonType = "asymmetricPrivateKey";
                break;
            case "pub-key":
                jsonType = "derivedPublicKey";
                break;
            default:
                jsonType = type;
                break;
        }

        // known by
        let share = {
            "Alice": document.getElementById("flexCheckAlice_" + type).checked,
            "Bob": document.getElementById("flexCheckBob_" + type).checked,
            "Server": document.getElementById("flexCheckServer_" + type).checked,
            "Attacker": document.getElementById("flexCheckAttacker_" + type).checked
        };
        {
            // check if any actor has been selected
            let check = false;
            for (const [key, value] of Object.entries(share)) {
                if (value) {
                    check = true;
                    break;
                }
            }
            if (!check) {
                alert("No actor checked");
                return false;
            }
        }

        let result = {
            "knownBy": [],
            "value": ""
        };

        // pub-key can only be derived by priv-key
        if (type != "pub-key") {
            result.value = document.getElementById("userInput_" + type).value;
            let knowledge = JSON.parse(sessionStorage.knowledge);

            // check if value already exists
            if (knowledge[jsonType].find(e => e.value == result.value)) {
                alert(jsonType + " value already used");
                return false;
            }

            if (type == "priv-key") {
                // has also a derived public key
                let pubSection = {
                    "knownBy": [],
                    "value": ""
                }

                pubSection.value = document.getElementById("userInputDerived_" + type).value;
                // check if value already exists
                if (knowledge[jsonType].find(e => e.derivedPublicKey.value == pubSection.value)) {
                    alert("Asymmetric public key value already used");
                    return false;
                }

                // known by
                let leak = {
                    "Alice": document.getElementById("flexCheckLeakAlice_" + type).checked,
                    "Bob": document.getElementById("flexCheckLeakBob_" + type).checked,
                    "Server": document.getElementById("flexCheckLeakServer_" + type).checked,
                    "Attacker": document.getElementById("flexCheckLeakAttacker_" + type).checked
                };
                {
                    // check if any actor has been checked
                    let check = false;
                    for (const [key, value] of Object.entries(leak)) {
                        if (value) {
                            check = true;
                            break;
                        }
                    }
                    if (!check) {
                        alert("No actor checked");
                        return false;
                    }
                }

                // priv key known by
                for (const [key, value] of Object.entries(leak)) {
                    if (value)
                        result.knownBy.push(key);
                }
                // pub key known by
                for (const [key, value] of Object.entries(share)) {
                    if (value)
                        pubSection.knownBy.push(key);
                }

                result.derivedPublicKey = pubSection;
            }
            else {
                for (const [key, value] of Object.entries(share)) {
                    if (value)
                        result.knownBy.push(key);
                }
            }

            let history = JSON.parse(sessionStorage.history);
            history.push({
                "key": "knowledge",
                "knowledge": knowledge
            });
            sessionStorage.history = JSON.stringify(history);

            knowledge[jsonType].push(result);
            sessionStorage.knowledge = JSON.stringify(knowledge);

            // if the current actor knows the new knowledge, display it
            if (result.knownBy.includes(sessionStorage.currentKnowledgeActor)) {
                this.addKnowledgeElement(type, result);
                if (type == "priv-key")
                    this.addKnowledgeElement("pub-key", result);
            }
            return true;
        }
    },

    // add knowledge to html
    addKnowledgeElement: function (type, info) {
        var add = document.getElementsByClassName("add " + type)[0].parentNode;
        var ul = add.parentNode;
        var li = document.createElement("li");
        li.className = "addedKnowledge row";

        // helper for asym key pair delete: if one is deleted, so is the other
        if (type == "pub-key" || type == "priv-key")
            li.id = info.value;

        // "a" contains the knowledge element
        var a = document.createElement('a');
        a.appendChild(document.createTextNode(type == "pub-key" ? info.derivedPublicKey.value : info.value));
        a.className = "col";

        // button for delete
        var button = document.createElement('a');
        a.href = "#";
        button.innerHTML = "<i class='iconify ico-overlay' data-icon='mdi:bin-empty' style='color: #236236236;'></i>";
        var deleteKnowledge = this.deleteKnowledge
        button.addEventListener('click', function () {
            if (deleteKnowledge(type, info)) {
                this.parentNode.remove();
                if (type == "pub-key" || type == "priv-key")
                    document.getElementById(info.value).remove();
            }
            else
                alert("Knowledge element already used\nIt is not possible to delete it");
        });
        button.className = "col";

        li.appendChild(a);
        li.appendChild(button);

        // knowledge edit
        /*a.ondblclick = function () {
            var val = this.innerHTML;
            var input = document.createElement("input");

            input.value = val;
            input.onblur = function () {
                var val = this.value;
                this.parentNode.innerHTML = val;
            };
            input.addEventListener('keydown', function (e) {
                // enter pressed
                if (e.keyCode === 13) {
                    this.blur();
                }
            });
            this.innerHTML = "";
            this.appendChild(input);
            input.focus();
        }*/
        ul.insertBefore(li, add);
    },

    // changes the knowledge shown based on the chosen actor
    switchKnowledge: function () {
        // remove all shown knowledge; use while istead of a for because it is bugged(does not delete all elements)
        while (document.getElementsByClassName("addedKnowledge row").length > 0)
            document.getElementsByClassName("addedKnowledge row")[0].remove();

        let actor = sessionStorage.currentKnowledgeActor;
        let knowledge = JSON.parse(sessionStorage.knowledge);

        for (const [key, value] of Object.entries(knowledge)) {
            let type = null;
            switch (key) {
                case "idCertificate":
                    type = "cert";
                    break;
                case "symmetricKey":
                    type = "symm-key";
                    break;
                case "asymmetricPrivateKey":
                    type = "priv-key";
                    break;
                default:
                    type = key;
                    break;
            }

            knowledge[key].forEach(element => {
                // show element if the actor knows it
                if (element.knownBy.includes(actor))
                    this.addKnowledgeElement(type, element);

                // public key is inside private key
                if (type == "priv-key")
                    if (element.derivedPublicKey.knownBy.includes(actor))
                        this.addKnowledgeElement("pub-key", element);
            });
        }
    },

    // remove knowledge from JSON
    deleteKnowledge: function (type, info) {
        switch (type) {
            case "cert":
                type = "idCertificate";
                break;
            case "symm-key":
                type = "symmetricKey";
                break;
            case "priv-key":
                type = "asymmetricPrivateKey";
                break;
        }
        let target = (type == "pub-key") ? info.derivedPublicKey.value : info.value;
        let targetFound = false;
        let messageArray;
        if (sessionStorage.message) {
            messageArray = JSON.parse(sessionStorage.message);

            // check if the knowledge has already been used
            for (let i = 0; !targetFound && i < messageArray.length; i++) {
                for (let j = 0; !targetFound && j < messageArray[i].messageFields.length; j++) {
                    // knowledge
                    if (messageArray[i].messageFields[j][type]) {
                        targetFound = messageArray[i].messageFields[j][type] == target;
                    }
                    // cryptographic functions
                    else if (messageArray[i].messageFields[j].argument && messageArray[i].messageFields[j].argument[type]) {
                        targetFound = messageArray[i].messageFields[j].argument[type] == target;
                    }
                    // group or message
                    else if (messageArray[i].messageFields[j].knowledgeGroup || messageArray[i].messageFields[j].message) {
                        let targetArr = messageArray[i].messageFields[j].knowledgeGroup || messageArray[i].messageFields[j].message;
                        for (let k = 0; !targetFound && k < targetArr.length; k++) {
                            if (targetArr[k][type]) {
                                targetFound = (targetArr[k][type] == target);
                            }
                        }
                    }
                }
            }
        }
        // if the target has been found, it can be deleted
        if (!targetFound) {
            let knowledge = JSON.parse(sessionStorage.knowledge);

            let history = JSON.parse(sessionStorage.history);
            history.push({
                "key": "knowledge",
                "knowledge": knowledge
            });
            sessionStorage.history = JSON.stringify(history);

            if (type == "pub-key") {
                let targetIndex = knowledge.asymmetricPrivateKey.findIndex(e => e.derivedPublicKey.value == target);
                // if pub-key, the relative priv-key will be deleted too and vice versa
                knowledge.asymmetricPrivateKey.splice(targetIndex, 1);
            }
            else {
                let targetIndex = knowledge[type].findIndex(e => e.value == target);
                knowledge[type].splice(targetIndex, 1);
            }
            sessionStorage.knowledge = JSON.stringify(knowledge);
        }

        // false == don't delete
        return !targetFound;
    }
})