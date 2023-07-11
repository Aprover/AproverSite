//const ajvInstance = require('./ajvInstance');

export const schemaK = {
    "$schema": "https://json-schema.org/draft/2019-09/schema",
    "title": "Principal Knowledges",
    "description": "Principal knowledge representation used in symbolic verification of security protocols",
    "definitions": {
        "record": {
            "type": "object",
            "properties": {
                "knownBy": {
                    "type": "array",
                    "items": {
                        "anyOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "null"
                            }
                        ]
                    }
                },
                "value": {
                    "anyOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "derivedPublicKey": {
                    '$ref': '#/definitions/record'
                }
            },
            "required": [
                "knownBy",
                "value"
            ]
        }
    },
    "type": "object",
    "properties": {
        "nonce": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/record"
            }
        },
        "idCertificate": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/record"
            }
        },
        "timestamp": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/record"
            }
        },
        "bitstring": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/record"
            }
        },
        "symmetricKey": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/record"
            }
        },
        "asymmetricPrivateKey": {
            "type": "array",
            "items": {
                "allOf": [
                    {
                        "$ref": "#/definitions/record"
                    }
                ]
                ,
                "required": [
                    "derivedPublicKey"
                ]
            }
        }
    },
    "required": [
        "nonce",
        "idCertificate",
        "timestamp",
        "bitstring",
        "symmetricKey",
        "asymmetricPrivateKey"
    ]
};