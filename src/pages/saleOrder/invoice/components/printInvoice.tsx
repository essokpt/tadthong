import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Invoice } from './schema'
import { findInvoiceById } from '@/services/saleOrderApi'
import logo from '../../../../../src/assets/logo.jpg'
import '@/components/print/style.css'
import { useReactToPrint } from "react-to-print";
import { CompanySchema } from '@/pages/master/company/components/schema'

export const PrintInvoice = () => {
  const [invoiceDetail, setInvoiceDetail] = useState<Invoice>()
  const [companyInfo, setCompanyInfo] = useState<CompanySchema>()

  const { id } = useParams()
 // const componentRef = useRef();
  const componentRef = useRef<HTMLDivElement>(null)
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  
    // print: async (printIframe) => {
    //   const document = printIframe.contentDocument;
    //   if (document) {
    //     const html = document.getElementsByClassName("App")[0];
    //     const options = {
    //       margin: 0,
    //       filename: "the-joys-of-buying-over-building.pdf",
    //     };
    //     const exporter = new Html2Pdf(html, options);
    //     await exporter.getPdf(options);
    //   }
    // },
  });

  useEffect(() => {
    findInvoiceById(id).then((data) => {
        setInvoiceDetail(data.invoice)
        setCompanyInfo(data.company)
    })
  }, [])
  return (
      <div className = "invoice-wrapper" id = "print-area" >
            <div className = "invoice" ref={componentRef}>
                <div className = "invoice-container" >
                    <div className = "invoice-head">
                        <div className = "invoice-head-top">
                            <div className = "invoice-head-top-left text-start items-center">
                                <img src = {logo} />
                                <p>{companyInfo?.companyName}</p>
                            </div>
                            <div className = "invoice-head-top-right text-center float-end">
                                <h4 className='border border-sky-500 w-40'>สำหรับลูกค้า</h4>
                            </div>
                        </div>
                        <div className = "hr"></div>
                        <div className = "invoice-head-middle">
                            <div className = "invoice-head-middle-left text-start">
                                <p><span className = "text-bold">Date</span>: {invoiceDetail?.createAt}</p>
                            </div>
                            <div className = "invoice-head-middle-right text-end">
                                <p><span className = "text-bold">Invoice No:</span>{invoiceDetail?.code}</p>
                            </div>
                        </div>
                        <div className = "hr"></div>
                        <div className = "invoice-head-bottom">
                            <div className = "invoice-head-bottom-left">
                                <ul>
                                    <li className = 'text-bold'>Company:</li>
                                    <li>TadRhong 88 Co.Ltd.,</li>
                                    <li>222 M.4</li>
                                    <li>Thailand 10982</li>
                                    <li>-</li>
                                </ul>
                            </div>
                            <div className = "invoice-head-bottom-right">
                                <ul className = "text-end">
                                    <li className = 'text-bold'>Customer:</li>
                                    <li>Name:{invoiceDetail?.customer.companyName}</li>
                                    <li>Address:{invoiceDetail?.customer.address}</li>
                                    <li>{invoiceDetail?.customer.district}
                                        {invoiceDetail?.customer.province}
                                    </li>
                                    <li>Country: {invoiceDetail?.customer.country}
                                    {invoiceDetail?.customer.zipcode}
                                    </li>
                                    <li>Contact: {invoiceDetail?.customer.attn}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className = "overflow-view">
                        <div className = "invoice-body">
                            <table>
                                <thead>
                                    <tr>
                                        <td className = "text-bold">Code</td>
                                        <td className = "text-bold">Description</td>                                        
                                        <td className = "text-bold">QTY</td>
                                        <td className = "text-bold">Unit Price</td>
                                        <td className = "text-bold">Amount</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    { invoiceDetail?.invoiceItems?.map((item) => (
                                         <tr key={item.id}>
                                          <td className='text-center'>{item.saleOrderItems?.itemMaster?.code}</td>
                                          <td className='text-left'>{item.saleOrderItems?.itemMaster?.name}</td>
                                          <td className='text-center'>{item.saleOrderItems?.quantity}</td>
                                          <td className='text-center'>{item.saleOrderItems?.unitPrice}</td>
                                          <td className='text-center'>{item.saleOrderItems?.amount}</td>
                                          </tr>
                                    ))}                                                                  
                                   
                                </tbody>
                            </table>
                            <div className = "invoice-body-bottom">
                                <div className = "invoice-body-info-item border-bottom">
                                    <div className = "info-item-td text-end text-bold">Sub Total:</div>
                                    <div className = "info-item-td text-end">$2150.00</div>
                                </div>
                                <div className = "invoice-body-info-item border-bottom">
                                    <div className = "info-item-td text-end text-bold">Tax:</div>
                                    <div className = "info-item-td text-end">$215.00</div>
                                </div>
                                <div className = "invoice-body-info-item">
                                    <div className = "info-item-td text-end text-bold">Total:</div>
                                    <div className = "info-item-td text-end">$21365.00</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className = "invoice-foot text-center">
                        <p><span className = "text-bold text-center">NOTE:&nbsp;</span>This is computer generated receipt and does not require physical signature.</p>

                        <div className = "invoice-btns">
                            <button type = "button" className = "invoice-btn" onClick={handlePrint} >
                                <span>
                                    <i className="fa-solid fa-print"></i>
                                </span>
                                <span>Print</span>
                            </button>
                            <button type = "button" className = "invoice-btn">
                                <span>
                                    <i className="fa-solid fa-download"></i>
                                </span>
                                <span>Download</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
   
  )
}
