
document.addEventListener("DOMContentLoaded", async () => {

    const userCart = await fetch("/api/carts/getUserCart",{method:"GET"})
    const responseJson = await userCart.json();
    const cartID = responseJson.cartProducts._id;

    fetch(`/api/carts/${cartID}`, {method:"GET"})
    .then((res) => res.json())
    .then((res) => {
        const purchaseButton = document.getElementById('purchase-button')
        purchaseButton.addEventListener("click", async () => {                 
            const remaining = await fetch(`/api/carts/purchase/${cartID}/`,{method:"GET"});
            const responseJsonRemaining = await remaining.json()
            console.log('asd:',responseJsonRemaining);
        });
        const cardContainer = document.getElementById('card-container')
        const products = res.cartProducts
        if (products.length !== 0) {
            let productsList = ""
            products.forEach((product)=>{
                productsList += `<div class="card" style="width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title">${product.productId.title}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">$${product.productId.price}</h6>
                  <p class="card-text">${product.productId.description}</p>
                  <p class="card-text">${product.productId.category}</p>
                  <p class="card-text">cantidad: ${product.quantity}</p>
                </div>
              </div>`
            })
            cardContainer.innerHTML = productsList

        } else {
            let productsList = ""
            productsList += `<h2 class="title-prod">Carrito vacio</h2>`
            cardContainer.innerHTML = productsList
        }
    })
})