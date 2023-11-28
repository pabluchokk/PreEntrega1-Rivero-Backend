import { Router } from "express";
import { ProductManagerFile } from "../managers/ProductManagerFile.js";

const path = "products.json";
const router = Router();
const productManagerFile = new ProductManagerFile(path);

router.get("/", async (req, res)=>{
    const products = await productManagerFile.getProducts()
    
    res.send({
        status:"success",
        productos: products
    })
})

router.get("/:pid", async (req, res)=>{
    const pid = req.params.pid

    res.send({
        status:"success",
        msg:`Ruta GET ID PRODUCTS con el ID: ${pid}`
    })
})

router.post("/", async (req, res)=>{
    const {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails
    } = req.body

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({
        status: "error",
        msg: "Todos los campos son obligatorios, excepto thumbnails.",
        });
    }
const product = {
    title,
    description,
    code,
    price: Number(price),
    status: true,
    stock: Number(stock),
    category,
    thumbnails: thumbnails || [],
}

    const products = await productManagerFile.createProduct(product)

    res.send({
        status:"success",
        msg:"Producto creado",
        productos: products,
    })
})

router.put("/:pid", async (req, res)=>{
    const pid = req.params.pid;

    const products = await productManagerFile.getProducts();
    const existingProductIndex = products.findIndex(
        (product) => product.id == pid
    )

    const updatedProduct = {
        ...products[existingProductIndex],
        ...req.body,
        id: pid
    }

    products[existingProductIndex] = updatedProduct;

    await productManagerFile.createProduct(products)

    res.send({
        status: "success",
        msg: `Producto con ID ${pid} actualizado`,
        producto: updatedProduct
    })
})

router.delete("/:pid", async (req, res)=>{
    const pid = req.params.pid;
    const products = await productManagerFile.getProducts()
    const existingProductIndex = products.findIndex(
        (product) => product.id == pid
    )
products.splice(existingProductIndex, 1);

await productManagerFile.createProduct(products)

    res.send({
        status: "success",
        msg: `Producto con ID ${pid} eliminado`
    })
})

export {router as productRouter}