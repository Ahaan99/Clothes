// ...existing imports...

const validateProduct = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("category").isIn([
    't-shirts', 'hoodies', 'tops', 'shirts', 'tank-tops', 
    'jackets', 'sweaters', 'dresses', 'blouses', 'polo'
  ]).withMessage("Invalid category"),
  body("gender").isIn(['men', 'women', 'unisex']).withMessage("Invalid gender"),
  body("colors").custom(colors => {
    try {
      const parsed = JSON.parse(colors);
      return Array.isArray(parsed);
    } catch (e) {
      throw new Error("Colors must be a valid array");
    }
  }),
  body("sizes").custom(sizes => {
    try {
      const parsed = JSON.parse(sizes);
      return Array.isArray(parsed);
    } catch (e) {
      throw new Error("Sizes must be a valid array");
    }
  })
];

// ...rest of existing code...
