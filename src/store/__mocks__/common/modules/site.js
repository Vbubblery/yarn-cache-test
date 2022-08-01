import { Site } from "@/objects/site";
import Vue from "vue";

const accuracy = {
  "m-6": {
    "Aug 2020": 31,
    "Sep 2020": 27,
    "Oct 2020": 71,
    "Nov 2020": 18,
    "Dec 2020": 16,
    "Jan 2021": 89
  },
  "m-3": {
    "Aug 2020": 31,
    "Sep 2020": 28,
    "Oct 2020": 48,
    "Nov 2020": 25,
    "Dec 2020": 17,
    "Jan 2021": 146
  },
  "m-1": {
    "Aug 2020": 8,
    "Sep 2020": 10,
    "Oct 2020": 41,
    "Nov 2020": 19,
    "Dec 2020": 1,
    "Jan 2021": 75
  }
};
const stockouts = {
  "Aug 2020": 31,
  "Sep 2020": 27,
  "Oct 2020": 71,
  "Nov 2020": 18,
  "Dec 2020": 16,
  "Jan 2021": 89
};

const state = {
  currentSite: Site.create({
    id: 1,
    name: "FlowlitySite",
    address: "42, rue du Test",
    currency: "eur",
    company: 1,
    users: [{ id: "1" }],
    storage_sites: [{ id: "1", name: "storageTest" }],
    demand_distribution_week: [1, 0, 0, 0, 0, 0, 0],
    customer_sites: [],
    has_same_default_unit: "kg",
    current_year_monthly_stock_coverage: {
      "Aug 2020": 1,
      "Sep 2020": 2,
      "Oct 2020": 3,
      "Nov 2020": 4,
      "Dec 2020": 5,
      "Jan 2021": 6,
      "Feb 2021": 7,
      "Mar 2021": 8,
      "Apr 2021": 9,
      "May 2021": 10,
      "Jun 2021": 11,
      "Jul 2021": 12
    },
    current_year_total_values: {
      "Aug 2020": 1,
      "Sep 2020": 2,
      "Oct 2020": 3,
      "Nov 2020": 4,
      "Dec 2020": 5,
      "Jan 2021": 6,
      "Feb 2021": 7,
      "Mar 2021": 8,
      "Apr 2021": 9,
      "May 2021": 10,
      "Jun 2021": 11,
      "Jul 2021": 12
    },
    current_year_monthly_stock: {
      "Aug 2020": 1,
      "Sep 2020": 2,
      "Oct 2020": 3,
      "Nov 2020": 4,
      "Dec 2020": 5,
      "Jan 2021": 6,
      "Feb 2021": 7,
      "Mar 2021": 8,
      "Apr 2021": 9,
      "May 2021": 10,
      "Jun 2021": 11,
      "Jul 2021": 12
    },
    current_year_demand: {
      "Aug 2020": 1,
      "Sep 2020": 2,
      "Oct 2020": 3,
      "Nov 2020": 4,
      "Dec 2020": 5,
      "Jan 2021": 6,
      "Feb 2021": 7,
      "Mar 2021": 8,
      "Apr 2021": 9,
      "May 2021": 10,
      "Jun 2021": 11,
      "Jul 2021": 12
    },
    isSupplierView: false,
    show_future_dashboard: true,
    agg_site_accuracy: accuracy,
    w_avg_site_accuracy: accuracy,
    avg_site_accuracy: accuracy,
    avg_site_stockout: stockouts,
    planning_horizon_months: 12,
    demand_horizon_months: 12
  }),
  sites: {
    1: Site.create({
      id: 1,
      name: "FlowlitySite",
      address: "42, rue du Test",
      currency: "eur",
      company: 1,
      users: [{ id: "1" }],
      storage_sites: [{ id: "1", name: "storageTest" }],
      demand_distribution_week: [1, 0, 0, 0, 0, 0, 0],
      customer_sites: [],
      planning_horizon_months: 12,
      demand_horizon_months: 12
    }),
    2: Site.create({
      id: 2,
      name: "TestSite",
      address: "42, rue du FooBar",
      currency: "eur",
      company: 2,
      users: [{ id: "2" }],
      storage_sites: [{ id: "1", name: "storageTest" }],
      demand_distribution_week: [1, 0, 0, 0, 0, 0, 0],
      customer_sites: [],
      planning_horizon_months: 12,
      demand_horizon_months: 12
    })
  },
  sitesByCompany: {
    1: {
      1: Site.create({
        id: 1,
        name: "FlowlitySite",
        address: "42, rue du Test",
        currency: "eur",
        company: 1,
        users: [{ id: "1" }],
        storage_sites: [{ id: "1", name: "storageTest" }],
        demand_distribution_week: [1, 0, 0, 0, 0, 0, 0],
        customer_sites: [],
        planning_horizon_months: 12,
        demand_horizon_months: 12
      })
    },
    2: {
      2: Site.create({
        id: 2,
        name: "TestSite",
        address: "42, rue du FooBar",
        currency: "eur",
        company: 2,
        users: [{ id: "2" }],
        storage_sites: [{ id: "1", name: "storageTest" }],
        demand_distribution_week: [1, 0, 0, 0, 0, 0, 0],
        customer_sites: [],
        planning_horizon_months: 12,
        demand_horizon_months: 12
      })
    }
  }
};

const getters = {
  getCurrentSite: state => {
    return state.currentSite;
  },
  getSite: () =>
    jest.fn(id => {
      return state.sites[id];
    }),
  getSites: jest.fn().mockReturnValue({
    1: Site.create({
      id: 1,
      name: "FlowlitySite",
      address: "42, rue du Test",
      currency: "eur",
      company: 1,
      users: [{ id: "1" }],
      storage_sites: [{ id: "1", name: "storageTest" }],
      demand_distribution_week: [1, 0, 0, 0, 0, 0, 0],
      customer_sites: [],
      planning_horizon_months: 12,
      demand_horizon_months: 12
    }),
    2: Site.create({
      id: 2,
      name: "TestSite",
      address: "42, rue du FooBar",
      currency: "eur",
      company: 2,
      users: [{ id: "2" }],
      storage_sites: [{ id: "1", name: "storageTest" }],
      demand_distribution_week: [1, 0, 0, 0, 0, 0, 0],
      customer_sites: [],
      planning_horizon_months: 12,
      demand_horizon_months: 12
    })
  }),
  getSitesByCompany: () => jest.fn(company => state.sitesByCompany[company])
};

const mutations = {
  initCurrentSite: (state, site) => {
    Vue.set(state, "currentSite", site);
  },
  addSite: jest.fn(),
  updateSite: jest.fn(),
  deleteSite: jest.fn(),
  resetSites: jest.fn()
};

const actions = {
  initCurrentSite: jest.fn(),
  fetchSite: jest.fn(),
  updateSite: jest.fn(),
  deleteSite: jest.fn(),
  fetchAllSites: jest.fn(),
  resetSites: jest.fn(),
  fetchCompanySites: jest.fn()
};

export default {
  state,
  getters,
  mutations,
  actions
};
