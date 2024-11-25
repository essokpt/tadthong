import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

