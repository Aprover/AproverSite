import Ajv from "ajv"
const ajvInstance = new Ajv({allErrors: true});

module.exports= ajvInstance;