export interface IMethod {
  methods: "CASH" | "SACOMPOS" | "MOMO" | "VNPAY";
  ticket: number;
  revenue: number;
}
export interface IChartAll {
  totalTicket: number;
  totalRevenue: number;
  // method: IMethod[];
  methodsChartAll: string[];
  ticketChartAll: number[];
  revenueChartAll: number[];
}

export interface IChartLine {
  date: string;
  ticket: number;
  cash: number;
  pos: number;
  momo: number;
  vnpay: number;
}
export interface IChartDays {
  days: IChartLine[];
}
export interface IChartArray {
  days: string[];
  ticket: number[];
  cash: number[];
  pos: number[];
  momo: number[];
  vnpay: number[];
}
