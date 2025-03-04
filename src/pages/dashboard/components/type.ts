export interface Summary{
    id: number   
    buyMaterial : number
    buyMaterialAmount: number
    sales : number
    salesAmount : number
    buyMaterialToday : number
    buyMaterialTodayAmount: number
    buyMonthTodate : number
    buyMonthTodateAmount : number
    buyYearToDate : number
    buyYearToDateAmount: number
   
}

export interface Product{
    material : string 
    quantity: number
    amount: number
}

export interface Monthly{
period : string
year_no : string,
month_no : string
buy : number
}