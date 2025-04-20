
import Dashboard from '@/pages/dashboard';
import Customers from '@/pages/master/customer';
import { CustomerForm } from '@/pages/master/customer/components/customer-form';
//import Suppliers from '@/pages/master/supplier';
//import { SupplierForm } from '@/pages/master/supplier/components/supplier-form';
import Users from '@/pages/master/user';
import { UserForm } from '@/pages/master/user/components/user-form';
import Vender from '@/pages/master/vender';
import Branch from '@/pages/master/branch';
import { BranchForm } from '@/pages/master/branch/components/branch-form';
import Roles from '@/pages/master/role';
import { RoleForm } from '@/pages/master/role/components/role-form';
import { VenderForm } from '@/pages/master/vender/components/vender-form';
import Location from '@/pages/location';
import { WarehouseForm } from '@/pages/warehouse/components/warehouse-form';
import { LocationForm } from '@/pages/location/components/location-form';
import Warehouses from '@/pages/warehouse';
import ManageWarehouses from '@/pages/warehouse/manage-warehouse/manageWarehouse';
import ManageLocation from '@/pages/location/manage-location';
import { LocationManageForm } from '@/pages/location/manage-location/location-manage-form';
import { WarehouseManageForm } from '@/pages/warehouse/manage-warehouse/warehouse-manage-form';
import Boms from '@/pages/master/bom';
import { BomForm } from '@/pages/master/bom/components/bom-form';
import Items from '@/pages/master/item';
import { ItemForm } from '@/pages/master/item/components/item-form';
import PriceMaster from '@/pages/master/price';
import Uoms from '@/pages/master/Uom';
import { UomForm } from '@/pages/master/Uom/components/uom-form';
import AVL from '@/pages/master/avl';
import { AvlForm } from '@/pages/master/avl/components/avl-form';
import Company from '@/pages/master/company';
import { CompanyForm } from '@/pages/master/company/components/company-form';
import Materials from '@/pages/material';
import { MaterialForm } from '@/pages/material/components/material-form';
import PurchaseRequests from '@/pages/purchase-request';
import { PRForm } from '@/pages/purchase-request/components/pr-form';
import ApproveMaterial from '@/pages/material/approve';
import ApprovePurchaseRequest from '@/pages/purchase-request/approve';
import PurchaseOrders from '@/pages/purchase-order';
import PurchaseOrderReceive from '@/pages/purchase-order/po-receive';
import ConvertPurchaseRequest from '@/pages/purchase-request/convert';
import ApprovePurchaseOrder from '@/pages/purchase-order/approve';
import WorkOrders from '@/pages/workOrder';
import { WorkOrderForm } from '@/pages/workOrder/components/workOrder-form';
import Productions from '@/pages/workOrder/production';
import Forecasts from '@/pages/forecast';
import { ForecastForm } from '@/pages/forecast/components/forecast-form';
import SaleOrders from '@/pages/saleOrder';
import { SaleOrderForm } from '@/pages/saleOrder/components/saleOrder-form';
import Invoices from '@/pages/saleOrder/invoice';
import GenerateInvoice from '@/pages/saleOrder/invoice/generate';
import { PrintInvoice } from '@/pages/saleOrder/invoice/components/printInvoice';
import History from '@/pages/inventory/history';
import Stock from '@/pages/inventory/stock';
import StockTransfer from '@/pages/inventory/transfer';
import { TransferForm } from '@/pages/inventory/transfer/transfer-form';
import InventoryAdjustment from '@/pages/inventory/adjustment';
import { AdjustForm } from '@/pages/inventory/adjustment/adjustment-form';
import WIP from '@/pages/workOrder/wip';
import  UserProfile  from '@/pages/master/user/components/user-profile';
import MasterReports from '@/pages/report';
import DailyReports from '@/pages/report/daily';
import { ViewInvoice } from '@/pages/saleOrder/invoice/components/view-invoice';
import WeightScale from '@/pages/master/weightScale';
import { WeightScalePriceForm } from '@/pages/master/weightScale/components/weightScale-form';
import WeightScaleApprove from '@/pages/master/weightScale/approve';
import WeightScaleReports from '@/pages/report/weightScale';
import PurchaseRequestReports from '@/pages/report/purchaseRequest';
import SaleOrderReports from '@/pages/report/saleOrder';
import WorkOrderReports from '@/pages/report/workOrder';
import PurchaseOrderReports from '@/pages/report/purchaseOrder';

