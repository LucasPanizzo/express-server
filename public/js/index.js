const socketClient = io()

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

form.onsubmit = (e)=>{
    e.preventDefault()
    const title = inputTitle.value 
    const description = inputDescription.value 
    const price = parseInt(inputPrice.value) 
    const thumbnails = inputThumbnails.value
    const code = inputCode.value 
    const stock = parseInt(inputStock.value) 
    const status = inputStatus.value 
    const category = inputCategory.value
    console.log(stock);
    socketClient.emit('creacionProducto',{title,description,price,thumbnails,code,stock,status,category})
}

function eliminarProducto(id){
    socketClient.emit('eliminacionProducto',id)
}

socketClient.on('writeProducts',(products)=>{
    let productList = ''
    products.forEach((product)=>{
        productList += `<div class="card" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${product.price}</h6>
          <p class="card-text">${product.description}</p>
          <p class="card-text">${product.category}</p>
          <button class="delete-butt" onclick="eliminarProducto(${product.id})">Eliminar producto</button>
        </div>
      </div>`
    })
    cardContainer.innerHTML = productList
})