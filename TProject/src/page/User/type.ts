// types.ts
export interface Product {
    P_id: number;
    P_name: string;
    P_description: string;
    P_quantity: number;
    P_price: number;
  }
  
  export interface OrderDetail {
    OD_id: number;
    O_id: number;
    P_id: number;
    OD_quantity: number;
    OD_price: number;
    Product: Product;
  }
  
  export interface Order {
    O_id: number;
    C_id: number;
    Q_Date_time: Date;
    O_Total: number;
    PM_id: number;
    A_id: number;
    Payslip: string;
    OrderDetail: OrderDetail[];
  }
  