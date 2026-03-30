import express from 'express'
import { createProduct, deleteProduct, getAllProduct, getProductById, updateProduct } from '../controllers/productController.js'

const productRouter = express.Router()

productRouter.post("/" , createProduct)
productRouter.get("/" , getAllProduct)

productRouter.get("/search", (req,res) => {
    res.json({message : "Search endpoint"})
})

productRouter.get("/:productId" , getProductById)
productRouter.delete("/:productId" , deleteProduct)
productRouter.put("/:productId" , updateProduct)

export default productRouter