
//read
//update
//delete

import Product from "../models/product.js"

export async function createProduct(req,res){

    if(req.user ==  null){
        
        res.status(401).json({message : "Unauthorized"})
        retun
    }

    if(!req.user.isAdmin){
        res.status(403).json({message : "Only admin can create products"})
        return
    }

    try{

        const existingProduct = await Product.findOne({productId : req.body.productId}) 

        if(existingProduct != null){
            res.status(400).json({message : "Product with this productId alrady exists"})
            return
        }

        const product = new Product(req.body)

        await product.save()

        res.status(200).json({message : "Prodcut created successfully"})


    }catch(err){
        res.status(500).json({message: err.message})
    }

}

export async function getAllProduct(req,res) {

    try{
        // Admin kenekta isAvailable products (true/false) dekama view karanna puluwan
        if(req.user != null && req.user.isAdmin){

            const products = await Product.find()
            res.json(products)

        } else {
            //user kenekta isAvailable : true witharai view kranna puluwan
            const products = await Product.find({isAvailable : true})
            res.json(products)
        }

    } catch(err) {

        res.json({message : err.message})
        return

    }
    
}

export async function deleteProduct(req,res) {
    
    if(req.user != null && req.user.isAdmin){
        
        try{

            const product = await Product.findOne({productId : req.params.productId})

            if(product == null){
                res.status(404).json({message : "Product not found"})
                return
            }

            await Product.deleteOne({productId : req.params.productId})

            res.status(200).json({message : "Product deleted successfully"})

        }catch(err){

            res.status(500).json({message : err.message})
            return

        }

    } else {

        res.status(403).json({message : "Only admin can delete products"})
        return

    }
}

export async function updateProduct(req,res) {

    if(req.user != null && req.user.isAdmin){

        try{

            if(req.body.productId != null){
                res.status(400).json({message : "Product cannot be updated"})
                return
            }

            await Product.updateOne({productId : req.params.productId} , req.body)

            res.status(200).json({message : "Product Updated successfully"})

        }catch(err){

            res.status(500).json({message: err.message})
            return

        }

    }else{
        res.status(403).json({message : "Only admin can update products"})
        return
    }
    
}

export async function getProductById(req,res) {

    try{
    
    const product = await Product.findOne( {productId : req.params.productId} )

    if(product == null){

        res.status(404).json( {message : "Product not found"} )
        return
    }

    if(product.isAvailable){

        res.json(product)

    }else{
        if(req.user != null && req.user.isAdmin){

            res.json(product)

        }else{
            
            res.status(403).json({message : "Only admins can view unavailable products"})
            return
        }
    }

    }catch(err){    

        res.json({message : err.message})
    }
}