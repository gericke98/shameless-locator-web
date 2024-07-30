"use server";

import { getOrderQuery } from "@/db/queries";
import chromium from "@sparticuz/chromium-min";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";

const CHROMIUM_PATH =
  "https://vomrghiulbmrfvmhlflk.supabase.co/storage/v1/object/public/chromium-pack/chromium-v123.0.0-pack.tar";

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

async function getBrowser() {
  try {
    if (process.env.NODE_ENV === "production") {
      // const executablePath = await chromium.executablePath();
      // const browser = await puppeteerCore.launch({
      //   args: chromium.args,
      //   defaultViewport: chromium.defaultViewport,
      //   executablePath: executablePath,
      //   headless: chromium.headless,
      // });
      const chromium = await import("@sparticuz/chromium-min").then(
        (mod) => mod.default
      );

      const puppeteerCore = await import("puppeteer-core").then(
        (mod) => mod.default
      );

      const executablePath = await chromium.executablePath(CHROMIUM_PATH);

      const browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
      });
      // return browser;
      return browser;
    } else {
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: "new",
      });
      return browser;
    }
  } catch (e) {
    console.error("Problems creando el browser");
  }
}

async function searchDelivery(trackingNumber: string) {
  // La dejo aqui por si en un futuro queremos personalizar pantalla de seguimiento del envio
  const url =
    "https://dinapaqweb.tipsa-dinapaq.com/https/consultaDestinatarios/";
  let puppeteer: any;
  let browser: any;
  const executablePath = await chromium.executablePath(
    "https://ueryijbhbhikbikwibdj.supabase.co/storage/v1/object/public/ShamelessPublic/chromium%20(1)"
  );
  console.log(executablePath);
  try {
    const browser = await getBrowser();
    if (!browser) {
      throw new Error("Failed to launch the browser instance.");
    }
    // const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    // Introduzco el localizador
    await page.type("#envio", trackingNumber);
    await page.click(
      "#tabla > tbody > tr:nth-child(5) > td > input[type=submit]"
    );
    // Wait for the new page to open
    const newPagePromise: Promise<any> = new Promise((resolve) =>
      browser.once("targetcreated", async (target: any) => {
        const newPage = await target.page();
        resolve(newPage);
      })
    );
    const newPage = await newPagePromise;
    await newPage.waitForSelector("#estado-localizado"); // Update the selector

    const result = await newPage.evaluate(() => {
      const resultElement = document.querySelector(
        "#estado-localizado"
      ) as HTMLInputElement;
      return resultElement ? resultElement.value : null;
    });
    await browser.close();
    return result;
  } catch (error) {
    console.error("Tenemos problems", error);
    console.log("No funciona", error);
    if (browser) {
      await browser.close();
    }
  }
}
