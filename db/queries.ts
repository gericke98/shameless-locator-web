"use server";
import "@shopify/shopify-api/adapters/node";

const createSession = (): RequestInit => {
  if (
    !process.env.NEXT_PUBLIC_ACCESS_TOKEN ||
    !process.env.NEXT_PUBLIC_SHOP_URL
  ) {
    throw new Error("Missing Shopify access token or shop URL");
  }

  return {
    headers: {
      "X-Shopify-Access-Token": process.env.NEXT_PUBLIC_ACCESS_TOKEN,
      "Content-Type": "application/json",
    },
  };
};

export async function getOrderQuery(orderNumber: string) {
  const session = createSession();
  // El %23 es lo mismo que poner #
  const url = `${process.env.NEXT_PUBLIC_SHOP_URL}/admin/api/2024-04/orders.json?query=name:%23${orderNumber}`;

  try {
    const response = await fetch(url, session);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.orders[0];
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}
