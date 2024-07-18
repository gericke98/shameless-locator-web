export type Order = {
  message: string;
  tracking: number | null;
  shipping: {
    name?: string;
    address1?: string;
    address2?: string | null;
    phone?: number;
    city?: string;
    zip?: string;
    province?: string;
    country?: string;
  } | null;
};
