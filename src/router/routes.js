import {
  adminNotFound,
  adminNotAuthorized,
  supplierNotAuthorized,
  customerNotAuthorized
} from "./middleware";

export const routes = [
  {
    path: "/oauth/:companyName/callback",
    component: () => import("@/components/auth/Callback.vue"),
    name: "oauthCallback"
  },
  {
    path: "/callback",
    component: () => import("@/components/auth/Callback.vue"),
    name: "callback"
  },
  {
    path: "/",
    component: () => import("@/components/layouts/Main.vue"),
    name: "main",
    redirect: "/home",
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: "/admin",
        component: () => import("@/components/pages/Admin.vue"),
        name: "admin",
        redirect: "/admin/company",
        children: [
          {
            path: "company",
            component: () =>
              import("@/components/contents/admin/AdminCompanyEdit.vue"),
            name: "company",
            meta: {
              permissions: ["company:read"]
            }
          },
          {
            path: "sites",
            component: () =>
              import("@/components/contents/admin/AdminSites.vue"),
            name: "sites",
            props: true,
            meta: {
              permissions: ["site:read"]
            }
          },
          {
            path: "site/:siteId",
            component: () =>
              import("@/components/contents/admin/AdminSiteEdit.vue"),
            props: true,
            name: "editSite",
            beforeEnter: adminNotFound("common/getSite"),
            meta: {
              permissions: ["site:read"]
            }
          },
          {
            path: "users",
            component: () =>
              import("@/components/contents/admin/AdminUsers.vue"),
            name: "users",
            meta: {
              permissions: ["user:read"]
            }
          },
          {
            path: "user/:userId",
            component: () =>
              import("@/components/contents/admin/AdminUserEdit.vue"),
            props: true,
            name: "editUser",
            meta: {
              permissions: ["user:read"]
            }
          },
          {
            path: "suppliers",
            component: () =>
              import("@/components/contents/admin/AdminSuppliers.vue"),
            name: "suppliers",
            beforeEnter: supplierNotAuthorized,
            meta: {
              permissions: ["partnersite:read"]
            }
          },
          {
            path: "customers",
            component: () =>
              import("@/components/contents/admin/AdminCustomers.vue"),
            name: "customers",
            beforeEnter: customerNotAuthorized,
            meta: {
              permissions: ["partnersite:read"]
            }
          },
          {
            path: "supplier/new",
            component: () =>
              import("@/components/contents/admin/AdminSupplierNew.vue"),
            name: "newSupplier",
            meta: {
              permissions: ["partnersite:write"]
            }
          },
          {
            path: "supplier/:supplierId",
            component: () =>
              import("@/components/contents/admin/AdminSupplierEdit.vue"),
            props: true,
            name: "editSupplier",
            meta: {
              permissions: ["partnersite:read"]
            }
          },
          {
            path: "products",
            component: () =>
              import("@/components/contents/admin/AdminProducts.vue"),
            name: "products",
            meta: {
              permissions: ["productsite:read"]
            }
          },
          {
            path: "product/new",
            component: () =>
              import("@/components/contents/admin/AdminProductEdit.vue"),
            name: "newProduct",
            beforeEnter: adminNotAuthorized,
            meta: {
              permissions: ["productsite:write"]
            }
          },
          {
            path: "product/:productId",
            component: () =>
              import("@/components/contents/admin/AdminProductEdit.vue"),
            name: "editProduct",
            props: true,
            beforeEnter: supplierNotAuthorized,
            meta: {
              permissions: ["productsite:read"]
            }
          },
          {
            path: "promotions",
            component: () =>
              import("@/components/contents/admin/AdminPromotions.vue"),
            name: "promotions",
            beforeEnter: supplierNotAuthorized,
            meta: {
              permissions: ["promotion:read"]
            }
          },
          {
            path: "promotion/new",
            component: () =>
              import("@/components/contents/admin/AdminPromotionNew.vue"),
            name: "newPromotion",
            meta: {
              permissions: ["promotion:write"]
            }
          },
          {
            path: "promotion/:promotionId",
            component: () =>
              import("@/components/contents/admin/AdminPromotionEdit.vue"),
            props: true,
            name: "editPromotion",
            beforeEnter: supplierNotAuthorized,
            meta: {
              permissions: ["promotion:read"]
            }
          },
          {
            path: "maintenances",
            component: () =>
              import("@/components/contents/admin/AdminSiteMaintenances.vue"),
            name: "maintenances",
            beforeEnter: supplierNotAuthorized,
            meta: {
              permissions: ["site:read"]
            }
          },
          {
            path: "maintenance/:maintenanceId",
            component: () =>
              import(
                "@/components/contents/admin/AdminSiteMaintenanceEdit.vue"
              ),
            props: true,
            name: "editMaintenance",
            beforeEnter: supplierNotAuthorized,
            meta: {
              permissions: ["site:read"]
            }
          },
          {
            path: "tags",
            component: () =>
              import("@/components/contents/admin/AdminTags.vue"),
            name: "tags",
            beforeEnter: supplierNotAuthorized,
            meta: {
              permissions: ["tag:read"]
            }
          },
          {
            path: "tag/new",
            component: () =>
              import("@/components/contents/admin/AdminTagNew.vue"),
            name: "newTag",
            meta: {
              permissions: ["tag:write"]
            }
          },
          {
            path: "tag/:tagId",
            component: () =>
              import("@/components/contents/admin/AdminTagEdit.vue"),
            props: true,
            name: "editTag",
            beforeEnter: supplierNotAuthorized,
            meta: {
              permissions: ["tag:read"]
            }
          }
        ]
      },
      {
        path: "home",
        component: () => import("@/components/pages/Home.vue"),
        name: "home"
      },
      {
        path: "data",
        component: () => import("@/components/pages/Data.vue"),
        name: "data",
        beforeEnter: supplierNotAuthorized,
        meta: {
          permissions: ["stock:read"]
        }
      },
      {
        path: "orders",
        component: () => import("@/orders/OrdersPage.vue"),
        name: "orders",
        meta: {
          permissions: ["order:read"]
        }
      },
      {
        path: "demand",
        component: () => import("@/forecasts-review/ForecastsReviewPage.vue"),
        name: "forecastsReview",
        meta: {
          permissions: ["demand:read"]
        },
        alias: ["planning"]
      }
    ]
  },
  {
    path: "*",
    name: "notFound",
    component: () => import("@/components/pages/NotFound.vue")
  }
];
