import db from "../../db.server";


export const createRating = async ({shop, productId, CustomerId, star}: {shop: string, productId: string, CustomerId : string, star: number})=>{
    await db.rating.create({
        data: {
            shop: shop,  
            ProductId: productId,
            CustomerId: CustomerId,
            star: star,
        }
    });
}


export const updateRating = async ({shop, productId, CustomerId, star}: {shop: string, productId: string, CustomerId : string, star: number})=>{
    await db.rating.update({
        where:{
            shop_ProductId_CustomerId:{
                shop: shop,  
                ProductId: productId,
                CustomerId: CustomerId
            },
        },
        data: {
            star: star,
        }
    });
}


export const getRating = async ({shop, productId, CustomerId}: {shop: string, productId: string, CustomerId : string})=>{
    const rating = await db.rating.findUnique({
        where: {
            shop_ProductId_CustomerId:{
                shop: shop,  
                ProductId: productId,
                CustomerId: CustomerId
            },
        }
    });
    return rating
}


export const getAllRating = async ({shop, productId, CustomerId}: {shop: string, productId: string, CustomerId : string})=>{
    const ratings = await db.rating.findMany({
        where:{
            shop: shop,
            ProductId: productId
        }
    });

    return ratings
}