export enum OrderStatus {
  PENDING = "PENDING",
  COOKING = "COOKING",
  READY = "READY"
}

export interface OrderItem {
  id: number
  name: string
  quantity: number
  note?: string
}

export interface Order {
  id: number
  tableId: number
  status: OrderStatus
  items: OrderItem[]
}