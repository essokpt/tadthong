import { CustomerType } from "@/pages/master/customer/components/type" 

const URL_BASE = 'https://localhost:7244/api/Customer'
const headers = { 'Content-type': 'application/json' }

export const getCustomers = async (): Promise<CustomerType[]> => {
    return await (await fetch(URL_BASE)).json()
}

export const createUser = async (user: Omit<CustomerType, 'id'>): Promise<CustomerType> => {
    const body = JSON.stringify(user)
    const method = 'POST'
    return await (await fetch(URL_BASE, { body, method, headers })).json()
}

export const editUser = async (customer: CustomerType): Promise<CustomerType> => {
    const body = JSON.stringify(customer)
    const method = 'PUT'
    return await (await fetch(`${URL_BASE}/${customer.id}`, { body, method, headers })).json()
}

export const deleteUser = async (id: number): Promise<number> => {
    const method = 'DELETE'
    await fetch(`${URL_BASE}/${id}`, { method })
    return id
}