import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { cors } from "remix-utils/cors";
import { authenticate } from "../shopify.server";
import { AvgRating, AvgRatingInit, updateAvgRating } from "./utils/AvgRating.server";
import { createRating, getRating, updateRating } from "./utils/Rating.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticate.public.appProxy(request);

  const url = new URL(request.url);
  const CustomerId = String(url.searchParams.get("customerId"));
  const shop = String(url.searchParams.get("shop"));
  const productId = String(url.searchParams.get("productId"));

  console.log(CustomerId)
  if (!CustomerId || !shop || !productId) {
    return json({
      message: "Missing data. Required data: customerId, productId, shop",
      method: request.method,
    });
  }
  
  const avgRate: {avgStar: Number| undefined, reviewTotal: Number| undefined} = await AvgRating({shop, productId})
  if(avgRate.avgStar === undefined || avgRate.reviewTotal === undefined){
    await AvgRatingInit({shop, productId})
    avgRate.avgStar = 0
    avgRate.reviewTotal =0;
  }
  const rating = await getRating({shop, productId, CustomerId})
  const reviewAvg = {
    avgStar : avgRate.avgStar,
    reviewTotal: avgRate.reviewTotal,
    starValue: rating?.star
  }
  const response = json({ ok: true, message: "Success", data: {avgRating: reviewAvg } });

  return cors(request, response);
}

export async function action({ request }: ActionFunctionArgs) {
  await authenticate.public.appProxy(request);

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const CustomerId = String(data.customerId) as string;
  const productId = String(data.productId);
  const shop = String(data.shop);
  const star = parseInt(String(data.ratingValue))

  if (!CustomerId || !productId || !shop) {
    return json({
      message:
        "Missing data. Required data: customerId, productId, shop, _action",
      method: request.method,
    });
  }

  console.log(CustomerId, productId, shop, star)

  const rating = await getRating({shop,productId,CustomerId})
  if(rating){
    await updateRating({shop,productId,CustomerId,star})
  }
  else{
    await createRating({shop,productId,CustomerId,star})
  }
  

  const {avgStar, lenRating} = await updateAvgRating({shop,productId,CustomerId})


  const response = json({
    message: "Product removed from your wishlist",
    method: request.method,
    avgRate: {
      avgStar : avgStar,
      starValue :  star,
      reviewTotal: lenRating
    }
  });

  return cors(request, response);

}
