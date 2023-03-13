document.addEventListener("DOMContentLoaded", async () => {
    fetch("/api/carts/640f8156f6d8813b3d9e580e", {method:"GET"})
    .then((res) => res.json())
    .then((res) => {
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