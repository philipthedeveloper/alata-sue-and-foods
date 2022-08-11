const ITEMS = require("../constants/items");

const homeRoute = (req, res) => {
  res.render("login");
};

const dashboard = (req, res) => {
  const { cashier_name } = req.body;
  if (cashier_name.length < 4) {
    res.redirect("/");
    return;
  }
  res.render(`dashboard`, { cashier_name, ITEMS });
};

module.exports = { homeRoute, dashboard };
