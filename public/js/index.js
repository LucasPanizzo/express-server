const socketClient = io()

// REALTIME PRODUCTS

// Recuperaciones del DOM
const form = document.getElementById('formulario')
const inputTitle = document.getElementById('title')
const inputDescription = document.getElementById('description')
const inputPrice = document.getElementById('price')
const inputThumbnails = document.getElementById('thumbnails')
const inputCode = document.getElementById('code')
const inputStock = document.getElementById('stock')
const inputStatus = document.getElementById('status')
const inputCategory = document.getElementById('category')
const cardContainer = document.getElementById('card-container')
// lógica para crear un producto con el form.
form.onsubmit = (e)=>{
    e.preventDefault()
    const newProduct ={
      title : inputTitle.value,
      description : inputDescription.value,
      price : parseInt(inputPrice.value),
      thumbnails : inputThumbnails.value,
      code : inputCode.value,
      stock : parseInt(inputStock.value),
      status : inputStatus.value,
      category : inputCategory.value 
    }
    socketClient.emit('creacionProducto',newProduct)
}
// Funcion correspondiente a la elminación de un producto especifico.
function eliminarProducto(id){
    socketClient.emit('eliminacionProducto',id)
}
function añadirAlCarrito(id){
  socketClient.emit('añadirAlCarrito',id)
}
// Funcion que escribe los productos en el DOM mediante una card.
socketClient.on('writeProducts',async (products)=>{
    let productList = ''
    await products.forEach((product)=>{
        productList += `<div class="card" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${product.price}</h6>
          <p class="card-text">${product.description}</p>
          <p class="card-text">${product.category}</p>
          <button class="delete-butt" onclick="eliminarProducto('${product._id}')">Eliminar producto</button>
          <button class="add-butt" onclick="añadirAlCarrito('${product._id}')">Añadir al carrito</button>
        </div>
      </div>`
    })
    cardContainer.innerHTML = productList
})

