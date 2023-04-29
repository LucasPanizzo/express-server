async function purchaseFunction() {
  try {
    const userCart = await fetch("/api/carts/getUserCart", { method: "GET" });
    const responseJson = await userCart.json();
    const cartID = responseJson.cartProducts._id;
    const remaining = await fetch(`/api/carts/purchase/${cartID}/`, { method: "GET" });
    const responseJsonRemaining = await remaining.json();
    alert(responseJsonRemaining.message);
    location.reload();
  } catch (error) {
    console.log(error);
  }
  }
  
  window.onload = function() {
    try {
      document.querySelectorAll('.card').forEach(card => {
        calcularTotal(card.dataset.quantity, card.dataset.price);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function quantityMod(operacion, productID, price) {
    try {
      const userCart = await fetch("/api/carts/getUserCart", { method: "GET" });
      const responseJson = await userCart.json();
      const cartID = responseJson.cartProducts._id;
      const quantityElement = document.getElementById(`card-quantity-${productID}`);
      const quantity = parseInt(quantityElement.textContent)
      let newQuantity;
      if (operacion === "+") {
        newQuantity = quantity + 1;
      } else {
        newQuantity = quantity - 1;
        newQuantity <= 0 ? (newQuantity=1):null;
      }
      await fetch(`/api/carts/${cartID}/product/${productID}`, {
        method: "PUT",
        body: `${newQuantity}`,
        headers: {
          "Content-Type": "text/plain",
        },
      });
      await calcularTotal(newQuantity - quantity, price);
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
  
  async function deleteProductInCart(idProduct){
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
  