export default [
  {
    index: true,
    element: Dashboard,
    requireRoles: '',
  },
  {
    path: '/master/company',
    element: Company,
    requireRoles: 'company',
  },
  {
    path: '/master/company/new',
    element: CompanyForm,
    requireRoles: 'company',
  },
  {
    path: '/master/branch',
    element: Branch,
    requireRoles: 'branch',
  },
  {
    path: '/master/branch/new',
    element: BranchForm,
    requireRoles: 'branch',
  },
  {
    path: '/master/customer',
    element: Customers,
    requireRoles: 'customer',
  },
  {
    path: '/master/customer/new',
    element: CustomerForm,
    requireRoles: 'customer',
  },
  {
    path: '/master/vender',
    element: Vender,
    requireRoles: 'vender',
  },
  {
    path: '/master/vender/new',
    element: VenderForm,
    requireRoles: 'vender',
  }, 
  // {
  //   path: '/master/supplier',
  //   element: Suppliers,
  //   requireRoles: 'supplier',
  // },
  // {
  //   path: '/master/supplier/new',
  //   element: SupplierForm,
  //   requireRoles: 'supplier',
  // },
  {
    path: '/user/profile',
    element: UserProfile,
    requireRoles: '',
  },
  {
    path: '/master/user',
    element: Users,
    requireRoles: 'user',
  },
  {
    path: '/master/user/new',
    element: UserForm,
    requireRoles: 'user',
  },
  {
    path: '/master/role',
    element: Roles,
    requireRoles: 'managerole',
  },
  {
    path: '/master/role/new',
    element: RoleForm,
    requireRoles: 'managerole',
  },
  {
    path: '/master/item',
    element: Items,
    requireRoles: 'item',
  },
  // item management
  {
    path: '/master/item/new',
    element: ItemForm,
    requireRoles: 'item',
  },
  {
    path: '/master/bom',
    element: Boms,
    requireRoles: 'bom',
  },
  {
    path: '/master/bom/new',
    element: BomForm,
    requireRoles: 'bom',
  },
  {
    path: '/master/price',
    element: PriceMaster,
    requireRoles: 'price',
  },
  {
    path: '/master/uom',
    element: Uoms,
    requireRoles: 'uom',
  },
  {
    path: '/master/uom/new',
    element: UomForm,
    requireRoles: 'uom',
  },
  {
    path: '/master/avl',
    element: AVL,
    requireRoles: 'avl',
  },
  {
    path: '/master/avl/new',
    element: AvlForm,
    requireRoles: 'avl',
  },
  {
    path: '/warehouse',
    element: Warehouses,
    requireRoles: 'warehouse',
  },
  {
    path: '/warehouse/new',
    element: WarehouseForm,
    requireRoles: 'warehouse',
  },
  {
    path: '/location',
    element: Location,
    requireRoles: 'location',
  },
  {
    path: '/location/new',
    element: LocationForm,
    requireRoles: 'location',
  },
  {
    path: '/warehouseBranch',
    element: ManageWarehouses,
    requireRoles: 'manageWarehouse',
  },
  {
    path: '/warehouseBranch/new',
    element: WarehouseManageForm,
    requireRoles: 'manageWarehouse',
  },
  {
    path: '/locationBranch',
    element: ManageLocation,
    requireRoles: 'manageLocation',
  },
  {
    path: '/locationBranch/new',
    element: LocationManageForm,
    requireRoles: 'manageLocation',
  },
  {
    path: '/material',
    element: Materials,
    requireRoles: 'material',
  },
  {
    path: '/material/new',
    element: MaterialForm,
    requireRoles: 'material',
  },
  {
    path: '/purchase-request',
    element: PurchaseRequests,
    requireRoles: 'purchaseRequest',
  },
  {
    path: '/purchase-request/new',
    element: PRForm,
    requireRoles: 'purchaseRequest',
  },
  
  {
    path: 'approve-pr',
    element: ApprovePurchaseRequest,
    requireRoles: 'prApprove',
  },
  {
    path: '/approve',
    element: ApproveMaterial,
    requireRoles: 'approve',
  },
  {
    path: '/purchase-convert',
    element: ConvertPurchaseRequest,
    requireRoles: 'purchaseRequest',
  },
  {
    path: '/purchase-order',
    element: PurchaseOrders,
    requireRoles: 'purchaseOrder',
  },
  {
    path: '/purchaseorder-approve',
    element: ApprovePurchaseOrder,
    requireRoles: 'purchaseOrder',
  },
  {
    path: '/purchaseorder-receive',
    element: PurchaseOrderReceive,
    requireRoles: 'poReceive',
  },
  {
    path: '/workOrder',
    element: WorkOrders,
    requireRoles: 'workOrder',
  },
  {
    path: '/workOrder/new',
    element: WorkOrderForm,
    requireRoles: 'workOrder',
  },
  {
    path: '/production',
    element: Productions,
    requireRoles: 'workOrder',
  },
  {
    path: '/wip',
    element: WIP,
    requireRoles: 'workOrder',
  },
  {
    path: '/saleOrder',
    element: SaleOrders,
    requireRoles: 'saleOrder',
  },
  {
    path: '/saleOrder/new',
    element: SaleOrderForm,
    requireRoles: 'saleOrder',
  },
  {
    path: '/invoice',
    element: Invoices,
    requireRoles: 'saleOrder',
  },
  {
    path: '/invoice/detail/:id',
    element: ViewInvoice,
    requireRoles: 'saleOrder',
  },
  {
    path: '/invoice/view/:id',
    element: PrintInvoice,
    requireRoles: 'saleOrder',
  },
  {
    path: '/invoice/new',
    element: GenerateInvoice,
    requireRoles: 'saleOrder',
  },
  {
    path: '/forecast',
    element: Forecasts,
    requireRoles: 'forecast',
  },
  {
    path: '/forecast/new',
    element: ForecastForm,
    requireRoles: 'forecast',
  },
  //Inventory
  {
    path: '/stock',
    element: Stock,
    requireRoles: 'inventory',
  },
  {
    path: '/transfer',
    element: StockTransfer,
    requireRoles: 'inventory',
  },
  {
    path: '/transfer/new',
    element: TransferForm,
    requireRoles: 'inventory',
  },
  {
    path: '/adjustment',
    element: InventoryAdjustment,
    requireRoles: 'inventory',
  },
  {
    path: '/adjustment/new',
    element: AdjustForm,
    requireRoles: 'inventory',
  },
  {
    path: '/history',
    element: History,
    requireRoles: 'inventory',
  },
  {
    path: '/master-report',
    element: MasterReports,
    requireRoles: 'report',
  },
  {
    path: '/daily-report',
    element: DailyReports,
    requireRoles: 'report',
  },
  {
    path: '/weightScale-report',
    element: WeightScaleReports,
    requireRoles: 'report',
  },
  {
    path: '/purchaseRequest-report',
    element: PurchaseRequestReports,
    requireRoles: 'report',
  },
  {
    path: '/saleOrder-report',
    element: SaleOrderReports,
    requireRoles: 'report',
  },
  {
    path: '/workOrder-report',
    element: WorkOrderReports,
    requireRoles: 'report',
  },
  {
    path: '/purchaseOrder-report',
    element: PurchaseOrderReports,
    requireRoles: 'report',
  },
  {
    path: '/master/weightScalePrice',
    element: WeightScale,
    requireRoles: 'weightScalePrice',
  },
  {
    path: '/master/weightScalePrice/new',
    element: WeightScalePriceForm,
    requireRoles: 'weightScalePrice',
  },
  {
    path: '/master/approveWeightScalePrice',
    element: WeightScaleApprove,
    requireRoles: 'approveWeightScalePrice',
  },
  
];
