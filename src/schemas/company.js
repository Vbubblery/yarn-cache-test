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
    users: {
      type: "array",
      items: { type: "string" }
    },
    sites: {
      type: "array",
      items: { type: "integer" }
    },
    allow_sftp_export: {
      type: "boolean"
    }
  },
  required: ["id", "name", "users", "sites", "allow_sftp_export"]
};
