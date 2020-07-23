import { MenuItem } from './menu-item';
import { environment } from '../../environments/environment';

/**
 * Security
 * superadmin
 * adminretail
 * admin
 * other admins
 */

const IsAccessToOrder = () => {
  return (JSON.parse(localStorage.getItem('roles'))).canAccessToOrder;
};

const IsSuperadmin = () => {
  return (JSON.parse(localStorage.getItem('roles'))).isSuperadmin;
};

const IsAdmin = () => {
  //return (JSON.parse(localStorage.getItem('roles'))).isAdmin;
  if (
    (JSON.parse(localStorage.getItem('roles'))).isSuperadmin ||
    (JSON.parse(localStorage.getItem('roles'))).isAdmin ||
    (JSON.parse(localStorage.getItem('roles'))).isAdminRetail
  ) {
    return true;
  } else {
    return false;
  }
};

const IsAdminCatalogue = () => {
  return (JSON.parse(localStorage.getItem('roles'))).isAdminCatalogue;
};

const IsAdminStore = () => {
  return (JSON.parse(localStorage.getItem('roles'))).isAdminStore;
};

const IsAdminOrder = () => {
  return (JSON.parse(localStorage.getItem('roles'))).isAdminOrder;
};

const IsAdminContent = () => {
  return (JSON.parse(localStorage.getItem('roles'))).isAdminContent;
};

const IsCustomer = () => {
  return (JSON.parse(localStorage.getItem('roles'))).isCustomer;
};

const isCategoryManagementVisible = () => {

  if ('MARKETPLACE' === environment.mode) {
    if (IsSuperadmin()) {
      return true;
    }
  } else {//B2C
    if (IsAdminRetail()) {
      return true;
    }
  }

}

const IsAdminRetail = () => {
  if (
    (JSON.parse(localStorage.getItem('roles'))).isSuperadmin ||
    (JSON.parse(localStorage.getItem('roles'))).isAdminRetail
  ) {
    return true;
  } else {
    return false;
  }
};

