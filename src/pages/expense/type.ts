
export interface ExpenseInterface{
    id: number   
    createAt: string
    actualDate: string
    expenseMonth: string
    expenseTypeId: number
    expenseType: ExpenseType
    value: number
    remark: string
    
}

export interface ExpenseType{
    id: number   
    name: string
    remark: string
    
}