<template>
  <div>
  <div class="home">
    <v-row>
      <v-col md="8" offset-md="2">
        <v-row v-if="!!service">
          <v-col md="12">
            <h1>{{service.name}}</h1>
            <p>{{service.description}}</p>
            <hr/>
          </v-col>  
        </v-row>
        <v-row>
          <v-col md="8">
            <h3 v-if="!users || users.content.length == 0">No users found. Add a new one</h3>
          </v-col>
          <v-col md="4" class="text-right">
            <v-btn color="primary" @click="newUser()">Add User</v-btn>
          </v-col>
        </v-row>  
        <v-data-table  v-if="!!users"
            :headers="headers"
            :items="users.content"
            sort-by="username"
            :server-items-length="users.totalElements"
            :options.sync="options"
            :loading="loading"
            class="elevation-1"
          >
          <template v-slot:item.action="{ item }">
            <v-icon color="primary" class="mr-2" @click="edit(item)"> mdi-pencil </v-icon>
            <v-icon color="error" @click="remove(item)" > mdi-trash-can </v-icon>
          </template>
          <template v-slot:no-data>
            <h3>No users defined</h3>
          </template>
        </v-data-table>

      </v-col>  
    </v-row>
  </div>
  </div>
</template>

<script>
import data from '../data'

export default {
  name: 'users',
  data() {
    return {
      service: null,
      users: null,
      loading: false,
      options: {},
      headers: [
        { text: 'Username', align: 'left', sortable: true, value: 'username'},
        { text: 'Actions', align: 'right', value: 'action', sortable: false },
      ],
    }
  },
  watch: {
      options: {
        handler () {
          this.loadUsers();
        },
        deep: true,
      },
    },
  created() {
    this.load();
  },
  methods: {
    load() {
      let serviceId = this.$route.params.serviceId;
      data.getService(serviceId).then(svc => {
        this.service = svc;
      this.loadUsers();
      });
    },
    loadUsers() {
      this.loading = true;
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;
      data.getUsers(this.service.serviceId, sortBy ? sortBy[0] : 'username', sortDesc ? sortDesc[0] : 'asc', page, itemsPerPage)
        .then(data => {
          this.users = data;
          this.loading = false;
        });

    },
    newUser() {
      this.$router.push(`/user/${this.service.serviceId}/new`);
    },
    edit(u) {
      this.$router.push(`/user/${this.service.serviceId}/${u.username}`);
    },
    remove(u) {
      if (confirm('Are you sure you want to delete this user?')) {
        data.deleteUser(this.service.serviceId, u.username).then(() => {
          this.loadUsers();
        });
      } 
    }
  }
}
</script>


<style scoped> 

</style>


