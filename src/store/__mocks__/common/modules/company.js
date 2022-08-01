import { Company } from "@/objects/company";

const state = {
  company: null,
  companies: {}
};

const getters = {
  getCompany: jest.fn().mockReturnValue(
    Company.create({
      id: 1,
      name: "Flowlity",
      email: "@flowlity.com",
      users: [{ id: "1" }],
      admins: ["1"],
      sites: [1]
    })
  ),
  getCompanies: jest.fn().mockReturnValue({
    1: Company.create({
      id: 1,
      name: "Flowlity",
      email: "@flowlity.com",
      users: [{ id: "1" }],
      admins: ["1"],
      sites: [1]
    }),
    2: Company.create({
      id: 2,
      name: "Test",
      email: "@test.com",
      users: [{ id: "2" }],
      admins: ["2"],
      sites: [2]
    })
  })
};

const mutations = {
  initCompany: jest.fn(),
  updateCompany: jest.fn(),
  addCompany: jest.fn(),
  deleteCompany: jest.fn()
};

const actions = {
  initCompany: jest.fn(),
  addCompany: jest.fn(),
  updateCompany: jest.fn(),
  deleteCompany: jest.fn(),
  fetchCompanies: jest.fn()
};

export default {
  state,
  getters,
  mutations,
  actions
};
