import WarehouseIcon from "../public/warehouse.svg";
import BoxIcon from "../public/box.svg";
import ShippingIcon from "../public/shipping.svg";
import HandshakeIcon from "../public/handshake.svg";
import AlertIcon from "../public/alert.svg";
import { MessageKeys } from "@/types";
import { Toast } from "@/components/ui/use-toast";

export const optionsui = [
  {
    idx: 0,
    iconSrc: BoxIcon,
    iconAlt: "Box",
    text: "Pedido en preparación",
    textid: "DOCUMENTADO",
  },
  {
    idx: 1,
    iconSrc: WarehouseIcon,
    iconAlt: "Warehouse",
    text: "Pedido en almacén para ser enviado",
    textid: "TRANSITO",
  },
  {
    idx: 2,
    iconSrc: ShippingIcon,
    iconAlt: "ShippingIcon",
    text: "Pedido en reparto",
    textid: "REPARTO",
  },
  {
    idx: 3,
    iconSrc: HandshakeIcon,
    iconAlt: "HandshakeIcon",
    text: "Entregado",
    textid: "ENTREGADO",
  },
];
export const options = [
  {
    idx: 0,
    iconSrc: BoxIcon,
    iconAlt: "Box",
    text: "Pedido en preparación",
    textid: "DOCUMENTADO",
  },
  {
    idx: 1,
    iconSrc: WarehouseIcon,
    iconAlt: "Warehouse",
    text: "Pedido en almacén para ser enviado",
    textid: "TRANSITO",
  },
  {
    idx: 2,
    iconSrc: ShippingIcon,
    iconAlt: "ShippingIcon",
    text: "Pedido en reparto",
    textid: "REPARTO",
  },
  {
    idx: 3,
    iconSrc: HandshakeIcon,
    iconAlt: "HandshakeIcon",
    text: "Entregado",
    textid: "ENTREGADO",
  },
  {
    idx: 4,
    iconSrc: AlertIcon,
    iconAlt: "AlertIcon",
    text: "INCIDENCIA",
    textid: "INCIDENCIA",
  },
  {
    idx: 5,
    iconSrc: AlertIcon,
    iconAlt: "AlertIcon",
    text: "DEVUELTO",
    textid: "DEVUELTO",
  },
  {
    idx: 6,
    iconSrc: AlertIcon,
    iconAlt: "AlertIcon",
    text: "FALTA DE EXPEDICIÓN",
    textid: "FALTA DE EXPEDICIÓN",
  },
  {
    idx: 7,
    iconSrc: ShippingIcon,
    iconAlt: "ShippingIcon",
    text: "RECANALIZADO",
    textid: "RECANALIZADO",
  },
  {
    idx: 9,
    iconSrc: AlertIcon,
    iconAlt: "AlertIcon",
    text: "FALTA DE EXPEDICIÓN",
    textid: "FALTA DE EXPEDICIÓN",
  },
  {
    idx: 10,
    iconSrc: AlertIcon,
    iconAlt: "AlertIcon",
    text: "DEVUELTO",
    textid: "DEVUELTO",
  },
  {
    idx: 14,
    iconSrc: HandshakeIcon,
    iconAlt: "HandshakeIcon",
    text: "DISPONIBLE",
    textid: "DISPONIBLE",
  },
];

export const messageMap: Record<MessageKeys, Toast> = {
  "Please enter a valid email address": {
    variant: "destructive",
    title: "Introduce un correo electrónico válido",
    description:
      "Introduce el correo electrónico con el que realizaste el pedido",
  },
  "Please enter a valid order number": {
    variant: "destructive",
    title: "Introduce un número de pedido válido",
    description:
      "El número de pedido no lleva # y está compuesto por 5 números",
  },
  "Your order is being prepared": {
    variant: "destructive",
    title: "Tu pedido se está preparando para enviarse",
    description:
      "Tu pedido se está preparando para enviarse y recibirás un correo electrónico con el número de seguimiento en las próximas horas",
  },
};
