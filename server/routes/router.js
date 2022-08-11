const router = require("express").Router();
const { homeRoute, dashboard } = require("../services/render");
const {
  findItem,
  sendReceipt,
  readReceipt,
} = require("../controllers/controller");

router.get("/", homeRoute);
router.post("/dashboard", dashboard);
router.get("/dashboard/item/:name", findItem);
router.post("/receipt", sendReceipt);
router.get("/receipt", readReceipt);

module.exports = router;
