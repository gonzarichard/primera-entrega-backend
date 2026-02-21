import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    if (!fs.existsSync(this.path)) return [];
    const data = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(data || "[]");
  }

  async getProductById(pid) {
    const products = await this.getProducts();
    return products.find((p) => p.id == pid);
  }

  async addProduct(product) {
    const products = await this.getProducts();

    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const newProduct = {
      id: newId,
      ...product,
    };

    products.push(newProduct);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

    return newProduct;
  }

  async updateProduct(pid, updatedFields) {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id == pid);

    if (index === -1) return null;

    delete updatedFields.id;

    products[index] = { ...products[index], ...updatedFields };

    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

    return products[index];
  }

  async deleteProduct(pid) {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id != pid);

    if (products.length === filtered.length) return false;

    await fs.promises.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return true;
  }
}
