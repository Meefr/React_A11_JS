import { handelRemoteRequest } from "..//APIs/Apis.js";
// get categories
const cat = $("#side-bar");
console.log(cat);
const api_status = {
  loading: true,
  error: null,
};
const categoriesContainer = $("#categories");
const loadingDoc = $("#loading");
const contentDoc = $("#content-section");
const errorDoc = $("#error");
const productsDoc = $("#products");
const cartContainer = $("#cart-container");
const cartContainerCloseBtn = $("#cart-close-btn");
const cartIcon = $("#cart-icon");
const cartLength = $("#cart-number");
const cartItemsContainer = $("#cart-items-container");
let cartItems = [];

// function to get data from endpoint
// handel ui based on response state
// loding , pending , finish

function addTocart(product) {
  const productIndex = cartItems.findIndex((item) => item.id === product.id);
  if (productIndex !== -1) {
    // Product exists, increase quantity by 1
    cartItems[productIndex].quantity += 1;
    // Update the total price for the product
    cartItems[productIndex].total =
      cartItems[productIndex].quantity * cartItems[productIndex].price;
  } else {
    // Product doesn't exist, push the product into cartItems
    cartItems.push(product);
  }
}

function lodingTrigger(trigger) {
  switch (trigger) {
    case "start":
      loadingDoc.removeClass("d-none");
      loadingDoc.addClass("d-flex");
      contentDoc.removeClass("d-flex");
      contentDoc.addClass("d-none");
      console.log("loading is started");
      break;
    case "end":
      loadingDoc.removeClass("d-flex");
      loadingDoc.addClass("d-none");
      contentDoc.removeClass("d-none");
      contentDoc.addClass("d-flex");

      console.log("loading is ended");
      break;
  }
}
function faild(error) {
  errorDoc.removeClass("d-none");
  errorDoc.addClass("d-flex");
  categoriesContainer.removeClass("d-flex");
  categoriesContainer.addClass("d-none");
  errorDoc.find(".alert").text(error);
  console.log(error);
}
function successCats(data) {
  categoriesContainer.html(
    data
      .map(
        (category, index) =>
          `<li class="list-group-item " id="${category.slug}">${category.name}</li>`
      )
      .join("")
  );
  data.forEach((category) => {
    $(`#${category.slug}`).on("click", function () {
      handelRemoteRequest(
        `products/category/${category.slug}`,
        successProducts,
        faild,
        lodingTrigger
      );
    });
  });
  console.log(data);
}

function successProducts(data) {
  console.log(data);
  console.log(productsDoc);
  productsDoc.html(
    data.products.map(
      (product, index) =>
        `          <div class="col-4">
            <div class="border rounded-2">
              <img src="${product.thumbnail}"class="w-100 mb-2" alt="">
              <div class="px-2">
                <div class="">
                  <h3>${product.title}</h3>
                  <p>${product.description}</p>
                </div>
                <div class="d-flex flex-nowrap align-items-center gap-1 px-3 py-2">
                  <i class="fa fa-star" style="color:#F7C600"></i>
                  <p class="m-0 bg-danger bg-opacity-50 p-1 rounded-2">${product.rating}</p>
                </div>
                <div class="d-flex justify-content-around align-items-center flex-nowrap gap-1  py-2">
                  <p class="m-0 fw-bold fs-3">$${product.price}</p>
                  <button type="button" class="btn btn-danger">Add to cart</button>
                </div>
              </div>
            </div>
          </div>`
    )
  );
}

function removeFromCart(productId) {
  cartItems = cartItems.filter((item) => item.id !== productId);
  successCarts({ products: cartItems });
}

function successCarts(data) {
  cartItems = data.products; 
  cartLength.text(data.products.length);
  cartItemsContainer.html(
    data.products
      .map((item) => {
        return `<div class="d-flex justify-content-around align-items-center gap-2 position-relative p-4">
                <div class="position-absolute top-0 start-0 bg-danger d-flex justify-content-center align-items-center"
                  style="width: 30px; height: 30px;" onclick="removeFromCart(${item.id})">
                  <i class="fa-solid fa-xmark"></i>
                </div>
                <div class="d-flex flex-column gap-2 justify-content-center align-items-center flex-wrap">
                  <h5 class="m-0">${item.title}</h5>
                  <p class="m-0">Price: <span>${item.quantity}</span> x <span>${item.price}</span> : <span>${item.total}</span></p>
                </div>
                <div class="d-flex flex-row flex-md-column gap-3 justify-content-center align-items-center flex-wrap">
                  <i class="fa-solid fa-up-long"></i>
                  <i class="fa-solid fa-down-long"></i>
                </div>
              </div>`;
      })
      .join("")
  );
  let x = $("#144")
    console.log("X",x);
}

removeFromCart(169)
// handelRemoteRequest(
//   "products/categories",
//   successCats,
//   faild,
//   lodingTrigger
// )
handelRemoteRequest("products", successProducts, faild, lodingTrigger)
  .then(() =>
    handelRemoteRequest(
      "products/categories",
      successCats,
      faild,
      lodingTrigger
    )
  )
  .then(() =>
    handelRemoteRequest("carts/1", successCarts, faild, lodingTrigger)
  );

//loding

cartIcon.on("click", () => {
  cartContainer.removeClass("out-left-screen");
  cartContainer.addClass("end-0");
});
cartContainerCloseBtn.on("click", () => {
  cartContainer.removeClass("end-0");
  cartContainer.addClass("out-left-screen");
});

