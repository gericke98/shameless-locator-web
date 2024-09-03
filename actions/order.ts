"use server";
import axios from "axios";
import { parseString } from "xml2js";
import { getOrderQuery } from "@/db/queries";
import { EnvEstado } from "@/types";
import { options } from "@/placeholder/placeholder";

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
        // Creo una sesión en la web de tipsa
        const id_response = await getId();
        if (order.fulfillments.length > 0) {
          const tracking_number = order.fulfillments[0].tracking_number;
          const albaran = tracking_number.substring(12);
          const envios_response = await estadoEnvioRequest(
            id_response,
            albaran
          );

          return {
            seguimientos: envios_response,
            message: "Success",
            tracking: order.fulfillments[0].tracking_number,
            shipping: order.shipping_address,
          };
        } else {
          return {
            seguimientos: [],
            message: "Your order is being prepared",
            tracking: null,
            shipping: null,
          };
        }
      } else {
        return {
          seguimientos: [],
          message: "Please enter a valid email address",
          tracking: null,
          shipping: null,
        };
      }
    } else {
      return {
        seguimientos: [],
        message: "Please enter a valid order number",
        tracking: null,
        shipping: null,
      };
    }
  } else {
    return {
      seguimientos: [],
      message: "Please enter a valid order number",
      tracking: null,
      shipping: null,
    };
  }
}
// MUNDO TIPSA
export async function getId(): Promise<string | null> {
  const url = process.env.TIPSA_URL_PROD_LOGIN;
  const headers = {
    "Content-Type": "application/xml",
  };
  const soapBody = `
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <LoginWSService___LoginCli2 xmlns="http://tempuri.org/">
        <strCodAge>${process.env.AGENCIA}</strCodAge>
        <strCod>${process.env.CLIENTE}</strCod>
        <strPass>${process.env.CONSTRASENA}</strPass>
        <strIdioma>ES</strIdioma>
        </LoginWSService___LoginCli2>
    </soap:Body>
    </soap:Envelope>
    `;

  try {
    if (url) {
      const response = await axios.post(url, soapBody, { headers });
      return new Promise<string | null>((resolve, reject) => {
        parseString(response.data, (err: Error | null, result: any) => {
          if (err) {
            console.error("Error parsing XML:", err);
            return;
          }

          try {
            const sessionId =
              result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"][0][
                "v1:LoginWSService___LoginCli2Response"
              ][0]["v1:strSesion"][0];
            resolve(sessionId);
          } catch (e) {
            console.error("Error extracting session ID:", e);
            reject(null);
          }
        });
      });
    } else {
      console.error("URL is not defined.");
      return null;
    }
  } catch (error) {
    console.error(`Error sending SOAP request: ${error}`);
    return null;
  }
}

export async function estadoEnvioRequest(
  idValue: string | null,
  albaranValue: string
): Promise<EnvEstado[] | null> {
  const url = `${process.env.TIPSA_URL_PROD_ACTION}ConsEnvEstados`;
  const headers = {
    "Content-Type": "text/xml; charset=utf-8",
  };

  const soapBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
       <soapenv:Header>
          <tem:ROClientIDHeader>
             <tem:ID>${idValue}</tem:ID>
          </tem:ROClientIDHeader>
       </soapenv:Header>
       <soapenv:Body>
          <tem:WebServService___ConsEnvEstados>
             <tem:strCodAgeCargo>${process.env.AGENCIA}</tem:strCodAgeCargo>
             <tem:strCodAgeOri>${process.env.AGENCIA}</tem:strCodAgeOri>
             <tem:strAlbaran>${albaranValue}</tem:strAlbaran>
          </tem:WebServService___ConsEnvEstados>
       </soapenv:Body>
    </soapenv:Envelope>
  `;

  try {
    const response = await axios.post(url, soapBody, { headers });
    return new Promise<EnvEstado[] | null>((resolve, reject) => {
      parseString(response.data, (err: Error | null, result: any) => {
        if (err) {
          console.error("Error parsing XML:", err);
          reject(null);
          return;
        }

        try {
          const envEstadosXml =
            result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"][0][
              "v1:WebServService___ConsEnvEstadosResponse"
            ][0]["v1:strEnvEstados"][0];

          parseString(
            envEstadosXml,
            (innerErr: Error | null, innerResult: any) => {
              if (innerErr) {
                console.error("Error parsing inner XML:", innerErr);
                reject(null);
                return;
              }

              try {
                const estadosArray: EnvEstado[] =
                  innerResult.CONSULTA.ENV_ESTADOS.map((estado: any) => ({
                    V_COD_TIPO_EST: estado.$.V_COD_TIPO_EST,
                    D_FEC_HORA_ALTA: estado.$.D_FEC_HORA_ALTA,
                    formatted: false,
                  }));
                const combinedData = estadosArray.map((estado) => {
                  const trackingInfo = options.find(
                    (option) => option.idx.toString() === estado.V_COD_TIPO_EST
                  );
                  return {
                    ...estado,
                    ...trackingInfo,
                  };
                });
                resolve(combinedData);
              } catch (e) {
                console.error("Error extracting estados:", e);
                reject(null);
              }
            }
          );
        } catch (e) {
          console.error("Error extracting strEnvEstados:", e);
          reject(null);
        }
      });
    });
  } catch (error) {
    console.error(`Error sending SOAP request: ${error}`);
    return null;
  }
}
