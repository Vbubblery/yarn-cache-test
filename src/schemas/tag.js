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
    products: {
      type: "array"
    },
    product_tag_link: {
      type: "array"
    },
    is_tag_grouper: {
      type: Boolean
    }
  },
  required: ["id", "name", "products", "product_tag_link", "is_tag_grouper"]
};
