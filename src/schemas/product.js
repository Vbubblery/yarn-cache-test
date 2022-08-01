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
    site: {
      type: "integer",
      minimum: 1
    },
    type: {
      type: "string",
      maxLength: 20
    },
    productSupplierLinks: {
      type: "array"
    },
    promotions: {
      type: "array"
    },
    tags: {
      type: "array"
    }
  },
  required: [
    "id",
    "name",
    "site",
    "productSupplierLinks",
    "type",
    "promotions",
    "tags"
  ]
};
