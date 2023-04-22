
document.addEventListener("DOMContentLoaded", async () => {

    const userCart = await fetch("/api/carts/test",{method:"GET"})
    const responseJson = await userCart.json();
    const cartID = responseJson.cartProducts._id;

    const cardContainer = document.getElementById('card-container')
    const options = {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            credentials: "include"
        },
    };
    fetch("/api/products", options)
        .then((res) => res.json())
        .then((res) => {
            const products = res.payload
            let productsList = ""
            products.forEach((product)=>{
                productsList += `<div class="card" style="width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title">${product.title}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">${product.price}</h6>
                  <p class="card-text">${product.description}</p>
                  <p class="card-text">${product.category}</p>
                  
                  <button class="add-butt" id=${product._id}>Añadir al carrito</button>
                </div>
              </div>`
            })
            cardContainer.innerHTML = productsList

            let addToCart = document.querySelectorAll(".add-butt")

            addToCart.forEach((button) => {
                const productId = button.id
                button.addEventListener("click", async () => {                 
                    //agregar producto al carrito con fetch
                    await fetch(`/api/carts/${cartID}/product/${productId}`,{method:"POST"});
                });
            });


        })

})