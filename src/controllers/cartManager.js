import {existsSync, promises as fs} from 'fs'

class Cart {
    constructor(id, products) {
        this.id = id;
        this.products = products;
    }
}


export class CartManager {
    constructor(path) {
        this.path = path
    }

    VerificoExistencia = () => {
        //Creamos archivo JSON de carrito.
        !existsSync(this.path) && fs.writeFile(this.path, "[]", 'utf-8');
    }

    addCart = async () => {
        this.VerificoExistencia()
        try {
            const read = await fs.readFile(this.path, 'utf-8')
            let carrito = JSON.parse(read)
            let newId
            carrito.length > 0 ? newId = carrito[carrito.length - 1].id + 1 : newId = 1;
            const nuevoCarrito = new Cart (newId, []);
            carrito.push(nuevoCarrito);
            await fs.writeFile(this.path, JSON.stringify(carrito))
            console.log(`Carrito con id: ${nuevoCarrito.id} creado`)
            return newId
        } catch {
            return "Hubo un error al crear el carrito."
        }
            
    }

    getCartById = async (idCart) => {
        this.VerificoExistencia()
        try {
            const carrito = JSON.parse(await fs.readFile(this.path, 'utf-8'))
            let cartIndex = carrito.findIndex(cart => cart.id === idCart);
            
            if (carrito[cartIndex]) {
                return carrito[cartIndex]
            } else {
                return `Carrito con ID: ${cart.id} no encontrado.`
            }
        } catch {
            return "Carrito no encontrado"
        }           
    }

    addProductToCart = async (idCart, idProduct, nuevaCantidad) => {
        this.VerificoExistencia()
        const carrito = JSON.parse(await fs.readFile(this.path, 'utf-8'))

        if(carrito.some(cart => cart.id === parseInt(idCart))) {

            const cartIndex = carrito.findIndex(cart => cart.id === parseInt(idCart))

            const objetoCarrito = new Cart(idCart, carrito[cartIndex].products)
            const prodIndex = objetoCarrito.products.findIndex(obj => obj.product === parseInt(idProduct))
            if(prodIndex === -1) {

                objetoCarrito.products.push({product: idProduct, quantity: nuevaCantidad})

                carrito[cartIndex] = objetoCarrito;
            } else {

                carrito[cartIndex].products[prodIndex].quantity += nuevaCantidad;
            } 

            await fs.writeFile(this.path, JSON.stringify(carrito), 'utf-8')
            return `El producto fue agregado al carrito nro ${idCart}`
        } else {
            return "Hubo un error cargar el producto."
        }
    }

    deleteCart = async (id) => {
        const carrito = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if(carrito.some(cart => cart.id === parseInt(id))) {
            const carritoFiltrados = carrito.filter(cart => cart.id !== parseInt(id))
            await fs.writeFile(this.path, JSON.stringify(carritoFiltrados))
            return "Carrito eliminado"
        } else {
            return "Carrito no encontrado"
        }
    }

    deleteProductFromCart = async (idCart, idProduct) => {
        this.VerificoExistencia()

        const carrito = JSON.parse(await fs.readFile(this.path, 'utf-8'))

        if(carrito.some(cart => cart.id === parseInt(idCart))) {

            const cartIndex = carrito.findIndex(cart => cart.id === parseInt(idCart))
            const objetoCarrito = new Cart(idCart, carrito[cartIndex].products)
            const prodIndex = objetoCarrito.products.findIndex(obj => obj.product === parseInt(idProduct))

            if(prodIndex !== -1) {

                const prodsFiltrados = objetoCarrito.products.filter(obj => obj.product !== parseInt(idProduct))
                objetoCarrito.products = prodsFiltrados;
                carrito[cartIndex] = objetoCarrito;

            } else {

                return "El producto no existe en el carrito y no pudo ser eliminado."

            }
        
            await fs.writeFile(this.path, JSON.stringify(carrito), 'utf-8')
            return "Producto eliminado del carrito"
        } else {
            return "El id enviado no existe"
        }
    }

}