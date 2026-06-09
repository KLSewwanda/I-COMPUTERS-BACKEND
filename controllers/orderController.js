import order from "../models/order.js"

export async function createOrder(req , res){

    try{

        if(req.user == null){
            return res.status(401).json({message : "Unauthorized"})
        }

        const orderData = {
            orderId: "ORD000001",
            firstName: req.body.firstName || req.user.firstName,
            lastName: req.body.lastName || req.user.lastName,
            email: req.user.email,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            city: req.body.city,
            phone: req.body.phone,
            items: [],
            totalAmount: 0
        }

        let lastOrder = await order.findOne().sort({date : -1})

        if(lastOrder != null){

            const lastOrderId = lastOrder.orderId //"ORD000014"
            const lastOrderNumberString = lastOrderId.replace("ORD" , "") //"000014"
            const lastOrderNumber = parseInt(lastOrderNumberString) //14

            const newOrderNumber = lastOrderNumber + 1 //15
            const newOrderNumberString = newOrderNumber.toString().padStart(6 , "0") //"000015"
            orderId = "ORD" + newOrderNumberString //"ORD000015" 

        }

        for(let i=0 ; i<req.body.items.length ; i++){
            
            const product = await product.findOne({productId : req.body.items[i].productId})

            if(product == null){
                return res.status(400).json({message : "Product with id " + req.body.items[i].productId + " not found"})
            }
            if(product.isAvailable == false){
                return res.status(400).json({message : "Product with id " + req.body.items[i].productId + " is not available"})
            }
            //stock check
            if(product.stock < req.body.items[i].quantity){
                return res.status(400).json({message : "Product with id " + req.body.items[i].productId + " is out of stock"})
            }
            
            orderData.items.push({
                product : {
                    productId : product.productId,
                    name : product.name,
                    image : product.images[0],
                    price : product.price
                },
                quantity : req.body.items[i].quantity
            })

            orderData.totalAmount += product.price * req.body.items[i].quantity
        }

        const newOrder = new order(orderData)
        await newOrder.save()
        //decrease stock
        for(let i=0 ; i<req.body.items.length ; i++){
            
            await product.updateOne(
                {productId : req.body.items[i].productId} ,
                 {$inc : {stock : -req.body.items[i].quantity}})
        }

        res.status(201).json({message : "Order created successfully" , orderId : newOrder.orderId})

    }
    catch(err){
        res.status(500).json({message : "Internal Server Error"})
    }
}