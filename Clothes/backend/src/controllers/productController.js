// ...existing imports...

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, gender, colors, sizes } = req.body;
    const images = req.files?.map(file => ({
      url: file.path,
      public_id: file.filename
    }));

    const product = await Product.create({
      name,
      description,
      price,
      category,
      gender,
      colors: JSON.parse(colors),
      sizes: JSON.parse(sizes),
      images
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ...rest of existing controller code...
