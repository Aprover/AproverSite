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
                    "id": "abc1e060-9252-b673-f382-5321f1730f49",
                    "knowledgeGroup": [
                        {
                            "asymmetricPublicKey": "Kpb"
                        },
                        {
                            "idCertificate": "B"
                        }
                    ]
                },
                {
                    "id": "59e0270c-5a75-757f-d49c-8a9e1e9973ae",
                    "securityConcept": "signature",
                    "algorithm": "DSA",
                    "signatureKey": {
                        "asymmetricPrivateKey": "Kss"
                    },
                    "argument": {
                        "referenceId": "abc1e060-9252-b673-f382-5321f1730f49"
                    }
                },
                {
                    "message": [
                        {
                            "referenceId": "59e0270c-5a75-757f-d49c-8a9e1e9973ae"
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
                    "id": "dc90dfba-876b-d3a3-793e-84c1b6c05ffb",
                    "knowledgeGroup": [
                        {
                            "nonce": "Na"
                        },
                        {
                            "idCertificate": "A"
                        }
                    ]
                },
                {
                    "id": "1ce1260a-f89c-95a5-1bba-6299aff3d57e",
                    "securityConcept": "asymmetricEncryption",
                    "algorithm": "RSA",
                    "encryptionKey": {
                        "asymmetricPublicKey": "Kpb"
                    },
                    "argument": {
                        "referenceId": "dc90dfba-876b-d3a3-793e-84c1b6c05ffb"
                    }
                },
                {
                    "message": [
                        {
                            "referenceId": "1ce1260a-f89c-95a5-1bba-6299aff3d57e"
                        }
                    ]
                }
            ]
        },
        {
            "messageId": 3,
            "sender": "Bob",
            "receiver": "Server",
            "messageName": "Message Name",
            "messageFields": [
                {
                    "message": [
                        {
                            "idCertificate": "B"
                        },
                        {
                            "idCertificate": "A"
                        }
                    ]
                }
            ]
        },
        {
            "messageId": 4,
            "sender": "Server",
            "receiver": "Bob",
            "messageName": "Message Name",
            "messageFields": [
                {
                    "id": "a9e8a8ff-b3cb-59e6-dff5-5a00aa34f174",
                    "knowledgeGroup": [
                        {
                            "asymmetricPublicKey": "Kpa"
                        },
                        {
                            "idCertificate": "A"
                        }
                    ]
                },
                {
                    "id": "b266dde3-c222-1952-ff31-6ffc9fca89a1",
                    "securityConcept": "signature",
                    "algorithm": "DSA",
                    "signatureKey": {
                        "asymmetricPrivateKey": "Kss"
                    },
                    "argument": {
                        "referenceId": "a9e8a8ff-b3cb-59e6-dff5-5a00aa34f174"
                    }
                },
                {
                    "message": [
                        {
                            "referenceId": "b266dde3-c222-1952-ff31-6ffc9fca89a1"
                        }
                    ]
                }
            ]
        },
        {
            "messageId": 5,
            "sender": "Bob",
            "receiver": "Alice",
            "messageName": "Message Name",
            "messageFields": [
                {
                    "id": "3fb36364-80bb-e763-d151-60b779bd8967",
                    "knowledgeGroup": [
                        {
                            "nonce": "Na"
                        },
                        {
                            "nonce": "Nb"
                        }
                    ]
                },
                {
                    "id": "cb3ef56c-c14d-fd74-619a-7dc967174c77",
                    "knowledgeGroup": [
                        {
                            "referenceId": "3fb36364-80bb-e763-d151-60b779bd8967"
                        },
                        {
                            "idCertificate": "B"
                        }
                    ]
                },
                {
                    "id": "1d16ce3d-4423-d781-1926-c1dcad9dca6e",
                    "securityConcept": "asymmetricEncryption",
                    "algorithm": "RSA",
                    "encryptionKey": {
                        "asymmetricPublicKey": "Kpa"
                    },
                    "argument": {
                        "referenceId": "cb3ef56c-c14d-fd74-619a-7dc967174c77"
                    }
                },
                {
                    "message": [
                        {
                            "referenceId": "1d16ce3d-4423-d781-1926-c1dcad9dca6e"
                        }
                    ]
                }
            ]
        },
        {
            "messageId": 6,
            "sender": "Alice",
            "receiver": "Bob",
            "messageName": "Message Name",
            "messageFields": [
                {
                    "id": "b3d50362-6ae0-c0cc-79a4-d87a8518df52",
                    "securityConcept": "asymmetricEncryption",
                    "algorithm": "RSA",
                    "encryptionKey": {
                        "asymmetricPublicKey": "Kpb"
                    },
                    "argument": {
                        "nonce": "Nb"
                    }
                },
                {
                    "message": [
                        {
                            "referenceId": "b3d50362-6ae0-c0cc-79a4-d87a8518df52"
                        }
                    ]
                }
            ]
        }
    ],
    "parsedMessages": [
        "A, B",
        "{Kpb, B}<sub>Kss</sub>",
        "{Na, A}<sub>Kpb</sub>",
        "B, A",
        "{Kpa, A}<sub>Kss</sub>",
        "{Na, Nb, B}<sub>Kpa</sub>",
        "{Nb}<sub>Kpb</sub>"
    ],
    "knowledge": {
        "nonce": [
            {
                "knownBy": [
                    "Alice",
                    "Bob"
                ],
                "value": "Na"
            },
            {
                "knownBy": [
                    "Bob",
                    "Alice"
                ],
                "value": "Nb"
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
        "symmetricKey": [],
        "asymmetricPrivateKey": [
            {
                "knownBy": [
                    "Server"
                ],
                "value": "Kss",
                "derivedPublicKey": {
                    "knownBy": [
                        "Alice",
                        "Bob",
                        "Server",
                        "Attacker"
                    ],
                    "value": "Kps"
                }
            },
            {
                "knownBy": [
                    "Alice"
                ],
                "value": "Ksa",
                "derivedPublicKey": {
                    "knownBy": [
                        "Alice",
                        "Server",
                        "Bob"
                    ],
                    "value": "Kpa"
                }
            },
            {
                "knownBy": [
                    "Bob"
                ],
                "value": "Ksb",
                "derivedPublicKey": {
                    "knownBy": [
                        "Bob",
                        "Server",
                        "Alice"
                    ],
                    "value": "Kpb"
                }
            }
        ]
    }
}