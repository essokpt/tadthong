import {  
  IconChecklist,
  IconComponents,  
  IconLayoutDashboard,  
  IconSettings,
  IconTruck,
  IconHome,
  IconUsers,
  IconSubtask,
  IconMapPin,
  IconEyeCheck, 
  IconBuildingBank,
  IconHierarchy,
  IconUsersGroup,
  IconShieldCheck,
  IconAssembly,  
  IconTestPipe,
  IconBusinessplan,
  IconHomeDollar,
  IconBrandUnity,
  IconCreditCardPay,  
  IconTruckDelivery,
  IconShoppingBag,
  IconHexagonalPrismPlus,
  IconProgressCheck,  
  IconFileCheck,
  IconRepeat,
  IconTruckReturn,
  IconAffiliate,
  IconListCheck,
  IconReportAnalytics,
  IconListDetails,
  IconReceipt2,
  IconBuildingWarehouse,
  IconServer2,
  IconTransfer,
  IconHistoryToggle,
  IconAdjustments,
  IconCoin,
  IconDeviceTabletPlus,
  IconReport,
} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
  role?: string
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/',
    icon: <IconLayoutDashboard size={22} />,
    role: 'dashboard',
  },
  {
    title: 'Report',
    label: '',
    href: '',
    icon: <IconReport size={22} />,

    sub: [     
      {
        title: 'Master Report',
        label: '',
        href: '/master-report',
        icon: <IconServer2 size={22} />,
        role: 'report',
      },
      {
        title: 'Daily Report',
        label: '',
        href: '/daily-report',
        icon: <IconReportAnalytics size={22} />,
        role: 'report',
      },
      {
        title: 'Weight Scale Report',
        label: '',
        href: '/weightScale-report',
        icon: <IconServer2 size={22} />,
        role: 'report',
      },
      {
        title: 'Purchase Request Report',
        label: '',
        href: '/purchaseRequest-report',
        icon: <IconServer2 size={22} />,
        role: 'report',
      },
      {
        title: 'Sale Order Report',
        label: '',
        href: '/saleOrder-report',
        icon: <IconServer2 size={22} />,
        role: 'report',
      },
      
    ],
  },
  {
    title: 'Master Management',
    label: '',
    href: '',
    icon: <IconComponents size={22} />,
    sub: [
      {
        title: 'Company',
        label: '',
        href: '/master/company',
        icon: <IconBuildingBank size={22} />,
        role: 'company',
      },
      {
        title: 'Branch',
        label: '',
        href: '/master/branch',
        icon: <IconHierarchy size={22} />,
        role: 'branch',
      },
      {
        title: 'User',
        label: '',
        href: '/master/user',
        icon: <IconUsers size={22} />,
        role: 'user',
      },
      {
        title: 'Customer',
        label: '',
        href: '/master/customer',
        icon: <IconUsersGroup size={22} />,
        role: 'customer',
      },
      {
        title: 'Vender',
        label: '',
        href: '/master/vender',
        icon: <IconTruck size={22} />,
        role: 'vender',
      },
     
      {
        title: 'Roles',
        label: '',
        href: '/master/role',
        icon: <IconShieldCheck size={22} />,
        role: 'managerole',
      },
      {
        title: 'Warehouse',
        label: '',
        href: '/warehouse',
        icon: <IconHome size={22} />,
        role: 'warehouse',
      },
      {
        title: 'Location',
        label: '',
        href: '/location',
        icon: <IconMapPin size={22} />,
        role: 'location',
      },
    ],
  },
  
  {
    title: 'Branch Management',
    label: '',
    href: '',
    icon: <IconSubtask size={22} />,
    sub: [
      {
        title: 'Warehouse',
        label: '',
        href: '/warehouseBranch',
        icon: <IconHome size={22} />,
        role: 'manageWarehouse',
      },
      {
        title: 'Locations',
        label: '',
        href: '/locationBranch',
        icon: <IconMapPin size={22} />,
        role: 'manageLocation',
      },
    ],
  },  
  {
    title: 'Items Management',
    label: '',
    href: '',
    icon: <IconAssembly size={22} />,

    sub: [
      {
        title: 'Items',
        label: '',
        href: '/master/item',
        icon: <IconSettings size={22} />,
        role: 'item',
      },
      {
        title: 'Bom',
        label: '',
        href: '/master/bom',
        icon: <IconTestPipe size={22} />,
        role: 'bom',
      },
      {
        title: 'Price Master',
        label: '',
        href: '/master/price',
        icon: <IconBusinessplan size={22} />,
        role: 'price',
      },
      {
        title: 'Uom',
        label: '',
        href: '/master/uom',
        icon: <IconBrandUnity size={22} />,
        role: 'uom',
      },
      {
        title: 'AVL',
        label: '',
        href: '/master/avl',
        icon: <IconHomeDollar size={22} />,
        role: 'avl',
      },
      {
        title: 'Weight Scale Price Master',
        label: '',
        href: '/master/weightScalePrice',
        icon: <IconHomeDollar size={22} />,
        role: 'weightScalePrice',
      },
      {
        title: 'Approve Weight Scale Price Master',
        label: '',
        href: '/master/approveWeightScalePrice',
        icon: <IconHomeDollar size={22} />,
        role: 'approveWeightScalePrice',
      },
    ],
  },
  {
    title: 'Purchase Non-PO',
    label: '',
    href: '',
    icon: <IconCreditCardPay size={22} />,

    sub: [
      {
        title: 'Import Weight Scale & Maintain',
        label: '',
        href: '/material',
        icon: <IconTruckDelivery size={22} />,
        role: 'material',
      },
      {
        title: 'Approve Weight Scale Data',
        label: '',
        href: '/approve',
        icon: <IconEyeCheck size={22} />,
        role: 'approve',
      },
    ],
  },

  {
    title: 'Purchase by PO',
    label: '',
    href: '',
    icon: <IconDeviceTabletPlus size={22} />,

    sub: [
      {
        title: 'Purchase Request',
        label: '',
        href: '/purchase-request',
        icon: <IconHexagonalPrismPlus size={22} />,
        role: 'purchaseRequest',
      },
      {
        title: 'PR-Approval',
        label: '',
        href: '/approve-pr',
        icon: <IconProgressCheck size={22} />,
        role: 'prApprove',
      },
      {
        title: 'Convert Purchase Order',
        label: '',
        href: '/purchase-convert',
        icon: <IconRepeat size={22} />,
        role: 'purchaseRequest',
      },
      {
        title: 'Purchase Order',
        label: '',
        href: '/purchase-order',
        icon: <IconShoppingBag size={22} />,
        role: 'purchaseOrder',
      },
      {
        title: 'Approve-Purchase Order',
        label: '',
        href: '/purchaseorder-approve',
        icon: <IconFileCheck size={22} />,
        role: 'purchaseOrder',
      },
      {
        title: 'Purchase Order Received',
        label: '',
        href: '/purchaseorder-receive',
        icon: <IconTruckReturn size={22} />,
        role: 'poReceive',
      },
    ],
  },
  {
    title: 'Work Order',
    label: '',
    href: '',
    icon: <IconAffiliate size={22} />,

    sub: [
      {
        title: 'Work Order List',
        label: '',
        href: '/workOrder',
        icon: <IconListCheck size={22} />,
        role: 'workOrder',
      },
      {
        title: 'Production Result',
        label: '',
        href: '/production',
        icon: <IconChecklist size={22} />,
        role: 'workOrder',
      },
      {
        title: 'WIP',
        label: '',
        href: '/wip',
        icon: <IconReportAnalytics size={22} />,
        role: 'workOrder',
      },
      
    ],
  },
  {
    title: 'Sale Orders',
    label: '',
    href: '',
    icon: <IconShoppingBag size={22} />,

    sub: [
      {
        title: 'List',
        label: '',
        href: '/saleOrder',
        icon: <IconListDetails size={22} />,
        role: 'saleOrder',
      },
      {
        title: 'Invoice',
        label: '',
        href: '/invoice',
        icon: <IconReceipt2 size={22} />,
        role: 'invoice',
      },
      
    ],
  },
  {
    title: 'Inventory',
    label: '',
    href: '',
    icon: <IconBuildingWarehouse size={22} />,

    sub: [
     
      {
        title: 'Stock',
        label: '',
        href: '/stock',
        icon: <IconServer2 size={22} />,
        role: 'inventory',
      },
      {
        title: 'Transfer',
        label: '',
        href: '/transfer',
        icon: <IconTransfer size={22} />,
        role: 'inventory',
      },
      {
        title: 'Adjustment',
        label: '',
        href: '/adjustment',
        icon: <IconAdjustments size={22} />,
        role: 'inventory',
      },
      {
        title: 'History',
        label: '',
        href: '/history',
        icon: <IconHistoryToggle size={22} />,
        role: 'inventory',
      },
      
    ],
  },
  {
    title: 'Forecast',
    label: '',
    href: '/forecast',
    icon: <IconCoin size={22} />,
    role: 'forecast',
   
  },
  

]
