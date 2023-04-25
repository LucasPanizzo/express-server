Rutas:

carts:

"/api/carts/purchase/:cid": Termina la compra del carrito seleccionado
"/api/carts/getUserCart" Trae el cart designado al user, usando la session
"/api/carts/"(metodo post): Crea un carrito nuevo.
"/api/carts/"(metodo get): Trae la lista de carts creados.
"/api/carts/:cid": Traer el carrito seleccionado.
"/api/carts/:cid/product/:pid"(metodo post): Añade el producto seleccionado al carrito.
"/api/carts/:cid"(metodo delete): Eliminar el carrito seleccionado.
"/api/carts/:cid/product/:pid"(metodo put): Modifica la cantidad del producto seleccionado en el carrito.
"/api/carts/:cid"(metodo put): Modifica el contenido del carrito.

products:

"/api/products/"(metodo get):Trae una lista de los productos existentes.
"/api/products/:idProduct": Trae el producto seleccionado.
"/api/products/"(metodo post): Crea un producto nuevo.
"/api/products/:idProduct"(metodo delete): Elimina el producto seleccionado.
"/api/products/:idProduct"(metodo put): Modifica el producto seleccionado.

users:

"/api/users/register": Registra un nuevo usuario.
"/api/users/login": Logea el usuario seleccionado.
"/api/users/logout": Destruye la session.
"/api/users/githubRegister": Registra un usuario de github.

sessions:
"/api/sessions/current): Trae la información de la session actual.

views:
"/": login page.
"/registro": pagina de registro.
"/perfil": perfil.
"/loginWrong": fallo de login.
"/registerWrong": fallo de registro.
"/products": pagina contendero de productos.
"/realtimeproducts": crea productos y los visualiza en tiempo real.
"/chathabdlebars": chat funcional con handlebars
"/cart": Carrito de compras ligado a la session
