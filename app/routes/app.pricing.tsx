import {
    Box,
    Card,
    Page,
    Text,
    BlockStack,
    CalloutCard,
    Divider,
    Grid,
    ExceptionList,
    Button,
  } from "@shopify/polaris";
  import { CheckIcon } from "@shopify/polaris-icons";
  import type { LoaderFunctionArgs } from "@remix-run/node";
  import { json } from "@remix-run/node";
  import { ANNUAL_PLAN, authenticate, MONTHLY_PLAN } from "~/shopify.server";
  import { useLoaderData } from "@remix-run/react";
  
  interface Plan {
    name: string;
    title: string;
    description: string;
    price: string;
    action: string;
    url: string;
    features: string[];
  }
  
  const planData: Plan[] = [
    {
      name: "Free",
      title: "Free",
      description: "Free plan with basic features",
      price: "0",
      action: "Upgrade to pro",
      url: "/app/upgrade",
      features: [
        "100 wishlist per day",
        "500 Products",
        "Basic customization",
        "Basic support",
      ],
    },
    {
      name: "Monthly subscription",
      title: "Pro",
      description: "Pro plan with advanced features",
      price: "10",
      action: "Upgrade to pro",
      url: "/app/upgrade",
      features: [
        "Unlimited wishlist per day",
        "10000 Products",
        "Advanced customization",
        "Priority support",
      ],
    },
  ];
  
  export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { billing } = await authenticate.admin(request);
  
    try {
      // Attempt to check if the shop has an active payment for any plan
      const billingCheck = await billing.require({
        plans: [MONTHLY_PLAN, ANNUAL_PLAN],
        isTest: true,
        // Instead of redirecting on failure, just catch the error
        onFailure: () => {
          throw new Error("No active plan");
        },
      });
  
      // If the shop has an active subscription, log and return the details
      const subscription = billingCheck.appSubscriptions[0];
      console.log(subscription)
      console.log(`Shop is on ${subscription.name} (id ${subscription.id})`);
  
      return json({ billing, plan: subscription });
    } catch (error: any) {
      // If the shop does not have an active plan, return an empty plan object
      if (error.message === "No active plan") {
        console.log("Shop does not have any active plans.");
        return json({ billing, plan: { name: "Free" } });
      }
  
      // If this is another error, return it
      throw error;
    }
  }
  
  export default function PricingPage() {
    const { plan } = useLoaderData<typeof loader>();
    console.log("plan", plan);
  
    return (
      <Page>
        <ui-title-bar title="Pricing" />
        <CalloutCard
          title="Change your plan"
          illustration="https://cdn.shopify.com/s/files/1/0583/6465/7734/files/tag.png?v=1705280535"
          primaryAction={{
            content: "Cancel Plan",
            url: "/app/cancel",
          }}
        >
          <p>
            You're currently on free plan. Upgrade to pro to unlock more features.
          </p>
        </CalloutCard>
  
        <div style={{ margin: "0.5rem 0" }}>
          <Divider />
        </div>
  
        <Grid>
          {planData.map((planItem: Plan, index) => (
            <Grid.Cell
              key={index}
              columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
            >
              <Card
                background={
                  planItem.name === plan.name
                    ? "bg-surface-success"
                    : "bg-surface"
                }
              >
                <Box padding="400">
                  <Text as="h3" variant="headingMd">
                    {planItem.title}
                  </Text>
                  <Box as="section">
                    {planItem.description}
                    <br />
                    <Text as="h4" variant="headingLg" fontWeight="bold">
                      {planItem.price === "0" ? "" : "$" + planItem.price}
                    </Text>
                  </Box>
  
                  <div style={{ margin: "0.5rem 0" }}>
                    <Divider />
                  </div>
  
                  <BlockStack gap="100">
                    {planItem.features.map((feature, index) => (
                      <ExceptionList
                        key={index}
                        items={[
                          {
                            icon: CheckIcon,
                            description: feature,
                          },
                        ]}
                      />
                    ))}
                  </BlockStack>
                  <div style={{ margin: "0.5rem 0" }}>
                    <Divider />
                  </div>
                  {plan.name !== "Monthly subscription" ? (
                    <Button variant="primary" url={planItem.url}>
                      {planItem.action}
                    </Button>
                  ) : planItem.name === "Monthly subscription" ? (
                    <Text as="p">You're currently on this plan</Text>
                  ) : null}
                </Box>
              </Card>
            </Grid.Cell>
          ))}
        </Grid>
      </Page>
    );
  }
  