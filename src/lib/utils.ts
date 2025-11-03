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

export const formatCurrency = (amount: number,): string => {
  // return new Intl.NumberFormat(undefined, {
  //   style: 'decimal',
  //   currency: currency,
  // }).format(amount);
  return new Intl.NumberFormat("en-EN").format(amount);
};

export function isPermission(module: any, action: string) {
  const acl: any = localStorage.getItem('accessPermissions')
  const aclPermission = JSON.parse(acl)
  const isPermission = aclPermission.find((a: any) => a.permission == module)

  if (isPermission) {
    console.log('find acl:', aclPermission.find((a: any) => a.permission == module));
    if (action == 'create') return isPermission.canCreate
    if (action == 'update') return isPermission.canUpdate
    if (action == 'view') return isPermission.canView
    if (action == 'delete') return isPermission.canDelete

  }

  // console.log('user roles:', localStorage.getItem('roles'));

  return null

}


export function isValidDate(dateString: string) {
  const ddMMyyydRegex = /^\d{2}-\d{2}-\d{4}$/;
  // const regex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/;
  // const date = new Date(dateString);
  // return date instanceof Date && !isNaN(date.getTime());
  return ddMMyyydRegex.test(dateString);
}

export function downloadFileData(filename: any, fileData: any) {
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


export function convertTimeString(value: any) {
      console.log('time format: ', value);

  const regex = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$/;  
  if (regex.test(value)) {
    console.log('is time format: ', value);

    return value; // Return a default value or handle the error as needed
  }
  const totalSeconds = value * 24 * 60 * 60
  // Calculate hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.round(totalSeconds % 60)

  const specificTime = new Date(1900, 1, 1, hours, minutes, seconds, 0); // July 1, 2025, 3:30 PM
  // console.log('convertTimeString', specificTime)

  const timeString = specificTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  return timeString.toString()
}

