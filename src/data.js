import Axios from 'axios'
import auth from './auth'

let endpoint = process.env.VUE_APP_AAC_ENDPOINT;

export default {
    async getServices() {
      const token = await auth.getToken();
      const conf = {headers: { Authorization: `Bearer ${token}` }};
      const res = await Axios.get(`${endpoint}/api/services/me`, conf);
      return res.data;
    },
    async getService(serviceId) {
      const token = await auth.getToken();
      const conf = {headers: { Authorization: `Bearer ${token}` }};
      const res = await Axios.get(`${endpoint}/api/services/${serviceId}`, conf);
      return res.data;
    },
    async getUsers(serviceId, sortBy = 'username', sortDesc = false, page = 0, itemsPerPage = 10) {
      const token = await auth.getToken();
      const conf = {headers: { Authorization: `Bearer ${token}` }};
      const res = await Axios.get(`${endpoint}/api/claims/${serviceId}?page=${page-1}&size=${itemsPerPage}&sort=${sortBy},${sortDesc ? 'desc': 'asc'}`, conf);
      return res.data;
    },
    async getUser(serviceId, user) {
      const token = await auth.getToken();
      const conf = {headers: { Authorization: `Bearer ${token}` }};
      const res = await Axios.get(`${endpoint}/api/claims/${serviceId}/username?username=${user}`, conf);
      return res.data;
    },
    async saveUser(serviceId, obj) {
      const token = await auth.getToken();
      const conf = {headers: { Authorization: `Bearer ${token}` }};
      const res = await Axios.post(`${endpoint}/api/claims/${serviceId}/username?username=${obj.username}`, obj, conf);
      return res.data;
    },
    async deleteUser(serviceId, user) {
      const token = await auth.getToken();
      const conf = {headers: { Authorization: `Bearer ${token}` }};
      const res = await Axios.delete(`${endpoint}/api/claims/${serviceId}/username?username=${user}`, conf);
      return res.data;
    }
   }