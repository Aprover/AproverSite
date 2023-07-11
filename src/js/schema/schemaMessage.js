const ajvInstance = require('./ajvInstance');

const schemaM = {
  "$schema": "https://json-schema.org/draft/2019-09/schema",
  "title": "Protocol Message",
  "description": "A message structure of security protocol for symbolic verification",
  "definitions": {
    "knowledge": {
      "type": "object",
      "properties": {
        "nonce": {
          "type": "string"
        },
        "idCertificate": {
          "type": "string"
        },
        "timestamp": {
          "type": "string"
        },
        "bitstring": {
          "type": "string"
        },
        "symmetricKey": {
          "type": "string"
        },
        "asymmetricPublicKey": {
          "type": "string"
        },
        "asymmetricPrivateKey": {
          "type": "string"
        },
        "referenceId": {
          "type": "string"
        }
      },
      "oneOf": [
        {
          "required": [
            "nonce"
          ]
        },
        {
          "required": [
            "timestamp"
          ]
        },
        {
          "required": [
            "idCertificate"
          ]
        },
        {
          "required": [
            "bitstring"
          ]
        },
        {
          "required": [
            "symmetricKey"
          ]
        },
        {
          "required": [
            "asymmetricPublicKey"
          ]
        },
        {
          "required": [
            "asymmetricPrivateKey"
          ]
        },
        {
          "required": [
            "referenceId"
          ]
        }
      ]
    },
    "knowledgeGroup": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "knowledgeGroup": {
          "type": "array",
          "items": {
            "oneOf": [
              {
                "$ref": "#/definitions/knowledge"
              }
            ]
          }
        }
      },
      "required": [
        "id",
        "knowledgeGroup"
      ]
    },
    "message": {
      "type": "object",
      "properties": {
        "message": {
          "type": "array",
          "items": {
            "allOf": [
              {
                "$ref": "#/definitions/knowledge"
              }
            ]
          },
          "minItems": 1
        }
      },
      "required": [
        "message"
      ]
    },
    "asymmetricEncryption": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "securityConcept": {
          "const": "asymmetricEncryption"
        },
        "algorithm": {
          "type": "string"
        },
        "argument": {
          "allOf": [
            {
              "$ref": "#/definitions/knowledge"
            }
          ]
        },
        "encryptionKey": {
          "allOf": [
            {
              "$ref": "#/definitions/knowledge"
            }
          ],
          "required": [
            "asymmetricPublicKey"
          ]
        }
      },
      "required": [
        "id",
        "securityConcept",
        "algorithm",
        "argument",
        "encryptionKey"
      ]
    },
    "symmetricEncryption": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "securityConcept": {
          "const": "symmetricEncryption"
        },
        "algorithm": {
          "type": "string"
        },
        "argument": {
          "allOf": [
            {
              "$ref": "#/definitions/knowledge"
            }
          ]
        },
        "encryptionKey": {
          "allOf": [
            {
              "$ref": "#/definitions/knowledge"
            }
          ],
          "required": [
            "symmetricKey"
          ]
        }
      },
      "required": [
        "id",
        "securityConcept",
        "algorithm",
        "argument",
        "encryptionKey"
      ]
    },
    "signature": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "securityConcept": {
          "const": "signature"
        },
        "algorithm": {
          "type": "string"
        },
        "argument": {
          "allOf": [
            {
              "$ref": "#/definitions/knowledge"
            }
          ]
        },
        "signatureKey": {
          "allOf": [
            {
              "$ref": "#/definitions/knowledge"
            }
          ],
          "required": [
            "asymmetricPrivateKey"
          ]
        }
      },
      "required": [
        "id",
        "securityConcept",
        "algorithm",
        "argument",
        "signatureKey"
      ]
    },
    "hash": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "securityConcept": {
          "const": "hash"
        },
        "algorithm": {
          "type": "string"
        },
        "argument": {
          "allOf": [
            {
              "$ref": "#/definitions/knowledge"
            }
          ]
        }
      },
      "required": [
        "id",
        "securityConcept",
        "algorithm",
        "argument"
      ]
    },
    "messageAuthenticationCode": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "securityConcept": {
          "const": "mac"
        },
        "algorithm": {
          "type": "string"
        },
        "argument": {
          "allOf": [
            {
              "$ref": "#/definitions/knowledge"
            }
          ]
        },
        "authenticationKey": {
          "allOf": [
            {
              "$ref": "#/definitions/knowledge"
            }
          ],
          "required": [
            "symmetricKey"
          ]
        }
      },
      "required": [
        "id",
        "securityConcept",
        "algorithm",
        "argument",
        "authenticationKey"
      ]
    },
    "asymmetricDecryption": {
      "type": "object",
      "properties": {
        "securityConcept": {
          "const": "asymmetricDecryption"
        },
        "algorithm": {
          "type": "string"
        },
        "argument": {
          "allOf": [
            {
              "$ref": "#/definitions/asymmetricEncryption"
            }
          ]
        },
        "decryptionKey": {
          "allOf": [
            {
              "$ref": "#/definitions/knowledge"
            }
          ],
          "required": [
            "asymmetricPrivateKey"
          ]
        }
      },
      "required": [
        "securityConcept",
        "algorithm",
        "argument",
        "decryptionKey"
      ]
    },
    "symmetricDecryption": {
      "type": "object",
      "properties": {
        "securityConcept": {
          "const": "symmetricDecryption"
        },
        "algorithm": {
          "type": "string"
        },
        "argument": {
          "allOf": [
            {
              "$ref": "#/definitions/symmetricEncryption"
            }
          ]
        },
        "decryptionKey": {
          "allOf": [
            {
              "$ref": "#/definitions/knowledge"
            }
          ],
          "required": [
            "symmetricKey"
          ]
        }
      },
      "required": [
        "securityConcept",
        "algorithm",
        "argument",
        "decryptionKey"
      ]
    },
    "signatureVerification": {
      "type": "object",
      "properties": {
        "securityConcept": {
          "const": "signatureVerification"
        },
        "algorithm": {
          "type": "string"
        },
        "argument": {
          "allOf": [
            {
              "$ref": "#/definitions/signature"
            }
          ]
        },
        "signatureVerificationKey": {
          "allOf": [
            {
              "$ref": "#/definitions/knowledge"
            }
          ],
          "required": [
            "asymmetricPublicKey"
          ]
        }
      },
      "required": [
        "securityConcept",
        "algorithm",
        "argument",
        "signatureVerificationKey"
      ]
    },
    "hashVerification": {
      "type": "object",
      "properties": {
        "securityConcept": {
          "const": "hashVerification"
        },
        "algorithm": {
          "type": "string"
        },
        "argument": {
          "allOf": [
            {
              "$ref": "#/definitions/hash"
            }
          ]
        }
      },
      "required": [
        "securityConcept",
        "algorithm",
        "argument"
      ]
    },
    "messageAuthenticationCodeVerification": {
      "type": "object",
      "properties": {
        "securityConcept": {
          "const": "macVerification"
        },
        "algorithm": {
          "type": "string"
        },
        "argument": {
          "allOf": [
            {
              "$ref": "#/definitions/messageAuthenticationCode"
            }
          ]
        },
        "authenticationVerificationKey": {
          "allOf": [
            {
              "$ref": "#/definitions/knowledge"
            }
          ],
          "required": [
            "symmetricKey"
          ]
        }
      },
      "required": [
        "securityConcept",
        "algorithm",
        "argument",
        "authenticationVerificationKey"
      ]
    }
  },
  "type": "object",
  "properties": {
    "messageId": {
      "description": "The unique identifier for a message",
      "type": "integer"
    },
    "sender": {
      "description": "The sender of the message",
      "type": "string"
    },
    "receiver": {
      "description": "The receiver of the message",
      "type": "string"
    },
    "messageName": {
      "description": "The name of the message",
      "type": "string"
    },
    "messageFields": {
      "description": "Fields contained in the message",
      "type": "array",
      "items": {
        "oneOf": [
          {
            "$ref": "#/definitions/knowledge"
          },
          {
            "$ref": "#/definitions/knowledgeGroup"
          },
          {
            "$ref": "#/definitions/message"
          },
          {
            "$ref": "#/definitions/asymmetricEncryption"
          },
          {
            "$ref": "#/definitions/symmetricEncryption"
          },
          {
            "$ref": "#/definitions/signature"
          },
          {
            "$ref": "#/definitions/messageAuthenticationCode"
          },
          {
            "$ref": "#/definitions/hash"
          },
          {
            "$ref": "#/definitions/asymmetricDecryption"
          },
          {
            "$ref": "#/definitions/symmetricDecryption"
          },
          {
            "$ref": "#/definitions/signatureVerification"
          },
          {
            "$ref": "#/definitions/messageAuthenticationCodeVerification"
          },
          {
            "$ref": "#/definitions/hashVerification"
          }
        ]
      },
      "minItems": 1,
      "uniqueItems": true,
      "contains": {
        "$ref": "#/definitions/message"
      }
    }
  },
  "required": [
    "messageId",
    "sender",
    "receiver",
    "messageName",
    "messageFields"
  ]
};

module.exports = ajvInstance.compile(schemaM);