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
  if (
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
  } else {//Normal multi stores
    if (IsAdminRetail() || IsAdmin()) {
      return true;
    } else {
      'Not admin retail'
    }
  }

}

const IsAdminRetail = () => {
  if (
    JSON.parse(localStorage.getItem('roles')).isSuperadmin ||
    JSON.parse(localStorage.getItem('roles')).isAdminRetail ||
    JSON.parse(localStorage.getItem('roles')).isAdmin
  ) {
    return true;
  } else {
    return false;
  }
};

const IsOrderManagementVisible = () => {
  if (
    (JSON.parse(localStorage.getItem('roles'))).isSuperadmin ||
    (JSON.parse(localStorage.getItem('roles'))).isAdminRetail ||
    (JSON.parse(localStorage.getItem('roles'))).isAdminOrder ||
    (JSON.parse(localStorage.getItem('roles'))).isAdmin
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
    guards: [IsAdminRetail, IsAdmin],
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
          {
            title: 'COMPONENTS.CREATE_CATEGORY',
            key: 'COMPONENTS.CREATE_CATEGORY',
            link: '/pages/catalogue/categories/create-category',
            hidden: false,
            guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
          },
          {
            title: 'COMPONENTS.CATEGORIES_HIERARCHY',
            key: 'COMPONENTS.CATEGORIES_HIERARCHY',
            link: '/pages/catalogue/categories/categories-hierarchy',
            hidden: false,
            guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
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
            title: 'COMPONENTS.PRODUCTS_LIST',
            key: 'COMPONENTS.PRODUCTS_LIST',
            link: '/pages/catalogue/products/products-list',
            hidden: false,
            guards: [IsAdminRetail]
          },
          {
            title: 'COMPONENTS.PRODUCT_ORDERING',
            key: 'COMPONENTS.PRODUCT_ORDERING',
            link: '/pages/catalogue/products/product-ordering',
            hidden: false,
            guards: [IsAdminRetail]
          }
        ],
      },
      {
        title: 'COMPONENTS.OPTIONS',
        key: 'COMPONENTS.OPTIONS',
        hidden: false,
        guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
        children: [
          {
            title: 'COMPONENTS.OPTIONS_LIST',
            key: 'COMPONENTS.OPTIONS_LIST',
            link: '/pages/catalogue/options/options-list',
            hidden: false,
            guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
          },
          {
            title: 'COMPONENTS.OPTIONS_VALUES_LIST',
            key: 'COMPONENTS.OPTIONS_VALUES_LIST',
            link: '/pages/catalogue/options/options-values-list',
            hidden: false,
            guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
          },
          {
            title: 'COMPONENTS.OPTION_SET_LIST',
            key: 'COMPONENTS.OPTION_SET_LIST',
            link: '/pages/catalogue/options/options-set-list',
            hidden: false,
            guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
          },
          {
            title: 'COMPONENTS.VARIATIONS_LIST',
            key: 'COMPONENTS.VARIATIONS_LIST',
            link: '/pages/catalogue/options/variations/list',
            hidden: false,
            guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
          },
        ]
      },
      {
        title: 'COMPONENTS.BRANDS',
        key: 'COMPONENTS.BRANDS',
        hidden: false,
        guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
        children: [
          {
            title: 'COMPONENTS.BRANDS_LIST',
            key: 'COMPONENTS.BRANDS_LIST',
            link: '/pages/catalogue/brands/brands-list',
            hidden: false,
            guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
          },
          {
            title: 'COMPONENTS.CREATE_BRAND',
            key: 'COMPONENTS.CREATE_BRAND',
            link: '/pages/catalogue/brands/create-brand',
            hidden: false,
            guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
          }
        ]
      },
      {
        title: 'COMPONENTS.PRODUCTS_GROUPS',
        key: 'COMPONENTS.PRODUCTS_GROUPS',
        hidden: false,
        guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
        children: [

          {
            title: 'COMPONENTS.PRODUCTS_GROUPS_LIST',
            key: 'COMPONENTS.PRODUCTS_GROUPS_LIST',
            link: '/pages/catalogue/products-groups/groups-list',
            hidden: false,
            guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
          },
          // {
          //   title: 'COMPONENTS.CREATE_PRODUCTS_GROUPS',
          //   key: 'COMPONENTS.CREATE_PRODUCTS_GROUPS',
          //   link: '/pages/catalogue/products-groups/create-products-group',
          //   hidden: false,
          //   guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
          // }
        ]
      },
      {
        title: 'COMPONENTS.PRODUCT_TYPES',
        key: 'COMPONENTS.PRODUCT_TYPES',
        hidden: false,
        guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
        children: [

          {
            title: 'PRODUCT_TYPE.PRODUCT_TYPE_LIST',
            key: 'PRODUCT_TYPE.PRODUCT_TYPE_LIST',
            link: '/pages/catalogue/types/types-list',
            hidden: false,
            guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
          }
        ]
      },

      /**
      {
        title: 'COMPONENTS.CATALOGUES',
        key: 'COMPONENTS.CATALOGUES',
        hidden: false,
        guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
        children: [

          {
            title: 'COMPONENTS.CATALOGUES_LIST',
            key: 'COMPONENTS.CATALOGUES_LIST',
            link: '/pages/catalogue/catalogues/catalogues-list',
            hidden: false,
            guards: [IsSuperadmin, IsAdmin, IsAdminRetail, IsAdminCatalogue],
          }
        ],
      },
      **/

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
        title: 'COMPONENTS.METHODS',
        key: 'COMPONENTS.METHODS',
        link: '/pages/shipping/methods',
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
      }
      /**
      {
        title: 'COMPONENTS.RULES',
        key: 'COMPONENTS.RULES',
        link: '/pages/shipping/rules',
      },
      */

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
  {
    title: 'COMPONENTS.PAYMENT',
    key: 'COMPONENTS.PAYMENT',
    icon: 'credit-card',
    link: '/pages/payment/methods'
  },
  {
    title: 'COMPONENTS.TAX_MANAGEMENT',
    key: 'COMPONENTS.TAX_MANAGEMENT',
    icon: 'file-text',
    children: [
      {
        title: 'COMPONENTS.TAX_CLASS',
        key: 'COMPONENTS.TAX_CLASS',
        link: '/pages/tax-management/classes-list'
      },
      {
        title: 'COMPONENTS.TAX_RATE',
        key: 'COMPONENTS.TAX_RATE',
        link: '/pages/tax-management/rate-list'
      }
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
    guards: [IsOrderManagementVisible],
    children: [
      {
        title: 'COMPONENTS.ORDERS',
        key: 'COMPONENTS.ORDERS',
        link: '/pages/orders',
        guards: [IsOrderManagementVisible]
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
