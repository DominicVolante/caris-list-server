CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS products;

CREATE TABLE products(
    id uuid DEFAULT uuid_generate_v4 (),
    date TIMESTAMPTZ DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    description TEXT,
    PRIMARY KEY (id)
);