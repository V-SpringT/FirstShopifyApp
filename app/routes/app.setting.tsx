import {
    Box,
    Page,
    Text,
    BlockStack,
    InlineGrid,
    Card,
    TextField,
    Button,
  } from "@shopify/polaris";
  import { useState } from "react";
  import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
  import { json } from "@remix-run/node";
  import { Form, useLoaderData } from "@remix-run/react";
  import db from "~/db.server";
  
  interface Settings {
    name: string;
    description: string;
  }
  
  export const loader= async ({ request }: LoaderFunctionArgs) => {
    // Get data from database
    const settings = await db.settings.findFirst();
  
    return settings ? json(settings) : null;
  }
  
  export async function action({ request }: ActionFunctionArgs) {
    const settings = await request.formData();
    const data = Object.fromEntries(settings);
  
    await db.settings.upsert({
      where: { id: 1 },
      update: {
        name: String(data["name"]),
        description: String(data["description"]),
      },
      create: {
        name: String(data["name"]),
        description: String(data["description"]),
      },
    });
  
    return json(data);
  }
  
  export default function SettingsPage() {
    const settings = useLoaderData<typeof loader>();
  
    const [formSate, setFormSate] = useState<Settings>({
      name: (settings && settings.name) || "",
      description: (settings && settings.description) || "",
    });
  
    return (
      <Page>
        <ui-title-bar title="Settings" />
        <BlockStack gap={{ xs: "800", sm: "400" }}>
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
            <Box
              as="section"
              paddingInlineStart={{ xs: "400", sm: "0" }}
              paddingInlineEnd={{ xs: "400", sm: "0" }}
            >
              <BlockStack gap="400">
                <Text as="h3" variant="headingMd">
                  Settings
                </Text>
                <Text as="p" variant="bodyMd">
                  Update app settings and preferences.
                </Text>
              </BlockStack>
            </Box>
            <Card roundedAbove="sm">
              <Form method="post">
                <BlockStack gap="400">
                  <TextField
                    label="App name"
                    name="name"
                    value={formSate.name}
                    onChange={(value: string) =>
                      setFormSate({ ...formSate, name: value })
                    }
                    autoComplete="off"
                  />
                  <TextField
                    label="Description"
                    name="description"
                    value={formSate.description}
                    onChange={(value: string) =>
                      setFormSate({ ...formSate, description: value })
                    }
                    autoComplete="off"
                  />
                  <Button variant="primary" submit={true}>
                    Save
                  </Button>
                </BlockStack>
              </Form>
            </Card>
          </InlineGrid>
        </BlockStack>
      </Page>
    );
  }
  