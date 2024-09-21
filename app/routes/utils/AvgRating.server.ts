import db from "../../db.server";
import {getAllRating} from "./Rating.server"
export const AvgRating = async ({shop, productId}: {shop: string, productId: string}) => {
    const avgRate = await db.avgRating.findUnique({
        where: {
            shop_productId: {
                shop,
                productId
            }
        }
    });

    const avgStar = avgRate?.avgStar
    const reviewTotal = avgRate?.reviewTotal

    return {avgStar: avgStar, reviewTotal: reviewTotal };
};


export const AvgRatingInit = async ({shop, productId}: {shop: string, productId: string})=>{
    const newRating = await db.avgRating.create({
        data: {
            shop: shop,
            productId: productId,
            avgStar: 0,
            reviewTotal : 0
        }
    });
    return newRating;
}

export const updateAvgRating = async ({shop, productId, CustomerId}: {shop: string, productId: string, CustomerId: string})=>{

    const ratings = await getAllRating({shop, productId, CustomerId});

    const starTotal = ratings.reduce((total,rating)=>{
        return total + rating.star
    },0)
    const lenRating = ratings.length
    const avgStar = Math.floor((starTotal / lenRating)*10)/10
    await db.avgRating.update({
        where:{
            shop_productId:{
                shop: shop,
                productId: productId
            }
        },
        data:{
            avgStar: avgStar,
            reviewTotal: lenRating
        }
    })
    return {avgStar, lenRating}
}

// export const getAvgRating = async ({shop, productId, CustomerId}: {shop: string, productId: string, CustomerId : string})=>{
//     const avgRating = await db.avgRating.findUnique({
//         where: {
//             shop_productId:{
//                 shop: shop,
//                 productId: productId
//             }
//         }
//     });
//     return avgRating
// }




