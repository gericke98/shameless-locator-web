import WarehouseIcon from "../public/warehouse.svg";
import BoxIcon from "../public/box.svg";
import ShippingIcon from "../public/shipping.svg";
import HandshakeIcon from "../public/handshake.svg";
import AlertIcon from "../public/alert.svg";
export const options = [
  {
    idx: 0,
    iconSrc: BoxIcon,
    iconAlt: "Box",
    text: "RECOGIDA",
    textid: "DOCUMENTADO",
  },
  {
    idx: 1,
    iconSrc: WarehouseIcon,
    iconAlt: "Warehouse",
    text: "ALMACÉN",
    textid: "TRANSITO",
  },
  {
    idx: 2,
    iconSrc: ShippingIcon,
    iconAlt: "ShippingIcon",
    text: "REPARTO",
    textid: "REPARTO",
  },
  {
    idx: 3,
    iconSrc: HandshakeIcon,
    iconAlt: "HandshakeIcon",
    text: "ENTREGADO",
    textid: "ENTREGADO",
  },
  {
    idx: 4,
    iconSrc: AlertIcon,
    iconAlt: "AlertIcon",
    text: "INCIDENCIA",
    textid: "INCIDENCIA",
  },
];
