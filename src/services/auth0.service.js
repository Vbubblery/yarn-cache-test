import auth0 from "auth0-js";
import Vue from "vue";

const clientID = "cAhc7uGS1Kz3O20b50LBUc66kY4jtFsg";
const domain = "auth.flowlity.com";

const webAuth = new auth0.WebAuth({
  domain,
  clientID,
  redirectUri: `${window.location.origin}/callback`,
  audience: "https://flowlity.com",
  responseType: "token id_token",
  scope: "openid email profile"
});

export const auth = new Vue({
  computed: {
    token: {
      get() {
        return localStorage.getItem("id_token");
      },
      set(id_token) {
        localStorage.setItem("id_token", id_token);
      }
    },
    accessToken: {
      get() {
        return localStorage.getItem("access_token");
      },
      set(accessToken) {
        localStorage.setItem("access_token", accessToken);
      }
    },
    expiresAt: {
      get() {
        return localStorage.getItem("expires_at");
      },
      set(expiresIn) {
        let expiresAt = JSON.stringify(expiresIn * 1000 + new Date().getTime());
        localStorage.setItem("expires_at", expiresAt);
      }
    },
    user: {
      get() {
        return JSON.parse(localStorage.getItem("user"));
      },
      set(user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    }
  },
  methods: {
    parseJwt(token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload);
    },
    login() {
      webAuth.authorize();
    },
    logout() {
      // eslint-disable-next-line no-unused-vars
      return new Promise(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("user");
        webAuth.logout({
          returnTo: "https://flowlity.com",
          clientID
        });
      });
    },
    isAuthenticated() {
      return new Date().getTime() < this.expiresAt;
    },
    handleAuthentication() {
      return new Promise((resolve, reject) => {
        webAuth.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.expiresAt = authResult.expiresIn;
            this.accessToken = authResult.accessToken;
            this.token = authResult.idToken;
            this.user = authResult.idTokenPayload;
            resolve();
          } else if (err) {
            this.logout();
            reject(err);
          }
        });
      });
    }
  }
});

export default {
  install: function (Vue) {
    Vue.prototype.$auth = auth;
  }
};
