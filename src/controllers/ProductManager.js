
import { promises as fs } from "fs";

class Products {

    constructor (title, description, price, code, stock, category, status, thumbnail)
    {
        this.id = Products.Incremento;
        this.title  = title;
        this.description = description
        this.price = price
        this.code = code
        this.stock = stock
        this.category = category
        this.status = status
        this.thumbnail = thumbnail
        
    }

    static Incremento(){
        if (this.idIncrement){
            this.idIncrement ++
        }
        else {
            this.idIncrement = 1;
        }

        return this.idIncrement
    }

}

const prod1 = new Products ("Dodge RAM","250 4x4",504000,"410",2,"4x4",true,[]);
const prod2 = new Products ("Hilux","180 4x4",304000,"411",3,"4x4",true,[]);
const prod3 = new Products ("Remco","180 4x4",104000,"412",3,"4x4",true,[]);


class ProductManager {
    constructor(path) {
        this.path = path;
    }

    // VerificoExistencia = () => {
 
    //      existsSync(this.path) && writeFileSync(this.path, "[]", "utf-8");
    // };


    /*
    VerificoExistencia = () => {
 
        !existsSync(this.path) && writeFileSync(this.path, "[]", "utf-8");
    };

    */

//Creo el producto
async addProduct(newProduct) {
   // const prodObj = { title, description, price, thumbnail, code, stock };


    if (Object.values(newProduct).includes("") || Object.values(newProduct).includes(null)) {
        console.log("Complete los campos, no pueden estar vacio");
    } 
    else {
        // this.VerificoExistencia();
        try {
      
            const read = await fs.readFile(this.path, "utf-8");
            let data = JSON.parse(read);
  
            if (data.some((elem) => elem.code === newProduct.code)) {
                throw "Codigo de producto existente, intente otro";
            } else 
             {
                let newID = Products.Incremento();
                //!data.length ? (newID = 1) : (newID = data[data.length - 1].id + 1);
            

                data.push({ ...newProduct, id: newID });
       
                await fs.writeFile(this.path, JSON.stringify(data), "utf-8");

                return "El producto fue ingresado en la BBDD";
             }
        } catch (err) {
            console.error(err);
        }
    }
}

async getProducts() {
    // this.VerificoExistencia();
    try {
        const read = await fs.readFile(this.path, "utf-8");
        let data = JSON.parse(read);
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

async getProductById(id) {
    // this.VerificoExistencia();
    try {
        const read = await fs.readFile(this.path, "utf-8");
        const data = JSON.parse(read);
        const found = data.find((prod) => prod.id === id);
        if (!found) {
            throw "Id no encontrado";
        } else {
  
            return found;
        } 
    } catch (err) {
        console.error(err);
        return null;
    }
}

async updateProduct(id, title, description, price, thumbnail, code, stock, category,  status) {
    // this.VerificoExistencia();
    try {
        const read = await fs.readFile(this.path, "utf-8");
        const data = JSON.parse(read);
        if (data.some((prod) => prod.id === id)) {
            const index = data.findIndex((prod) => prod.id === id);
            data[index].title = title;
            data[index].description = description;
            data[index].price = price;
            data[index].thumbnail = thumbnail;
            data[index].code = code;
            data[index].stock = stock;
            data[index].status = status;
            data[index].category = category;
            await fs.writeFile(this.path, JSON.stringify(data), "utf-8");

            return "Producto actualizado"
        } else {
            return "Id no encontrado";
        }
    } catch (err) {
        console.log(err);
    }
}


async deleteProduct(id) {
    // this.VerificoExistencia();
    try {
        const read = await fs.readFile(this.path, "utf-8");
        const data = JSON.parse(read);
        const index = data.findIndex((prod) => prod.id === id);
        if (index !== -1) {
            data.splice(index, 1);
            await fs.writeFile(this.path, JSON.stringify(data), "utf-8");
            return "Producto borrado";
        } else {
            return "Id no encontrado";
        }
    } catch (err) {
        console.log(err);
    }
}



async CrearObjetos() {
 
    await this.addProduct(prod1 );
    await this.addProduct(prod2 );
    await this.addProduct(prod3 );
    
    }
// Fin de producto



    
}// de la clase ProductManager


// module.exports = { ProductManager }
export default ProductManager;