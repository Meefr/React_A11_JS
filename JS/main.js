import { handelRemoteRequest, handelRemotePost } from "..//APIs/Apis.js";
// get categories
const cat = $("#side-bar");
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
const cartNumber = 1;
const menu = $("#slider");
const menuItems = $("#side-bar");
const cartAlert = $("#cart-alert");
let cartItems = {products:[]};
let isChanges = 0;

// function to get data from endpoint
// handel ui based on response state
// loding , pending , finish

window.addEventListener("beforeunload", () => {
  if (isChanges != 0) {
    console.log("before loading!");
    localStorage.setItem("cart", JSON.stringify(cartItems));
    // handelRemotePost(
    //   `carts/${cartNumber}`,
    //   faild,
    //   lodingTrigger,
    //   cartItems,
    //   "PUT",
    //   true
    // );
  }
});

function addTocart(product) {
  isChanges++;
  const productIndex = cartItems.products.findIndex((item) => item.id === product.id);
  if (productIndex !== -1) {
    cartItems.products[productIndex].quantity =
      Number(cartItems.products[productIndex].quantity) + 1;
    cartItems.products[productIndex].total =
      (cartItems.products[productIndex].quantity * Number(cartItems.products[productIndex].price)).toFixed(2);
  } else {
    cartItems.products.push(product);
  }
  successCarts({ products: cartItems.products });
}
function addOneItem(id) {
  isChanges++;
  const productIndex = cartItems.products.findIndex((item) => item.id === id);
  cartItems.products[productIndex].quantity =
    Number(cartItems.products[productIndex].quantity) + 1;
  cartItems.products[productIndex].total =
    (cartItems.products[productIndex].quantity * Number(cartItems.products[productIndex].price)).toFixed(2);

  successCarts({ products: cartItems.products });
}
function removeOneItem(id) {
  isChanges--;
  const productIndex = cartItems.products.findIndex((item) => item.id === id);
  cartItems.products[productIndex].quantity =
    Number(cartItems.products[productIndex].quantity) - 1;
  cartItems.products[productIndex].total =
    cartItems.products[productIndex].quantity * Number(cartItems.products[productIndex].price);
  if (cartItems.products[productIndex].quantity <= 0) {
    cartItems.products.splice(productIndex, 1);
  }
  successCarts({ products: cartItems.products });
}

function removeFromCart(productId) {
  cartItems.products = cartItems.products.filter((item) => {
    if (item.id !== productId) return item;
    else isChanges -= item.quantity;
  });
  successCarts({ products: cartItems.products });
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
  const renderCategories = () => {
    categoriesContainer.html(
      data
        .map(
          (category, index) =>
            `<li class="list-group-item" id="${category.slug}">${category.name}</li>`
        )
        .join("")
    );

    data.forEach((category) => {
      let doc = $(`#${category.slug}`);
      doc.on("click", function () {
        // Remove the clicked category from the array
        const categoryIndex = data.findIndex(
          (cat) => cat.slug === category.slug
        );
        const [clickedCategory] = data.splice(categoryIndex, 1);

        // Add the clicked category to the beginning of the array
        data.unshift(clickedCategory);

        // Re-render the categories
        renderCategories();

        // Ensure the cat-selected class is added to the newly created element
        $(`#${category.slug}`).addClass("cat-selected");

        handelRemoteRequest(
          `products/category/${category.slug}`,
          successProducts,
          faild,
          lodingTrigger
        );
      });
    });
  };

  renderCategories();
}


function showPopupNotification(text) {
  const popup = document.getElementById("popup-notification");
  popup.innerHTML = `${text} added to cart`;
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000); // Hide after 2 seconds
}

function successProducts(data) {
  console.log(data);
  console.log(productsDoc);
  productsDoc.html(
    data.products
      .map((product, index) => {
        let pCart = {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
          total: product.price,
          discountPercentage: product.discountPercentage,
          discountedTotal: product.discountPercentage,
          thumbnail: product.thumbnail,
        };
        return `
          <div class="col-12 col-sm-6 col-md-4">
            <div class="border rounded-2">
              <img src="${product.thumbnail}" class="w-100 mb-2" alt="">
              <div class="px-2">
                <div class="">
                  <h3>${product.title}</h3>
                  <p>${product.description}</p>
                </div>
                <div class="d-flex flex-nowrap align-items-center gap-1 px-3 py-2">
                  <i class="fa fa-star" style="color:#F7C600"></i>
                  <p class="m-0 bg-danger bg-opacity-50 p-1 rounded-2">${
                    product.rating
                  }</p>
                </div>
                <div class="d-flex justify-content-around align-items-center flex-nowrap gap-1 py-2">
                  <p class="m-0 fw-bold fs-3">$${product.price}</p>
                  
                  <button type="button" class="btn btn-danger add-to-cart-btn" data-product='${JSON.stringify(
                    pCart
                  )}'>Add to cart</button>
                </div>
              </div>
            </div>
          </div>`;
      })
      .join("")
  );

  $(".add-to-cart-btn").on("click", function () {
    const product = JSON.parse($(this).attr("data-product"));
    console.log(product);
    addTocart(product);
    showPopupNotification(product.title);
  });
}
function successCarts(data) {
  if (!data) {
    cartAlert.removeClass("d-none");
    cartItemsContainer.addClass("d-none");
  } else {
    cartItems = data;
    cartLength.text(data.products.length);
    cartItemsContainer.removeClass("d-none");
    cartAlert.addClass("d-none");
    cartItemsContainer.html(
      data.products
        .map((item) => {
          return `<div class="d-flex justify-content-around align-items-center gap-2 position-relative p-4 border">
          <div class="position-absolute top-0 start-0  d-flex justify-content-center align-items-center"
          style="width: 30px; height: 30px; cursor:pointer;" id = "${item.id}">
          <i class="fa-solid fa-xmark"></i>
          </div>
          <div class="w-25">
           <img class="w-100"  src="${item.thumbnail}" alt="">
         </div>
                <div class="d-flex flex-column gap-2 justify-content-center align-items-center flex-wrap">
                  <h5 class="m-0">${item.title}</h5>
                  <p class="m-0">Price: <span>${item.quantity}</span> x <span>${item.price}</span> : <span>${item.total}</span></p>
                </div>
                <div class="d-flex flex-row flex-md-column gap-3 justify-content-center align-items-center flex-wrap">
                  <i class="fa-solid fa-up-long icon" id="add-item-${item.id}" style="cursor:pointer;"></i>
                  <i class="fa-solid fa-down-long icon" id="delete-item-${item.id}" style="cursor:pointer;"></i>
                </div>
              </div>`;
        })
        .join("")
    );
    data.products.forEach((item) => {
      $(`#${item.id}`).on("click", () => {
        removeFromCart(item.id);
      });
      $(`#add-item-${item.id}`).on("click", () => {
        addOneItem(item.id);
      });
      $(`#delete-item-${item.id}`).on("click", () => {
        removeOneItem(item.id);
      });
    });
  }
}

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
    // handelRemoteRequest(
    //   `carts/${cartNumber}`,
    //   successCarts,
    //   faild,
    //   lodingTrigger
    // )
    {
      const cart = JSON.parse(localStorage.getItem("cart"));
      successCarts(cart);
      // if (cart) {
      // }else{

      // }
    }
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

menu.on("click", () => {
  menuItems.toggleClass("left-0");
});
