import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticate, MONTHLY_PLAN } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { billing, session } = await authenticate.admin(request);
  const { shop } = session;
  const myShop: string = shop.replace(".myshopify.com", "");
  console.log(myShop)
  const appHandle = "v-spring-tver1";

  const billingCheck = await billing.require({
    plans: MONTHLY_PLAN,
    isTest: true,
    onFailure: async () => {
      return billing.request({
        plan: MONTHLY_PLAN,
        isTest: true,
        returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${appHandle}/app/pricing`,
      });
    },
  });

  const subscription = billingCheck.appSubscriptions[0];
  console.log("subscription", subscription);

  // App logic
  return redirect("/app/pricing");
};
