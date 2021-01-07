const express = require("express");
const xss = require("xss");
const listService = require("./list-service");

const listRouter = express.Router();
const bodyParser = express.json();

const serializeProduct = (product) => ({
  id: product.id,
  date: product.date,
  name: xss(product.name),
  rating: product.rating,
  description: xss(product.description),
});

listRouter
  .route("/products")
  .get((req, res, next) => {
    listService
      .getAllProducts(req.app.get("db"))
      .then((products) => {
        res.json(products.map(serializeProduct));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    for (const field of ["name", "rating", "description"]) {
      if (!req.body[field]) {
        console.error(`${field} is required`);
        res.status(400);
      }
    }

    const { rating, name, description } = req.body;
    const newProduct = { rating, name, description };

    listService
      .insertProduct(req.app.get("db"), newProduct)
      .then((product) => {
        console.log(`new product with id ${product.id} was created`);
        res
          .status(201)
          .location(`/products/${product.id}`)
          .json(serializeProduct(product));
      })
      .catch(next);
  });

listRouter
  .route("/products/:id")
  .all((req, res, next) => {
    const { id } = req.params;
    listService
      .getProductById(req.app.get("db"), id)
      .then((product) => {
        if (!product) {
          console.error(`No product matching the id, ${id} was found.`);
          return res.status(404).json({
            error: { message: "Product not found" },
          });
        }
        res.product = product;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeProduct(res.product));
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    listService
      .deleteProduct(req.app.get("db"), id)
      .then((shifted) => {
        console.log(`Product with id of ${id} was deleted`);
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { rating, name, description } = req.body;
    const updateProduct = { rating, name, description };

    listService
      .updateProduct(req.app.get("db"), req.params.id, updateProduct)
      .then((rowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = listRouter;
