module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  API_TOKEN: process.env.API_TOKEN || "d3460822-1e38-11eb-adc1-0242ac120002",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://caris_list_admin@localhost/caris_list",
};
