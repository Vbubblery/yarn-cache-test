export default {
  type: "object",
  properties: {
    id: {
      type: "integer",
      minimum: 1
    },
    status_id: {
      type: "integer",
      minimum: 1,
      maximum: 4
    },
    supplier_id: {
      type: "integer",
      minimum: 1
    },
    date: {
      type: "string"
    },
    supplies: {
      type: "object"
    }
  },
  required: ["id", "status_id", "supplier_id", "date", "supplies"]
};

export const orderSupplySchema = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      minimum: 1
    },
    product_site: {
      type: "integer",
      minimum: 1
    },
    quantity: {
      type: "integer"
    },
    order: {
      type: "integer",
      minimum: 1
    },
    name: {
      type: "string"
    }
  },
  required: ["id", "product_site", "quantity", "name"]
};
