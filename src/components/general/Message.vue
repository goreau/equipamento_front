<!-- eslint-disable vue/require-prop-type-constructor -->
<template>
    <article class="message" :class="style">
    <div class="message-header">
      <p>{{ caption }}</p>
      <button class="delete" @click="$emit('doClose')" aria-label="delete"></button>
    </div>
    <div class="message-body">
      <p v-html="formattedMessage"></p>
    </div>
  </article>
  </template>
  
  <script>
  export default {
      name: 'MessageView',
      props: {
          msg: '',
          caption: '',
          type: ''
      },
      emits: ['doClose'],
      data() {
          return {
              style: ''
          }
      },
      methods: {
  
      },
      mounted() {
          this.style = this.type == 'alert' ? 'is-danger' : (this.type == 'success' ? 'is-success' : (this.type == 'warning' ? 'is-warning' : 'is-info'));
      },
      computed: {
            formattedMessage() {
              return this.msg;
            }
      }
  }
  </script>
  
  <style>
  
  </style>