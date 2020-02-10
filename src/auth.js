import Oidc from 'oidc-client';

var endpoint = window.location.href.substring(0, window.location.href.indexOf('/', 8));

var mgr = new Oidc.UserManager({
  userStore: new Oidc.WebStorageStateStore(),  
  authority: process.env.VUE_APP_AAC_ENDPOINT + '/.well-known/openid-configuration',
  client_id: process.env.VUE_APP_AAC_CLIENT,
  redirect_uri: endpoint + '/callback',
  response_type: 'id_token token',
  scope: 'openid profile servicemanagement.me claimmanagement.me',
  post_logout_redirect_uri: endpoint + '/logout',
  loadUserInfo: true
})

export default {
    signin() {
      mgr.signinRedirect().catch((err) => {
        console.log(err);
      })
    },

    callback() {
      return mgr.signinRedirectCallback();
    },

    getToken () {
      return new Promise((resolve, reject) => {
        return mgr.getUser().then((user) => {
          if (!!user && !user.expired) {
            resolve(user.access_token);
          } else {
            reject('Expired');
          }
        }).catch((err) => {
          reject(err);
        });
      });  
    },
  
    signout () {
      return mgr.signoutRedirect();
    },
  
    getUser() {
      return mgr.getUser();
    },

    loggedIn () {
      return new Promise((resolve) => {
        return mgr.getUser().then((user) => {
          if (!!user && !user.expired) {
            resolve(true);
          } else {
            resolve(false);
          }
        }).finally(() => {
          resolve(false);
        });
      });      
    },
  
  }