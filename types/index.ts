export type Order = {
  seguimientos: EnvEstado[];
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

export type EnvEstado = {
  V_COD_TIPO_EST: string;
  D_FEC_HORA_ALTA: string;
};
