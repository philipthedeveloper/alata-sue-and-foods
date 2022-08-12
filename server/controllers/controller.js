const ITEMS = require("../constants/items");
const fs = require("fs");
const path = require("path");
const pdf = require("html-pdf");

const findItem = (req, res) => {
  const name = req.params.name;
  const item = ITEMS.find((item) => item.name === name);
  if (!item) {
    res.status(404).send({ ok: false, message: "Item price not found" });
  }
  res.send(JSON.stringify(item));
};

const sendReceipt = (req, res) => {
  const { itemsObj, cashier, total, amountReceived, changeIssued } = req.body;
  let receiptTemp = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Receipt</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          -webkit-box-sizing: border-box;
        }
        body {
          padding: 4mm;
          font-family: "Nunito", sans-serif;
        }
        header {
          display: flex;
          display: -webkit-box;
          -webkit-box-pack: justify;
          justify-content: space-between;
          -webkit-box-align: start;
        }
  
        main {
          margin-top: 5mm;
        }

        .logo {
          font-size: 4.23mm;
        }

        .logo span {
          display: block;
        }

        .logo span:first-child {
          color: #EC268F;
        }

        .logo span:last-child {
          color: #00AFEF;
          margin-top: -1mm; 
        }
  
        .items_body {
          display: flex;
          display: -webkit-box;
          -webkit-box-pack: justify;
          justify-content: space-between;
          margin-top: 3mm;
          padding-bottom: 0.84666mm;
        }

        .items_body.header {
          border-bottom: 1px solid gray;
        }

        .items_body h5 , .items_body h6{
          text-align: center;
        }

        .item_body h5 {
          font-size: 3.500mm;
        }

        .item_body h6 {
          font-size: 3.163mm;
        }

        .items_body h5:first-child, .items_body h6:first-child {
          min-width: 40mm;
          text-align: left;
        }
        
        .items_body h5:last-child, .items_body h6:last-child{
          min-width: 16mm;  
          text-align: right;
        }
        .items_body h5:nth-child(2), .items_body h6:nth-child(2){
          min-width: 16mm;
        }
  
        .total {
          display: flex;
          display: -webkit-box;
          -webkit-box-pack: end;
          justify-content: flex-end;
          margin: 0.4233mm auto;
        }
  
        .total_price {
          display: flex;
          display: -webkit-box;
          -webkit-box-align: center;
          align-items: center;
          margin-top: 1mm;
        }
  
        .total_price h5 {
          margin-right: 2.116mm;
          font-size: 3.500mm;
        }

        .total_price span {
          font-size: 3.500mm;
        }

        .info p {
          font-size: 2.963mm;
        }

        .info p:first-child {
          font-size: 2.328mm;
        }
      </style>
    </head>
    <body>
      <header>
        <h2 class="logo">
          <span>ALATA SUE</span>
          <span>& FOODS</span>
        </h2>
        <img src="/img/ALATA SUE FOODS.png", alt="" id="logo"/>
        <div class="info">
          <p>Date Created: ${new Date().toLocaleString()}</p>
          <p>Cashier Name: ${cashier}</p>
        </div>
      </header>
      <main>
      <div class="items_body header">
        <h5>Item Name</h5>
        <h5> Quantity </h5>
        <h5>Price</h5>
      </div>`;
  itemsObj.forEach((item) => {
    const priceChar = item.price
      .substr(1)
      .split("")
      .filter((char) => !isNaN(char))
      .join("");
    receiptTemp += `<div class="items_body">
                      <h6>${item.itemName}</h6>
                      <h6> ${item.quantity} </h6>
                      <h6> ${item.quantity * Number(priceChar)}</h6>
                    </div>`;
  });
  receiptTemp += `<div class="total" style="margin-top: 0.9rem;">
                    <span class="total_price">
                      <h5>Total: </h5>
                      <span> &#8358;${total} </span>
                    </span>
                  </div>
                  <div class="total">
                    <span class="total_price">
                      <h5>Amount Received: </h5>
                      <span> &#8358;${amountReceived} </span>
                    </span>
                  </div>
                  <div class="total">
                    <span class="total_price">
                      <h5>Change Issured: </h5>
                      <span> &#8358;${changeIssued} </span>
                    </span>
                  </div>`;
  const tempHtml = path.join(
    path.parse(path.parse(__dirname).dir).dir,
    "public/receipt.html"
  );
  const tempReceipt = path.join(
    path.parse(path.parse(__dirname).dir).dir,
    "public/receipt.pdf"
  );
  let options = { height: `${itemsObj.length * 17 + 50}mm`, width: "120mm" };
  fs.writeFile(tempHtml, receiptTemp, (err) => {
    if (err) {
      return console.log(err);
    }
    const html = fs.readFileSync(tempHtml, "utf8");
    pdf.create(html, options).toFile(tempReceipt, (err) => {
      if (err) {
        return console.log(err);
      } else {
        res.send({ ok: true });
      }
    });
  });
};

const readReceipt = (req, res) => {
  const tempReceipt = path.join(
    path.parse(path.parse(__dirname).dir).dir,
    "public/receipt.pdf"
  );
  const dataFile = fs.readFileSync(tempReceipt);
  res.header("Content-type", "application/pdf");
  res.send(dataFile);
};

module.exports = { findItem, sendReceipt, readReceipt };
