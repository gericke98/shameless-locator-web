"use server";

import { getOrderQuery } from "@/db/queries";
import puppeteer from "puppeteer";

export async function getOrder(prevState: any, formData: FormData) {
  // Extraigo la informacion del formulario
  const rawFormData = {
    order: formData.get("order"),
    email: formData.get("email"),
  };
  if (rawFormData.order) {
    const order = await getOrderQuery(rawFormData.order.toString());
    // Compruebo si el mail es el mismo (Check de seguridad)
    if (order) {
      if (rawFormData.email?.toString() === order.contact_email) {
        // Extraigo toda la información necesaria y la cargo en tabla propia
        const deliveryWebsite = await searchDelivery(
          order.fulfillments[0].tracking_number
        );
        return {
          message: deliveryWebsite,
          tracking: order.fulfillments[0].tracking_number,
          shipping: order.shipping_address,
        };
      } else {
        return {
          message: "Please enter a valid email address",
          tracking: null,
          shipping: null,
        };
      }
    } else {
      return {
        message: "Please enter a valid order number",
        tracking: null,
        shipping: null,
      };
    }
  } else {
    return {
      message: "Please enter a valid order number",
      tracking: null,
      shipping: null,
    };
  }
}

async function searchDelivery(trackingNumber: string) {
  // La dejo aqui por si en un futuro queremos personalizar pantalla de seguimiento del envio
  const url =
    "https://dinapaqweb.tipsa-dinapaq.com/https/consultaDestinatarios/";
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);
  // Introduzco el localizador
  await page.type("#envio", trackingNumber);
  await page.click(
    "#tabla > tbody > tr:nth-child(5) > td > input[type=submit]"
  );
  // Wait for the new page to open
  const newPagePromise = new Promise((x) =>
    browser.once("targetcreated", (target) => x(target.page()))
  );
  const newPage = (await newPagePromise) as puppeteer.Page;
  await newPage.waitForSelector("#estado-localizado"); // Update the selector

  const result = await newPage.evaluate(() => {
    const resultElement = document.querySelector(
      "#estado-localizado"
    ) as HTMLInputElement;
    return resultElement ? resultElement.value : null;
  });
  await browser.close();
  return result;
}
