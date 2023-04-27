async function addToCart(productId) {
    const userCart = await fetch("/api/carts/getUserCart",{method:"GET"})
    const responseJson = await userCart.json();
    const cartID = responseJson.cartProducts._id;
    await fetch(`/api/carts/${cartID}/product/${productId}`, { method: "POST" });
  }