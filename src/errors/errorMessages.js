
export const ErrorsName = {
    PRODUCT_ERROR: 'Error products',
    USER_ERROR: 'Error users',
    CART_ERROR: 'Error carts',
    CHAT_ERROR: 'Error chat',
    SESSION_ERROR: 'Error session'
  }
  
  export const ErrorsMessage = {
    CART_EMPTYLIST_ERROR: 'No se encontraron carritos en la base de datos.',
    CART_WRONGID_ERROR: 'No se encontro el elemento con el ID especificado.',
    CART_ADD_ERROR: 'Hubo un problema para añadir el carro a la base de datos.',
    CART_EMPTYFIELD_ERROR: 'No puedes envíar un arreglo vacío.',
    CART_WRONGQUANTITY_ERROR: 'Quantity no puede ser menor a 1.',

    CHAT_CREATE_ERROR:  'Error al crear el mensaje.',
    CHAT_GET_ERROR: 'Error al recuperar el mensaje.',

    PRODUCT_EMPTYLIST_ERROR: 'No se encontraron productos en la base de datos.',
    PRODUCT_WRONGID_ERROR: 'No se encontro el elemento con el ID especificado.',
    PRODUCT_ADD_ERROR: 'Hubo un problema para añadir el producto a la base de datos.',
    PRODUCT_REPEATEDCODE_ERROR: 'La variable "code" debe ser única.',

    USER_EMPTYLIST_ERROR: 'No se encontraron users en la base de datos.',
    USER_WRONGDATA_ERROR: 'No se encontro el elemento con la información especificada.',
    USER_ADD_ERROR: 'Hubo un problema para añadir el user a la base de datos.',

    SESSION_INVALID_ERROR: 'Debes iniciar sesión.',

    AUTH_INVALIDROL_ERROR: 'No estas autorizado para realizar esta acción.'
  }
  
  export const ErrorsCause = {
    CART_EMPTYLIST_CAUSE: 'No se encuentra en la base de datos.',
    CART_WRONGID_CAUSE: 'ID invalida.',
    CART_ADD_CAUSE: 'Desconocida.',
    CART_EMPTYFIELD_CAUSE: 'Array está vacío.',
    CART_WRONGQUANTITY_CAUSE: 'Item Quantity tiene un valor no deseado.',

    CHAT_CREATE_CAUSE: 'Envío de datos incorrectos',
    CHAT_GET_CAUSE: 'No se encuentra en la base de datos.',

    PRODUCT_EMPTYLIST_CAUSE: 'No se encuentra en la base de datos.',
    PRODUCT_WRONGID_CAUSE: 'ID invalida.',
    PRODUCT_ADD_CAUSE: 'Debes envíar todos los datos necesarios.',
    PRODUCT_ADD2_CAUSE: 'Es probable que el CODE ya exista en la base de datos, o que no estés envíando todos los datos requeridos para crear un producto.',
    PRODUCT_REPEATEDCODE_CAUSE: 'CODE ya está asignado a otro producto.',

    USER_EMPTYLIST_CAUSE: 'No se encuentra en la base de datos.',
    USER_WRONGDATA_CAUSE: 'Información invalida.',
    USER_ADD_CAUSE: 'Debes envíar todos los datos necesarios.',

    SESSION_INVALID_CAUSE: 'No tienes ninguna sesión activa.',

    AUTH_INVALIDROL_CAUSE: 'Rol invalido.'
  }