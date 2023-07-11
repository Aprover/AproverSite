export default {
    "message": [
        {
            "messageId": 0,
            "sender": "Alice",
            "receiver": "Server",
            "messageName": "Message Name",
            "messageFields": [
                {
                    "message": [
                        {
                            "idCertificate": "A"
                        },
                        {
                            "idCertificate": "B"
                        },
                        {
                            "nonce": "Na"
                        }
                    ]
                }
            ]
        },
        {
            "messageId": 1,
            "sender": "Server",
            "receiver": "Alice",
            "messageName": "Message Name",
            "messageFields": [
                {
                    "id": "1c01e280-c7ef-4cef-abc8-fa23cdb6d34c",
                    "knowledgeGroup": [
                        {
                            "nonce": "Na"
                        },
                        {
                            "symmetricKey": "Kab"
                        }
                    ]
                },
                {
                    "id": "ece32969-71dd-0603-9ed4-17ec60f5dbe6",
                    "knowledgeGroup": [
                        {
                            "symmetricKey": "Kab"
                        },
                        {
                            "idCertificate": "A"
                        }
                    ]
                },
                {
                    "id": "e7b1f4d0-088a-9113-9a5e-11461f08a76b",
                    "securityConcept": "symmetricEncryption",
                    "algorithm": "AES",
                    "encryptionKey": {
                        "symmetricKey": "Kbs"
                    },
                    "argument": {
                        "referenceId": "ece32969-71dd-0603-9ed4-17ec60f5dbe6"
                    }
                },
                {
                    "id": "82b013d2-9ead-f883-9e09-b789e66b4fe0",
                    "knowledgeGroup": [
                        {
                            "idCertificate": "B"
                        },
                        {
                            "referenceId": "e7b1f4d0-088a-9113-9a5e-11461f08a76b"
                        }
                    ]
                },
                {
                    "id": "22566a9e-3db4-6ea5-b9b5-a5a81d523160",
                    "knowledgeGroup": [
                        {
                            "referenceId": "1c01e280-c7ef-4cef-abc8-fa23cdb6d34c"
                        },
                        {
                            "referenceId": "82b013d2-9ead-f883-9e09-b789e66b4fe0"
                        }
                    ]
                },
                {
                    "id": "5b896b00-e8ab-4aa0-a1f2-6a6b33ac307a",
                    "securityConcept": "symmetricEncryption",
                    "algorithm": "AES",
                    "encryptionKey": {
                        "symmetricKey": "Kas"
                    },
                    "argument": {
                        "referenceId": "22566a9e-3db4-6ea5-b9b5-a5a81d523160"
                    }
                },
                {
                    "message": [
                        {
                            "referenceId": "5b896b00-e8ab-4aa0-a1f2-6a6b33ac307a"
                        }
                    ]
                }
            ]
        },
        {
            "messageId": 2,
            "sender": "Alice",
            "receiver": "Bob",
            "messageName": "Message Name",
            "messageFields": [
                {
                    "id": "03ba0fe2-188e-427b-cdaf-cc323d95d5c7",
                    "knowledgeGroup": [
                        {
                            "symmetricKey": "Kab"
                        },
                        {
                            "idCertificate": "A"
                        }
                    ]
                },
                {
                    "id": "1431fa38-23ce-e5ab-de47-b4d1bcf62d7a",
                    "securityConcept": "symmetricEncryption",
                    "algorithm": "AES",
                    "encryptionKey": {
                        "symmetricKey": "Kbs"
                    },
                    "argument": {
                        "referenceId": "03ba0fe2-188e-427b-cdaf-cc323d95d5c7"
                    }
                },
                {
                    "message": [
                        {
                            "referenceId": "1431fa38-23ce-e5ab-de47-b4d1bcf62d7a"
                        }
                    ]
                }
            ]
        },
        {
            "messageId": 3,
            "sender": "Bob",
            "receiver": "Alice",
            "messageName": "Message Name",
            "messageFields": [
                {
                    "id": "1fcd3c6d-be4a-bef5-474c-c2d242a5a24b",
                    "securityConcept": "symmetricEncryption",
                    "algorithm": "AES",
                    "encryptionKey": {
                        "symmetricKey": "Kab"
                    },
                    "argument": {
                        "nonce": "Nb"
                    }
                },
                {
                    "message": [
                        {
                            "referenceId": "1fcd3c6d-be4a-bef5-474c-c2d242a5a24b"
                        }
                    ]
                }
            ]
        },
        {
            "messageId": 4,
            "sender": "Alice",
            "receiver": "Bob",
            "messageName": "Message Name",
            "messageFields": [
                {
                    "id": "bb23437c-6813-f290-bc8b-448a9b2abff5",
                    "securityConcept": "symmetricEncryption",
                    "algorithm": "AES",
                    "encryptionKey": {
                        "symmetricKey": "Kab"
                    },
                    "argument": {
                        "nonce": "Nb-1"
                    }
                },
                {
                    "message": [
                        {
                            "referenceId": "bb23437c-6813-f290-bc8b-448a9b2abff5"
                        }
                    ]
                }
            ]
        }
    ],
    "parsedMessages": [
        "A, B, N<sub>a</sub>",
        "{Na, Kab, B, {Kab, A}<sub>Kbs</sub>}<sub>Kas</sub>",
        "{Kab, A}<sub>Kbs</sub>",
        "{Nb}<sub>Kab</sub>",
        "{Nb-1}<sub>Kab</sub>"
    ],
    "knowledge": {
        "nonce": [
            {
                "knownBy": [
                    "Alice",
                    "Server",
                    "Attacker"
                ],
                "value": "Na"
            },
            {
                "knownBy": [
                    "Bob",
                    "Alice"
                ],
                "value": "Nb"
            },
            {
                "knownBy": [
                    "Alice",
                    "Bob"
                ],
                "value": "Nb-1"
            }
        ],
        "idCertificate": [
            {
                "knownBy": [
                    "Alice",
                    "Bob",
                    "Server",
                    "Attacker"
                ],
                "value": "A"
            },
            {
                "knownBy": [
                    "Alice",
                    "Bob",
                    "Server",
                    "Attacker"
                ],
                "value": "B"
            }
        ],
        "timestamp": [],
        "bitstring": [],
        "symmetricKey": [
            {
                "knownBy": [
                    "Alice",
                    "Server"
                ],
                "value": "Kas"
            },
            {
                "knownBy": [
                    "Bob",
                    "Server"
                ],
                "value": "Kbs"
            },
            {
                "knownBy": [
                    "Server",
                    "Alice",
                    "Bob"
                ],
                "value": "Kab"
            }
        ],
        "asymmetricPrivateKey": []
    }
}