interface VenderBilling{ 
    id: string 
    code: string
    name: string
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
    branchId: number  
}

export interface VenderType{
    id: string
    code: string
    companyName: string
    address: string
    district: string
    province: string
    zipcode: string
    country : string
    paymentType : string
    phone: string
    phoneExt: string
    fax: string
    faxExt: string
    tax: string 
    email: string 
    contactName : string
    status : string
    specialIntruction : string
    paymentTerm : string
    currency : string
    alternatePhone : string
    latitude : string
    longtitude : string
    bankAccount : string
    remark: string
    venderTypeId : number
    venderType : {
        id: number
        typeName : string
    }
    venderFileAttach: [{
        id : number
        fileName : string
        path: string
    }]
    venderBillings : VenderBilling []
}

export interface IVenderType{   
    id: number
    typeName : string 
}



// existCus.District = vender.District;
// existCus.Province = vender.Province;
// existCus.Zipcode = vender.Zipcode;
// existCus.Country = vender.Country;
// existCus.VenderType = vender.VenderType;
// existCus.PhoneExt = vender.PhoneExt;
// existCus.FaxExt = vender.FaxExt;
// existCus.Status = vender.Status;
// existCus.SpecialIntruction = vender.SpecialIntruction;
// existCus.PaymentTerm = vender.PaymentTerm;
// existCus.Currency = vender.Currency;
// existCus.AlternatePhone = vender.AlternatePhone;
// existCus.Latitude = vender.Latitude;
// existCus.Longtitude = vender.Longtitude;
// existCus.BankAccount = vender.BankAccount;
