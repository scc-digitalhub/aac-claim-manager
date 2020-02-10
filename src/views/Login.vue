<template>
  <div class="login primary lighten-1 fill-height">
    <div>
        <v-container class="fill-height" fluid >
        <v-row align="center" justify="center" >
          <v-col cols="12" sm="8" md="4" >
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat >
                <v-toolbar-title>Restricted Area</v-toolbar-title>
                </v-toolbar>
              <v-card-text>
                <h1 align="center">AAC User Claim Manager</h1>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="signin()">Sign In</v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>

import auth from '../auth'

export default {
  name: 'login',
  data: () => ({
  }),
  methods: {
    signin() {
      auth.signin();
    }
  }
}
</script>
