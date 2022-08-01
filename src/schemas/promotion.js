export default {
  type: "object",
  properties: {
    id: {
      type: "integer",
      minimum: 1
    },
    name: {
      type: "string",
      maxLength: 200
    },
    start_date: {
      type: "string"
    },
    end_date: {
      type: "string"
    },
    products: {
      type: "array"
    },
    coefficient: {
      type: "integer",
      minimum: -1
    },
    description: {
      type: "string"
    }
  },
  required: [
    "id",
    "name",
    "products",
    "start_date",
    "end_date",
    "coefficient",
    "string"
  ]
};
