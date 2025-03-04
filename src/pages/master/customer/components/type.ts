interface CustomerBilling{
  id: number
  code: string
  name: string
  type: string
  address: string
  district: string
  subDistrict: string
  province: string
  zipcode: string
  country: string
  phone: string
  email: string
  contactName: string
  latitude: string
  longtitude: string
  branch: string
}

export interface CustomerType{
    id: number
    code: string
    companyName: string
    address: string
    phone: string
    fax: string
    ext: string
    tax: string 
    attn: string
    email: string
    type: string
    remark: string
    country : string
    meng : string
    costmarkup : string
    district : string
    subDistrict : string
    province : string
    zipcode : string
    creditHold : boolean
    creditLimitOrder : string
    creditLimitItem : string
    alternatePhone : string
    phoneExt : string
    alternateFax : string
    specialIntruction : string
    paymentTerm : string
    status : string
    currency : string
    paymenTerm : string
    createAt : string
    customerBillings : CustomerBilling []
    customerFileAttach: {
      id: number
      fileName: string
      path: string   
     },
  }

  // existing.FaxExt = cus.FaxExt;
  // existing.Attn = cus.Attn;
  // existing.Country = cus.Country;
  // existing.Meng = cus.Meng;
  // existing.Costmarkup = cus.Costmarkup;
  // existing.CreditHold = cus.CreditHold;
  // existing.CreditLimitOrder = cus.CreditLimitOrder;
  // existing.CreditLimitItem = cus.CreditLimitItem;
  // existing.AlternatePhone = cus.AlternatePhone;          
  // existing.PhoneExt = cus.PhoneExt;
  // existing.AlternateFax = cus.AlternateFax;
  // existing.SpecialIntruction = cus.SpecialIntruction;
  // existing.PaymentTerm = cus.PaymentTerm;
  // existing.Status = cus.Status;
  // existing.Currency = cus.Currency;