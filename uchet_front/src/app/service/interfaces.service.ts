export interface IList {
  id: number,
  name: string,
  company_id?: number,
  identification?: string,
  description?: string
}

export interface IDevList {
  id: number,
  device_title: string,
  device_resource: string,
  device_partcode: string,
  device_price: string,
  device_type: string
}

export interface IParams {
  param: string,
  value: any
}

export interface IDevHist {
  id: number,
  company: string,
  device: string,
  serial_number: string,
  article: string,
  inventory_number: string,
  print?: number,
  scan?: number,
  resource?: string,
  partcode?: string,
  works?: string,
  expense?: string,
  summa?: string,
  date?: string,
  status: string,
  enginer: string
}

export interface ITask {
  id: number,
  task: string,
  desc: string,
  company: string,
  address: string,
  identification: string,
  contact: string,
  position: string,
  phone: string,
  create_time: string,
  deadline: string,
  status: string,
  author: string
}
