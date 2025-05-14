/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { mkConfig, generateCsv, download } from 'export-to-csv'

const csvConfig = mkConfig({
  fieldSeparator: ',',
  filename: 'export', // export file name (without .csv)
  decimalSeparator: '.',
  useKeysAsHeaders: true,
})


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const exportCsv = (data: any) => {
    // const rowData = rows.map((row) => {
    
    // })

    const csv = generateCsv(csvConfig)(data)
    download(csvConfig)(csv)
  }

export const toCurrency = (value: number) =>
  new Intl.NumberFormat("th-TH", {
    currency: "THA",
    style: "currency",
    currencyDisplay: "code",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
  .replace("THA", "")
  .trim()

export const formatCurrency = (amount: number, ): string => {
  // return new Intl.NumberFormat(undefined, {
  //   style: 'decimal',
  //   currency: currency,
  // }).format(amount);
  return new Intl.NumberFormat("en-EN").format(amount);
};

export function isPermission(module:any, action:string){ 
  const acl:any = localStorage.getItem('accessPermissions')
  const aclPermission = JSON.parse(acl)
  const isPermission = aclPermission.find((a:any) => a.permission == module)
 
  if(isPermission){
    console.log('find acl:', aclPermission.find((a:any) => a.permission == module));
     if(action == 'create') return isPermission.canCreate
     if(action == 'update') return isPermission.canUpdate
     if(action == 'view') return isPermission.canView
     if(action == 'delete') return isPermission.canDelete

  }
 
 // console.log('user roles:', localStorage.getItem('roles'));
   
  return null
 
}

export function downloadFileData(filename:any, fileData: any) {
    // Create a Blob from the response data
    const pdfBlob = new Blob([fileData], { type: "text/plain;charset=utf-8" });

    // Create a temporary URL for the Blob
    const fileUrl = window.URL.createObjectURL(pdfBlob);

    // Create a temporary <a> element to trigger the download
    const tempLink = document.createElement("a");
    tempLink.href = fileUrl;
    tempLink.setAttribute(
      "download",
      `download_${filename}`
    ); 
    // Set the desired filename for the downloaded file

    // Append the <a> element to the body and click it to trigger the download
    document.body.appendChild(tempLink);
    tempLink.click();

    // Clean up the temporary elements and URL
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(fileUrl);
  
 }

