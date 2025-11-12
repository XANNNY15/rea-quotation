export interface Quotation {
  "QUOTATION NO": string;
  "QUOTATION DATE": string;
  "CLIENT": string;
  "NEW/OLD": string;
  "DESCRIPTION 1": string;
  "DESCRIPTION 2": string;
  "QTY": string;
  "UNIT COST": string;
  "TOTAL AMOUNT": string;
  "SALES  PERSON": string;
  "INVOICE NO": string;
  "STATUS": string;
}

export type FilterField = keyof Quotation;
