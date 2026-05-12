/**
 * Swagger UI Kurulumu
 *
 * 1. Paketleri yükle:
 *    npm install swagger-ui-express yamljs
 *
 * 2. Bu dosyayı server.js'e import et:
 *    require("./config/swagger")(app);
 *
 * 3. Tarayıcıda aç:
 *    http://localhost:5000/api-docs
 */

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

module.exports = (app) => {
  const swaggerDocument = YAML.load(
    path.join(__dirname, "..", "..", "docs", "openapi.yaml")
  );

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Night Code Kitchen API Docs",
    })
  );

  console.log("📄 Swagger UI: http://localhost:5000/api-docs");
};
