import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);

    const url = new URL(request.url);
    const CustomerId = String(url.searchParams.get("customerId"));
    const shop = String(url.searchParams.get("shop"));
    const productId = String(url.searchParams.get("productId"));

    console.log(CustomerId, shop, productId)
    if(!productId){
        console.log("haha")
    }
  
  };

export default function deleteRecord(){

}