const listService = {
  getAllProducts(knex) {
    return knex.select("*").from("products");
  },
  getProductById(knex, id) {
    return knex.from("products").select("*").where("id", id).first();
  },
  insertProduct(knex, newProduct) {
    return knex
      .insert(newProduct)
      .into("products")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  deleteProduct(knex, id) {
    return knex("products").where({ id }).delete();
  },
  updateProduct(knex, id, updatedProduct) {
    return knex("products").where({ id }).update(updatedProduct);
  },
};
module.exports = tuckService;
