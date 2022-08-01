export default {
  type: "object",
  properties: {
    id: {
      type: "integer",
      minimum: 1
    },
    name: {
      type: "string",
      maxLength: 128
    },
    address: {
      type: ["string", "null"],
      maxLength: 128
    },
    currency: {
      type: ["string", "null"],
      maxLength: 10
    },
    users: {
      type: "array",
      items: { type: "string" }
    },
    company: {
      type: "integer"
    }
  },
  required: ["id", "name", "email", "users", "company"]
};
