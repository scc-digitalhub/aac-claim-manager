<template>
  <div class="home">
    <v-row>
      <v-col md="8" offset-md="2">
        <v-form ref="form" v-model="valid">
        <v-row v-if="!!user">
          <v-col md="8">
            <h1>{{!isNew ? user.username : 'New User'}}</h1>
          </v-col>  
          <v-col md="4" class="text-right">
            <v-btn color="primary" text @click="back()">Close</v-btn>
            <v-btn color="primary" raised @click="save()"  :disabled="!valid">Save</v-btn>
          </v-col>
        </v-row>
        <hr/>
        <br>
        <div v-if="!!service && !!user">
        <v-text-field type="email" :rules="emailRules" required v-model="user.username" label="Username (email)" v-if="isNew"></v-text-field>
  
        <h3>Claims</h3>
        <v-row v-for="c in service.claims" :key="c.claim">
          <v-col md="12" v-if="!c.multiple">
            <v-card outlined class="pa-3">
              <v-card-title>{{c.name}}</v-card-title>
              <v-row>
                <v-col md="12">
                  <v-text-field :type="c.type=='number'?'number':'text'" :hint="c.type == 'number' ? 'Number value' : 'Text value'" v-model="c.value" :label="c.name" v-if="c.type != 'object' && c.type != 'boolean'"></v-text-field>
                  <v-textarea hint="JSON-formatted data" outlined v-model="c.value" :label="c.name" v-if="c.type == 'object'"></v-textarea>
                  <v-switch v-model="c.value" :label="c.name" v-if="c.type=='boolean'"></v-switch>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col md="12" v-if="c.multiple">
            <v-card outlined class="pa-3">
              <v-card-title>{{c.name}}</v-card-title>
            <v-row>
              <v-col md="10">
              <v-text-field  :type="c.type=='number'?'number':'text'" :hint="c.type == 'number' ? 'Number value' : 'Text value'"  v-model="c.currValue" :label="c.name" v-if="c.type != 'object' && c.type != 'boolean'"></v-text-field>
              <v-textarea hint="JSON-formatted data" outlined v-model="c.currValue" v-if="c.type == 'object'"></v-textarea>
              <v-switch v-model="c.value" :label="c.name" v-if="c.type=='boolean'"></v-switch>
              </v-col>
              <v-col md="2" class="text-right">
                <v-btn class="mx-2" fab dark small color="primary" @click="addArrayValue(c)"><v-icon dark>mdi-plus</v-icon></v-btn>
              </v-col>
            </v-row>  
            <v-row v-for="(val, index) in c.value" :key="index">
              <v-col md="10">{{val}}</v-col>
              <v-col md="2" class="text-right">
                <v-btn class="mx-2" fab dark small color="error" @click="deleteArrayValue(c, val)"><v-icon dark>mdi-minus</v-icon></v-btn>
              </v-col>
            </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="!!user">
          <v-col md="12" class="text-right">
            <v-btn color="primary" text @click="back()">Close</v-btn>
            <v-btn color="primary" raised @click="save()"  :disabled="!valid">Save</v-btn>
          </v-col>
        </v-row>
        </div>
        </v-form>
      </v-col>  
    </v-row>

    <v-snackbar v-model="errorSnack" color="error" :timeout="5000">
      {{ errorMessage }}
      <v-btn dark text @click="errorSnack = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import data from '../data'

export default {
  name: 'user',
  data() {
    return {
      service: null,
      user: null,
      isNew: false,
      valid: true,
      emailRules: [
        v => !!v && /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v.toLowerCase()) || 'Invalid or empty email'
      ],
      errorSnack: false,
      errorMessage: null
    }
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      let serviceId = this.$route.params.serviceId;
      let user = this.$route.params.user;
      data.getService(serviceId).then(svc => {
        this.service = svc;
        if (user) {
          data.getUser(serviceId, user).then(res => {
            this.user = res;
            if (!!svc.claims && this.user.claims) {
              svc.claims.forEach(c => {
                let v = this.user.claims[svc.namespace + '/' + c.claim];
                if (c.type == 'object') c.value = JSON.stringify(v);
                else c.value = v;
              });
            }
          });
        } else {
          this.user = {};
          this.isNew = true;
        }
      });
    },
    back() {
      window.history.back();
    },
    addArrayValue(c) {
      if (!c.currValue || !c.currValue.trim()) return ;

      if (!c.value) c.value = [];
      c.value.push(c.currValue);
      c.currValue = null;
    },
    deleteArrayValue(c, val) {
      let newc = Object.assign({}, c);
      newc.value.splice(c.value.indexOf(v => v == val), 1);
      let cIndex = this.service.claims.findIndex(claim => claim.claim == c.claim);
      this.$set(this.service.claims, cIndex, newc);
    },
    save() {
      if (this.user && this.user.username) {
        const obj = {
          username: this.user.username,
          claims: {}
        }
        this.service.claims.forEach(c => {
          const v = 
          !c.value
          ? null
          : c.multipe || c.type == 'string' || c.type == 'boolean'
          ? c.value
          : c.type == 'number'
          ? parseInt(c.value)
          : JSON.parse(c.value);
          obj.claims[this.service.namespace + '/' + c.claim] = v;
        });
        data.saveUser(this.service.serviceId, obj).then(() => {
          this.back();
        }).catch(err => {
          this.errorMessage = err.response.data.errorMessage;
          this.errorSnack = true;
        });
      }
    }
  }
}
</script>


<style scoped> 

</style>


