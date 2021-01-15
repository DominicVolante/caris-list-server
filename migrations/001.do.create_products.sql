CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS products;

CREATE TABLE products(
    id uuid DEFAULT uuid_generate_v4 (),
    date TIMESTAMPTZ DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    synopsis TEXT NOT NULL,
    description TEXT NOT NULL,
    disposal TEXT NOT NULL,
    link TEXT NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    PRIMARY KEY (id)
);