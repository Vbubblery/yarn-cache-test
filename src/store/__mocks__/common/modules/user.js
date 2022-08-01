import { User } from "@/objects/user";
import fr_FR from "ant-design-vue/lib/locale-provider/fr_FR";

const state = {
  me: User.create({
    id: "1",
    email: "foobar@flowlity.com",
    name: "Foo Bar",
    tel_office: "0123456789",
    title: "Test user",
    company: 1,
    sites: [1],
    admin: true,
    superAdmin: false,
    demoUser: true,
    permissions: [],
    locale: "fr"
  }),
  users: {
    1: User.create({
      id: "1",
      email: "foobar@flowlity.com",
      name: "Foo Bar",
      tel_office: "0123456789",
      title: "Test user",
      company: 1,
      sites: [1],
      admin: true,
      superAdmin: false,
      demoUser: true,
      permissions: []
    }),
    2: User.create({
      id: "2",
      email: "foobar2@flowlity.com",
      name: "Foo Bar 2",
      tel_office: "0123456789",
      title: "Test user 2",
      company: 2,
      sites: [2],
      admin: true,
      superAdmin: false,
      demoUser: true,
      permissions: []
    })
  },
  usersByCompany: {
    1: {
      1: User.create({
        id: "1",
        email: "foobar@flowlity.com",
        name: "Foo Bar",
        tel_office: "0123456789",
        title: "Test user",
        company: 1,
        sites: [1],
        admin: true,
        superAdmin: false,
        demoUser: true,
        permissions: []
      })
    },
    2: {
      2: User.create({
        id: "2",
        email: "foobar2@flowlity.com",
        name: "Foo Bar 2",
        tel_office: "0123456789",
        title: "Test user 2",
        company: 2,
        sites: [2],
        admin: true,
        superAdmin: false,
        demoUser: true,
        permissions: []
      })
    }
  },
  usersBySite: {
    1: {
      1: User.create({
        id: "1",
        email: "foobar@flowlity.com",
        name: "Foo Bar",
        tel_office: "0123456789",
        title: "Test user",
        company: 1,
        sites: [1],
        admin: true,
        superAdmin: false,
        demoUser: true,
        permissions: []
      })
    },
    2: {
      2: User.create({
        id: "2",
        email: "foobar2@flowlity.com",
        name: "Foo Bar 2",
        tel_office: "0123456789",
        title: "Test user 2",
        company: 2,
        sites: [2],
        admin: true,
        superAdmin: false,
        demoUser: true,
        permissions: []
      })
    }
  },
  access_token: null,
  antLocale: fr_FR
};

const getters = {
  getMe: jest.fn(() => state.me),
  getUser: () => jest.fn(id => state.users[id]),
  getUsers: jest.fn().mockReturnValue(state.users),
  getUsersByCompany: () => jest.fn(company => state.usersByCompany[company]),
  getUsersBySite: () => jest.fn(site => state.usersBySite[site]),
  getAccessToken: jest.fn().mockReturnValue("foobar")
};

const mutations = {
  initMe: jest.fn(),
  addUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUserFromSite: jest.fn(),
  deleteUser: jest.fn(),
  updateAccessToken: jest.fn(),
  updateAntLocale: jest.fn()
};

const actions = {
  initMe: jest.fn(),
  updateUser: jest.fn(),
  fetchUsers: jest.fn().mockResolvedValue(Object.values(state.users)),
  deleteUser: jest.fn(),
  updateAccessToken: jest.fn(),
  updateUserLocale: jest.fn(),
  updateUserLocaleInBack: jest.fn(),
  updateUserLocaleInApp: jest.fn()
};

export default {
  state,
  getters,
  mutations,
  actions
};
