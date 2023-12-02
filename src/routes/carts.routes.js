import { Router } from "express";
import { CartManagerFile } from "../managers/CartManagerFile.js";

const path = "carts.json";
const router = Router();
const cartManagerFile = new CartManagerFile(path);

router.get("/", async (req, res)=>{

const carts = await cartManagerFile.getCarts()

    res.send({
        status:"success",
        carritos: carts
    })
})

router.get("/:cid", async (req, res)=>{
const cid = req.params.cid;
const carts = await cartManagerFile.getCarts();
const targetCart = carts.find((cart) => cart.id === cid)

    res.send({
        status:"success",
        msg:`Productos del carrito con ID: ${cid}`,
        data: targetCart
    })
})

router.post("/:cid/product/:pid", async (req, res)=>{
    const cid = req.params.cid
    const pid = req.params.pid
    
    res.send({
        status:"success",
        msg:`Ruta POST CART - Agrego producto al carrito PID: ${pid} CID: ${cid}`
    })
})


router.post("/", async (req, res)=>{
    const carts = await cartManagerFile.getCarts()
    const newCart = {
        id: 1 + carts.length,
        products: [],
    }

    carts.push(newCart)

    await cartManagerFile.createCart(carts)

    res.send({
        status:"success",
        msg:"Carrito creado"
    })
})

router.put("/:cid", async (req, res)=>{
    const cid = req.params.cid;

    res.send({
        status: "success",
        msg: `Ruta PUT de CART con ID: ${cid}`
    })
})

router.delete("/:cid", async (req, res)=>{
    const cid = req.params.cid;

    res.send({
        status: "succes",
        msg: `Ruta DELETE de CART con ID: ${cid}`
    })
})

export {router as cartRouter}