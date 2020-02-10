<template>
  <div class="callback">
  </div>
</template>

<script>

import auth from '../auth'

export default {
  name: 'login',
  data: () => ({
  }),
  created() {
    auth.callback().then(() => {
      window.location.href = '../';
    }).catch(() => {
      window.location.href = '../error';
    });    
  }
}
</script>
