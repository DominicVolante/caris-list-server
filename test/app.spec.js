const knex = require("knex");
const app = require("../src/app");
const supertest = require("supertest");
const { expect } = require("chai");

let products = [
  {
    name: "scdfv",
    rating: 3,
    synopsis: "kjnfvksjndfknv",
    description: "sdfv",
    disposal: "sdhfbnvklsdnf",
    link: "kjsndfkjvnsdkjn",
    image: "skdjfnvlkjsndfjklvn",
    category: "saldjvnsdfjlnv",
  },
  {
    name: "asf",
    rating: 2,
    synopsis: "asvdf",
    description: "svsg vdfv",
    disposal: "sdhfvrsefqwbnvklsdnf",
    link: "asdfasv",
    image: "fervcecser",
    category: "gertgxdfgew",
  },
  {
    name: "fsdfveecver",
    rating: 1,
    synopsis: "rfwerg",
    description: "sdgwergerfv",
    disposal: "sdhfbrrgergwsdnvklsdnf",
    link: "fewcsrfe",
    image: "skdjfvsdfvefnvlkjsndfjklvn",
    category: "salfsaerferdjvnsdfjlnv",
  },
];

describe("App", () => {
  let db;

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });

    app.set("db", db);
  });

  before("cleanup", () => db.raw("TRUNCATE TABLE products RESTART IDENTITY;"));

  afterEach("cleanup", () =>
    db.raw("TRUNCATE TABLE products RESTART IDENTITY;")
  );

  after("disconnect from the database", () => db.destroy());

  describe("routes", () => {
    context("no products in the database", () => {
      it("GET /products responds with 200 containing an empty array", () => {
        return supertest(app).get("/products").expect(200, []);
      });
    });
  });

  context("there are products in the db", () => {
    beforeEach(() => {
      return db.insert(products).into("products");
    });
    it("GET /products responds with 200 containing an array of objects", () => {
      return supertest(app)
        .get("/products")
        .expect(200)
        .expect((res) => {
          res.body.forEach((product) => {
            expect(product).to.be.a("object");
            expect(product).to.include.keys(
              "id",
              "date",
              "name",
              "rating",
              "synopsis",
              "description",
              "disposal",
              "link",
              "image",
              "category"
            );
          });
        });
    });
  });

  context("a product is posted to db", () => {
    it("POST /products responds with 200 and adds data provided if valid", () => {
      const newProduct = {
        name: "sdca",
        rating: 3,
        synopsis: "scasd",
        description: "sdscsdfv",
        disposal: "sdhfcsdcbnvklsdnf",
        link: "kjsnsdcadfkjvnsdkjn",
        image: "skdsdcajfnvlkjsndfjklvn",
        category: "salasdcdjvnsdfjlnv",
      };
      return supertest(app)
        .post("/products")
        .send(newProduct)
        .expect(201)
        .expect((res) => {
          expect(res.body).to.be.a("object");
          expect(res.body).to.include.keys(
            "id",
            "date",
            "name",
            "rating",
            "synopsis",
            "description",
            "disposal",
            "link",
            "image",
            "category"
          );
          expect(res.body.name).to.eql(newProduct.name);
          expect(res.body.rating).to.eql(newProduct.rating);
          expect(res.body.synopsis).to.eql(newProduct.synopsis);
          expect(res.body.description).to.eql(newProduct.description);
          expect(res.body.disposal).to.eql(newProduct.disposal);
          expect(res.body.link).to.eql(newProduct.link);
          expect(res.body.image).to.eql(newProduct.image);
          expect(res.body.category).to.eql(newProduct.category);
          expect(res.headers.location).to.eql(`/products/${res.body.id}`);
        });
    });
    it("POST /products responds with 400 if provided invalid valid", () => {
      const invalidData = {
        invalid: "data",
      };
      return supertest(app).post("/products").send(invalidData).expect(500);
    });
  });

  describe("DELETE", () => {
    beforeEach("insert products", () => {
      return db("products").insert(products);
    });
    it("DELETE /products/:id should delete a specified product", () => {
      it("should delete an item", () => {
        return db("products")
          .first()
          .then((check) => {
            return supertest(app).delete(`/products/${check.id}`).expect(204);
          });
      });
    });

    it('GET / responds with 200 containing "Hello, world!"', () => {
      return supertest(app).get("/").expect(200, "Hello, world!");
    });
  });

  describe("PATCH /products/:id should update a product by id", () => {
    beforeEach("populate products", () => {
      return db("products").insert(products);
    });
    it("should update by id", () => {
      const patchedProd = {
        name: "patched",
        rating: 3,
        synopsis: "patched syn",
        description: "patched desc",
        disposal: "patched disp",
        link: "patched link",
        image: "patched img",
        category: "patched cat",
      };
      let test;
      return db("products")
        .first()
        .then((_test) => {
          test = _test;
          return supertest(app)
            .patch(`/products/${test.id}`)
            .send(patchedProd)
            .expect(204);
        });
    });
  });
});
