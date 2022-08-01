import { validate, VALIDATION_ERROR_MSG } from "@/helper/validation";

const aValidObject = {
  id: "id",
  name: "somename",
  size: 333
};

const anInvalidObject = {
  name: "somename",
  size: "333",
  unknownProperty: "I shouldn't exist here"
};

const validSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    size: { type: "number" }
  }
};

describe("Helpers - validation function", () => {
  it("returns expected data when valid", () => {
    expect(validate(aValidObject, validSchema)).toEqual(aValidObject);
  });
  it("throws an error when data is invalid", () => {
    expect(() => validate(anInvalidObject, validSchema)).toThrow(
      // Check if error message starts indeed with the defined one
      new RegExp("^" + VALIDATION_ERROR_MSG)
    );
  });
});