export const MENU_ITEMS: MenuItem[] = [
  {
    title: 'COMPONENTS.HOME',
    key: 'COMPONENTS.HOME',
    icon: 'home',
    link: '/pages/home',
    home: true,
  },
  {
    title: 'COMPONENTS.USER_MANAGEMENT',
    key: 'COMPONENTS.USER_MANAGEMENT',
    icon: 'person',
    children: [
      {
        title: 'COMPONENTS.MY_PROFILE',
        key: 'COMPONENTS.MY_PROFILE',
        link: '/pages/user-management/profile',
        hidden: false
      },
      // {
      //   title: 'COMPONENTS.CHANGE_PASSWORD',
      //   key: 'COMPONENTS.CHANGE_PASSWORD',
      //   link: '/pages/user-management/change-password',
      //   hidden: false
      // },
      {
        title: 'COMPONENTS.CREATE_USER',
        key: 'COMPONENTS.CREATE_USER',
        link: '/pages/user-management/create-user',
        hidden: false,
        guards: [IsAdmin]
      },
      {
        title: 'COMPONENTS.USER_LIST',
        key: 'COMPONENTS.USER_LIST',
        link: '/pages/user-management/users',
        hidden: false,
        guards: [IsAdmin]
      },
    ],
  },
  {
    title: 'COMPONENTS.STORE_MANAGEMENT',
    key: 'COMPONENTS.STORE_MANAGEMENT',
    icon: 'shopping-bag',
    link: '',
    hidden: false,
    guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminStore],
    children: [
      {
        title: 'COMPONENTS.STORE',
        key: 'COMPONENTS.STORE',
        link: '/pages/store-management/store',
        hidden: false,
        guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminStore]
      },
      {
        title: 'COMPONENTS.STORES_LIST',
        key: 'COMPONENTS.STORES_LIST',
        link: '/pages/store-management/stores-list',
        hidden: false,
        guards: [IsAdmin]
      },
      {
        title: 'COMPONENTS.CREATE_STORE',
        key: 'COMPONENTS.CREATE_STORE',
        link: '/pages/store-management/create-store',
        hidden: false,
        guards: [IsSuperadmin, IsAdminRetail]
      }
    ],
  },
  {
    title: 'COMPONENTS.CATALOUGE_MANAGEMENT',
    key: 'COMPONENTS.CATALOUGE_MANAGEMENT',
    icon: 'pricetags',
    hidden: false,
    guards: [IsAdminRetail],
    children: [
      {
        title: 'COMPONENTS.CATEGORIES',
        key: 'COMPONENTS.CATEGORIES',
        hidden: false,
        guards: [isCategoryManagementVisible],
        children: [
          {
            title: 'COMPONENTS.CATEGORIES_LIST',
            key: 'COMPONENTS.CATEGORIES_LIST',
            link: '/pages/catalogue/categories/categories-list',
            guards: [isCategoryManagementVisible],
            hidden: false,
          },
          /**
          {
            title: 'COMPONENTS.CREATE_CATEGORY',
            key: 'COMPONENTS.CREATE_CATEGORY',
            link: '/pages/catalogue/categories/create-category',
            hidden: false,
            guards: [isCategoryManagementVisible],
          },
          **/
          {
            title: 'COMPONENTS.CATEGORIES_HIERARCHY',
            key: 'COMPONENTS.CATEGORIES_HIERARCHY',
            link: '/pages/catalogue/categories/categories-hierarchy',
            hidden: false,
            guards: [isCategoryManagementVisible],
          },
        ],
      },
      {
        title: 'COMPONENTS.PRODUCTS',
        key: 'COMPONENTS.PRODUCTS',
        hidden: false,
        guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
        children: [
          {
            title: 'COMPONENTS.PRODUCTS',
            key: 'COMPONENTS.PRODUCTS',
            hidden: false,
            guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
            children: [
              {
                title: 'COMPONENTS.PRODUCTS_LIST',
                key: 'COMPONENTS.PRODUCTS_LIST',
                link: '/pages/catalogue/products/products-list',
                hidden: false
              },
              // {
              //   title: 'COMPONENTS.CREATE_PRODUCT',
              //   key: 'COMPONENTS.CREATE_PRODUCT',
              //   link: '/pages/catalogue/products/create-product',
              //   hidden: false
              // }

            ],
          },
          {
            title: 'COMPONENTS.OPTIONS',
            key: 'COMPONENTS.OPTIONS',
            hidden: false,
            children: [
              {
                title: 'COMPONENTS.OPTIONS_LIST',
                key: 'COMPONENTS.OPTIONS_LIST',
                link: '/pages/catalogue/options/options-list',
                hidden: false
              },

              {
                title: 'COMPONENTS.OPTIONS_VALUES_LIST',
                key: 'COMPONENTS.OPTIONS_VALUES_LIST',
                link: '/pages/catalogue/options/options-values-list',
                hidden: false
              }
            ]
          },
          {
            title: 'COMPONENTS.BRANDS',
            key: 'COMPONENTS.BRANDS',
            hidden: false,
            children: [
              // {
              //   title: 'COMPONENTS.CREATE_BRAND',
              //   key: 'COMPONENTS.CREATE_BRAND',
              //   link: '/pages/catalogue/brands/create-brand',
              //   hidden: false
              // },
              {
                title: 'COMPONENTS.BRANDS_LIST',
                key: 'COMPONENTS.BRANDS_LIST',
                link: '/pages/catalogue/brands/brands-list',
                hidden: false
              }
            ]
          },
          {
            title: 'COMPONENTS.PRODUCTS_GROUPS',
            key: 'COMPONENTS.PRODUCTS_GROUPS',
            hidden: false,
            children: [
              // {
              //   title: 'COMPONENTS.CREATE_PRODUCTS_GROUPS',
              //   key: 'COMPONENTS.CREATE_PRODUCTS_GROUPS',
              //   link: '/pages/catalogue/products-groups/create-products-group',
              //   hidden: false
              // },
              {
                title: 'COMPONENTS.LIST_PRODUCTS_GROUPS',
                key: 'COMPONENTS.LIST_PRODUCTS_GROUPS',
                link: '/pages/catalogue/products-groups/products-groups-list',
                hidden: false
              },
              {
                title: 'COMPONENTS.PRODUCTS_GROUPS_LIST',
                key: 'COMPONENTS.PRODUCTS_GROUPS_LIST',
                link: '/pages/catalogue/products-groups/groups-list',
                hidden: false
              }
            ]
          },


        ]
      },
      // {
      //   title: 'COMPONENTS.BRANDS',
      //   key: 'COMPONENTS.BRANDS',
      //   hidden: false,
      //   children: [
      //     {
      //       title: 'COMPONENTS.CREATE_BRAND',
      //       key: 'COMPONENTS.CREATE_BRAND',
      //       link: '/pages/catalogue/brands/create-brand',
      //       hidden: false
      //     },
      //     {
      //       title: 'COMPONENTS.BRANDS_LIST',
      //       key: 'COMPONENTS.BRANDS_LIST',
      //       link: '/pages/catalogue/brands/brands-list',
      //       hidden: false
      //     },
      //   ],
      // },
      {
        title: 'COMPONENTS.CATALOGUES',
        key: 'COMPONENTS.CATALOGUES',
        hidden: false,
        children: [
          // {
          //   title: 'COMPONENTS.CREATE_CATALOGUE',
          //   key: 'COMPONENTS.CREATE_CATALOGUE',
          //   link: '/pages/catalogue/catalogues/create-catalogue',
          //   hidden: false
          // },
          {
            title: 'COMPONENTS.CATALOGUES_LIST',
            key: 'COMPONENTS.CATALOGUES_LIST',
            link: '/pages/catalogue/catalogues/catalogues-list',
            hidden: false
          },
        ],
      },
      // {
      //   title: 'COMPONENTS.PRODUCTS_GROUPS',
      //   key: 'COMPONENTS.PRODUCTS_GROUPS',
      //   hidden: false,
      //   children: [
      //     {
      //       title: 'COMPONENTS.CREATE_PRODUCTS_GROUPS',
      //       key: 'COMPONENTS.CREATE_PRODUCTS_GROUPS',
      //       link: '/pages/catalogue/products-groups/create-products-group',
      //       hidden: false
      //     },
      //     {
      //       title: 'COMPONENTS.LIST_PRODUCTS_GROUPS',
      //       key: 'COMPONENTS.LIST_PRODUCTS_GROUPS',
      //       link: '/pages/catalogue/products-groups/products-groups-list',
      //       hidden: false
      //     },
      //     {
      //       title: 'COMPONENTS.PRODUCTS_GROUPS_LIST',
      //       key: 'COMPONENTS.PRODUCTS_GROUPS_LIST',
      //       link: '/pages/catalogue/products-groups/groups-list',
      //       hidden: false
      //     },
      //   ],
      // },
      // {
      //   title: 'COMPONENTS.OPTIONS',
      //   key: 'COMPONENTS.OPTIONS',
      //   hidden: false,
      //   children: [
      //     {
      //       title: 'COMPONENTS.OPTIONS_LIST',
      //       key: 'COMPONENTS.OPTIONS_LIST',
      //       link: '/pages/catalogue/options/options-list',
      //       hidden: false
      //     },

      //     {
      //       title: 'COMPONENTS.OPTIONS_VALUES_LIST',
      //       key: 'COMPONENTS.OPTIONS_VALUES_LIST',
      //       link: '/pages/catalogue/options/options-values-list',
      //       hidden: false
      //     }
      //   ]
      // }
    ]
  },
  {
    title: 'COMPONENTS.CONTENT_MANAGEMENT',
    key: 'COMPONENTS.CONTENT_MANAGEMENT',
    icon: 'edit-2',
    children: [
      {
        title: 'COMPONENTS.CONTENT_PAGES',
        key: 'COMPONENTS.CONTENT_PAGES',
        link: '/pages/content/pages/list',
      },
      {
        title: 'COMPONENTS.CONTENT_BOXES',
        key: 'COMPONENTS.CONTENT_BOXES',
        link: '/pages/content/boxes/list',
      },
      {
        title: 'COMPONENTS.CONTENT_IMAGES',
        key: 'COMPONENTS.CONTENT_IMAGES',
        link: '/pages/content/images/list',
      },
      // {
      //   title: 'COMPONENTS.CONTENT_FILES',
      //   key: 'COMPONENTS.CONTENT_FILES',
      //   link: '/pages/content/files/list',
      // },
      // {
      //   title: 'Promotion',
      //   key: 'sideNav.managecontent',
      //   link: '/pages/content/promotion',
      //   // link: '/pages/forms/datepicker',
      // },
    ],
  },
  {
    title: 'COMPONENTS.SHIPPING_MANAGEMENT',
    key: 'COMPONENTS.SHIPPING_MANAGEMENT',
    icon: 'car',
    children: [
      {
        title: 'SHIPPING.EXPEDITION',
        key: 'SHIPPING.EXPEDITION',
        link: '/pages/shipping/config',
      },
      {
        title: 'SHIPPING.ORIGIN',
        key: 'SHIPPING.ORIGIN',
        link: '/pages/shipping/origin',
      },
      {
        title: 'SHIPPING.PACKAGING',
        key: 'SHIPPING.PACKAGING',
        link: '/pages/shipping/packaging',
      },
      {
        title: 'COMPONENTS.RULES',
        key: 'COMPONENTS.RULES',
        link: '/pages/shipping/rules',
      },

      // {
      //   title: 'Options',
      //   key: 'sideNav.options',
      //   link: '/pages/shipping/config',
      // },
      // {
      //   title: 'Packaging',
      //   key: 'sideNav.packaging',
      //   link: '/pages/shipping/config',
      // }
    ]
  },
  // {
  //   title: 'Payment',
  //   // icon: 'fas fa-shopping-cart',
  //   link: '',
  // },
  {
    title: 'COMPONENTS.CUSTOMER_MANAGEMENT',
    key: 'COMPONENTS.CUSTOMER_MANAGEMENT',
    icon: 'people',
    children: [
      {
        title: 'COMPONENTS.CUSTOMER_LIST',
        key: 'COMPONENTS.CUSTOMER_LIST',
        link: '/pages/customer/list',
      },
      // {
      //   title: 'COMPONENTS.OPTIONS',
      //   key: 'COMPONENTS.OPTIONS',
      //   link: '/pages/customer/option/list',
      // },
      // {
      //   title: 'COMPONENTS.OPTIONS_VALUE',
      //   key: 'COMPONENTS.OPTIONS_VALUE',
      //   link: '/pages/customer/value/list',
      // },
      // {
      //   title: 'COMPONENTS.MANAGE_OPTIONS',
      //   key: 'COMPONENTS.MANAGE_OPTIONS',
      //   link: '/pages/customer/manage/list',
      // }
    ]
  },
  // {
  //   title: 'Shipping',
  //   // icon: 'fas fa-shopping-cart',
  //   link: '',
  // },
  // {
  //   title: 'Payment',
  //   // icon: 'fas fa-shopping-cart',
  //   link: '',
  // },
  // {
  //   title: 'Customers',
  //   // icon: 'fas fa-shopping-cart',
  //   link: '',
  // },
  {
    title: 'COMPONENTS.ORDER_MANAGEMENT',
    key: 'COMPONENTS.ORDER_MANAGEMENT',
    icon: 'shopping-cart',
    // link: '/pages/orders',
    // pathMatch: 'prefix',
    hidden: false,
    guards: [IsAccessToOrder],
    children: [
      {
        title: 'COMPONENTS.ORDERS',
        key: 'COMPONENTS.ORDERS',
        link: '/pages/orders',
      }
    ]
  },
  // {
  //   title: 'Manage taxes',
  //   // icon: 'fas fa-shopping-cart',
  //   link: '',
  // },
  // {
  //   title: 'Cache management',
  //   // icon: 'fas fa-shopping-cart',
  //   link: '',
  // },
  // {
  //   title: 'Security',
  //   // icon: 'fas fa-shopping-cart',
  //   link: '',
  // },
  // {
  //   title: 'Configurations',
  //   // icon: 'fas fa-shopping-cart',
  //   link: '',
  // },
];
