export default {
  type: "object",
  properties: {
    id: {
      type: "string"
    },
    email: {
      type: "string",
      maxLength: 128,
      format: "email"
    },
    name: {
      type: ["string", "null"],
      maxLength: 128
    },
    tel_office: {
      type: ["string", "null"],
      maxLength: 25
    },
    title: {
      type: ["string", "null"],
      maxLength: 128
    },
    company: {
      type: "integer"
    },
    sites: {
      type: "array",
      items: { type: "integer" }
    },
    is_admin: {
      type: "boolean"
    },
    is_superadmin: {
      type: "boolean"
    },
    password: {
      type: ["string", "null"]
    },
    active: {
      type: "boolean"
    },
    locale: {
      type: "string"
    }
  },
  required: ["id", "email", "active", "company", "sites", "locale"]
};
