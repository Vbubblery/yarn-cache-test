import Ajv, { Schema } from "ajv";

export const validator = new Ajv();

export const VALIDATION_ERROR_MSG =
  "Could not validate the received data. The following errors were found:\n";

export const validate = <T>(raw: object, schema: Schema) => {
  const isValid = validator.compile<T>(schema);
  if (isValid(raw)) return raw;
  else throw new Error(VALIDATION_ERROR_MSG + isValid.errors?.join("\n"));
};
