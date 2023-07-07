async function purchaseFunction() {
  try {
    const userCart = await fetch("/api/carts/getUserCart", { method: "GET" });
    const responseJson = await userCart.json();
    const cart = responseJson.cartProducts.products
    const response = await fetch(`/api/payments`, {
      method: 'POST',
      body: JSON.stringify({cart: cart }),
      headers: { 'Content-Type': 'application/json' }
  });
  const resJson2 = await response.json()
  const url = await resJson2.response.body.init_point
  window.location.href = await url;
  } catch (error) {
    console.log(error);
  }
}

window.onload = async function () {
  try {
    const productCards = document.querySelectorAll('.productCard')
    productCards.forEach(card => {
      calcularTotal(card.dataset.quantity, card.dataset.price);
    });
    for (let i = 0; i < productCards.length; i++) {
      const card = productCards[i];
      const quantity = parseInt(card.dataset.quantity);
      const price = parseFloat(card.dataset.price);
      const productId = card.dataset.id;
      await calcularParcial(quantity, price, productId);
    }
  } catch (error) {
    console.log(error);
  }
}

async function quantityMod(operacion, productID, price) {
  try {
    const userCart = await fetch("/api/carts/getUserCart", { method: "GET" });
    const responseJson = await userCart.json();
    const cartID = responseJson.cartProducts._id;
    const product = await fetch(`/api/products/${productID}`, { method: "GET" });
    const responseJson2 = await product.json();
    const stockProduct = await responseJson2.searchedProduct.stock
    const quantityElement = document.getElementById(`card-quantity-${productID}`);
    const quantity = parseInt(quantityElement.textContent)
    let newQuantity;
    if (operacion === "+") {
      newQuantity = quantity + 1;
      newQuantity > stockProduct ? (newQuantity = stockProduct) : null; 
    } else {
      newQuantity = quantity - 1;
      newQuantity <= 0 ? (newQuantity = 1) : null;
    }
    await fetch(`/api/carts/${cartID}/product/${productID}`, {
      method: "PUT",
      body: `${newQuantity}`,
      headers: {
        "Content-Type": "text/plain",
      },
    });
    await calcularTotal(newQuantity - quantity, price);
    await calcularParcial(newQuantity - quantity, price,productID);
    quantityElement.textContent = String(newQuantity);
  } catch (error) {
    console.log(error);
  }
}

async function calcularTotal(cantidad, precio) {
  try {
    if (typeof calcularTotal.total === "undefined") {
      calcularTotal.total = 0;
    }
    calcularTotal.total += cantidad * precio;
    const total = document.getElementById("total-price");
    total.innerHTML = calcularTotal.total;
  } catch (error) {
    console.log(error);
  }
}

async function calcularParcial(cantidad, precio,id) {
  try {
    if (typeof calcularParcial.total === "undefined") {
      calcularParcial.total = 0;
    }
    calcularParcial.total += cantidad * precio;
    const total = document.getElementById(`parcial-price-${id}`);
    total.innerHTML = calcularParcial.total;
  } catch (error) {
    console.log(error);
  }
}

async function deleteProductInCart(idProduct) {
  try {
    const userCart = await fetch("/api/carts/getUserCart", { method: "GET" });
    const responseJson = await userCart.json();
    const cartID = responseJson.cartProducts._id;
    await fetch(`/api/carts/${cartID}/product/${idProduct}`, { method: "DELETE" });
    location.reload()
  } catch (error) {
    console.log(error);
  }
}
