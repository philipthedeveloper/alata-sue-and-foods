const add_new_item = document.querySelector("#add_new_item");
const modal = document.querySelector(".modal");
const item_name = document.querySelector("#item_list");
const quantity = document.querySelector("#quantity");
const items_added = document.querySelector(".items_added");
const add_item = document.querySelector("#add_item");
const decrement = document.querySelector("#decrease");
const increment = document.querySelector("#increase");
const close_modal = document.querySelector("#close_modal");
const total_price = document.querySelector("#total_price");
const generate_receipt = document.querySelector("#generate_pdf");
const processor = document.querySelector(".processor");
const amount_received = document.querySelector(".payment_info");

let itemsObj = [];
let price;

add_new_item.onclick = () => (modal.style.display = "flex");
close_modal.onclick = () => (modal.style.display = "none");
add_item.addEventListener("click", function (e) {
  e.preventDefault();
  const itemName = item_name.value;
  item_name.value = "none";
  quantity.value = "1";
  const quan = quantity.value;
  if (itemName === "none") {
    alert("Select an item!!!");
    return;
  }
  const alreadyExist = itemsObj.some((item) => item.itemName === itemName);
  if (alreadyExist) {
    alert("Item Already Added!!!");
    return;
  }
  const newItem = { itemName, quantity: quan, price };
  itemsObj.push(newItem);
  modal.style.display = "none";
  render();
});

const render = () => {
  items_added.innerHTML = "";
  let total = 0;
  itemsObj.forEach((item, i) => {
    items_added.innerHTML += templateGenerator(
      i,
      item.itemName,
      item.quantity,
      item.price
    );
    const priceChar = item.price
      .substr(1)
      .split("")
      .filter((char) => !isNaN(char))
      .join("");
    total += item.quantity * Number(priceChar);
  });
  total_price.innerHTML = `<h5>Total:</h5> <span> #${total} </span>`;
  amount_received.innerHTML = `
    <div class="form_group">                  
      <label for="amountReceived"> Amount Received </label>
      <input type= "number" name="amountReceived" id="amountReceived" placeholder="Amount Received" step="100" min="0"> 
    </div>
    <div class="form_group">                  
      <label for="change"> change </label>
      <input type= "number" name="change" id="change" placeholder="
      Change" step="50" min="0"> 
    </div>`;
};

function handleQuantity(value, target) {
  const itemName = target.closest(".items_body").id;
  const newItem = itemsObj.map((item) => {
    if (item.itemName === itemName) {
      if (value === -1) {
        if (Number(item.quantity) >= 2) {
          const newQuantity = Number(item.quantity) - 1;
          return { ...item, quantity: newQuantity };
        } else {
          return item;
        }
      } else if (value === 1) {
        const newQuantity = Number(item.quantity) + 1;
        return { ...item, quantity: newQuantity };
      }
    } else {
      return item;
    }
  });
  itemsObj = newItem;
  render();
}

function handleDelete(target) {
  const itemName = target.closest(".items_body").id;
  const newItem = itemsObj.filter((item) => item.itemName !== itemName);
  itemsObj = newItem;
  render();
}

const templateGenerator = (index, itemName, itemQuan, itemPrice) => {
  const priceChar = itemPrice
    .substr(1)
    .split("")
    .filter((char) => !isNaN(char));

  return `<div class="items_body" id="${itemName}">
            <h5>${index + 1}</h5>
            <h5>${itemName}</h5>
            <div class="quantity">
              <button id="decrease" onclick = "handleQuantity(-1, this)"> - </button>
              <h5>${itemQuan}</h5>
              <button id="increase" onclick = "handleQuantity(1, this)"> + </button>
            </div>
            <h5>${itemPrice}</h5>
            <h5>#${itemQuan * Number(priceChar.join(""))}</h5>
            <button id="delete" onclick = handleDelete(this)><i class="fa-solid fa-trash-can"></i> </button>
          </div>`;
};

item_name.onchange = function () {
  const itemName = this.value;
  if (itemName === "none") {
    return;
  }
  fetch(`${location.href}/item/${itemName}`)
    .then((res) => res.json())
    .then((data) => {
      price = data.price;
    })
    .catch((err) => console.log(err));
};

generate_receipt.addEventListener("click", function (e) {
  const url = window.location.origin + "/receipt";
  const amountInput = document.querySelector("#amountReceived");
  const change = document.querySelector("#change");
  const cashier_name = document
    .querySelector("#cashier")
    .textContent.replace("Current Cashier: ", "");
  const amountReceived = amountInput?.value;
  const changeIssued = change?.value;

  if (!amountInput || !change) {
    return alert("Please add at least an item...");
  } else if (Number(amountReceived) == 0 || changeIssued.length < 1) {
    return alert("Enter the amount received and change issued");
  }
  processor.style.display = "flex";
  amountInput.value = "";
  change.value = "";
  let total = 0;

  itemsObj.forEach((item, i) => {
    const priceChar = item.price
      .substr(1)
      .split("")
      .filter((char) => !isNaN(char))
      .join("");
    total += item.quantity * Number(priceChar);
  });

  const reqObj = {
    cashier: cashier_name,
    itemsObj,
    total,
    amountReceived,
    changeIssued,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(reqObj),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      if (data.ok) {
        processor.style.display = "none";
        window.open("/receipt", "_blank");
      }
    });
});
