import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticate, MONTHLY_PLAN} from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { billing } = await authenticate.admin(request);

  const billingCheck = await billing.require({
    plans: MONTHLY_PLAN,
    isTest: true,
    onFailure: async () => {
      console.log("No active plan");
      return redirect("/app/pricing");
    },
  });

  const subscription = billingCheck.appSubscriptions[0];
  const cancelledSubscription = await billing.cancel({
    subscriptionId: subscription.id,
    isTest: true,
    prorate: true,
  });
  console.log("cancelledSubscription", cancelledSubscription);

  return redirect("/app/pricing");
};
