export interface Summary{
   ID : number
   buyMaterial : number
   sales : number
   buyMaterialToday : number
   buyMonthTodate : number
   buyYearToDate : number
  }

  export interface Product{
    id : number
    material : string
    quantity : number
    amount : number
  }

  export interface Monthly{
    id : number
    period : string
    year_no : string
    month_no : string
    buy : number
  }

  