import {  redirect, type ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { deleteAvg } from "../utils/AvgRating.server";
import { deleteRating } from "../utils/Rating.server";
export const action = async ({ request, params }: ActionFunctionArgs) => {
    await authenticate.admin(request)

    const { shop, productId, customerId,_action } = params;
    switch (_action) {
      case 'AvgRating':
        if (!productId || !shop) {
          console.log("product review not exist")
          break;
        }

        try {
          await deleteAvg({ shop, productId });
        } catch (e) {
          console.log("delete false")
        }
        break;
      case 'Rating':
        if (!productId || !shop || !customerId) {
          console.log("Customer Review not exist")
          break;
        }

        try {
          await deleteRating({ shop, productId,customerId});

        } catch (e) {
          console.log("delete fail")
        }
        break;
    }
    return redirect('/app');
};

export default function deleteRecord(){

}