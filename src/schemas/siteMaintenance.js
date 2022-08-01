export default {
  type: "object",
  properties: {
    id: {
      type: "integer",
      minimum: 1
    },
    description: {
      type: "string"
    },
    start_date: {
      type: "string"
    },
    end_date: {
      type: "string"
    },
    site: {
      type: "integer",
      minimum: 1
    }
  },
  required: ["id", "description", "start_date", "end_date", "site"]
};
