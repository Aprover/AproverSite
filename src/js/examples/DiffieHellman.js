export default {
    "message": [
        {
            "messageId": 0,
            "sender": "Alice",
            "receiver": "Bob",
            "messageName": "Message Name",
            "messageFields": [
                {
                    "message": [
                        {
                            "bitstring": "g"
                        },
                        {
                            "bitstring": "p"
                        },
                        {
                            "bitstring": "A"
                        }
                    ]
                }
            ]
        },
        {
            "messageId": 1,
            "sender": "Bob",
            "receiver": "Alice",
            "messageName": "Message Name",
            "messageFields": [
                {
                    "message": [
                        {
                            "bitstring": "B"
                        }
                    ]
                }
            ]
        }],
    "parsedMessages": [
        "g, p, A",
        "B"
    ],
    "knowledge": {
        "nonce": [],
        "idCertificate": [],
        "timestamp": [],
        "bitstring": [
            {
                "knownBy": [
                    "Alice",
                    "Bob",
                    "Attacker"
                ],
                "value": "g"
            },
            {
                "knownBy": [
                    "Alice",
                    "Bob",
                    "Attacker"
                ],
                "value": "p"
            },
            {
                "knownBy": [
                    "Alice"
                ],
                "value": "a"
            },
            {
                "knownBy": [
                    "Alice",
                    "Bob",
                    "Attacker"
                ],
                "value": "A"
            },
            {
                "knownBy": [
                    "Bob"
                ],
                "value": "b"
            },
            {
                "knownBy": [
                    "Bob",
                    "Alice",
                    "Attacker"
                ],
                "value": "B"
            }
        ],
        "symmetricKey": [
            {
                "knownBy": [
                    "Alice",
                    "Bob"
                ],
                "value": "K"
            }
        ],
        "asymmetricPrivateKey": []
    }
}