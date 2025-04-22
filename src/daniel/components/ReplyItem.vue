<template>
    <div>
      <p>{{ reply.content }}</p>
      <small>由 User {{ reply.userId }} 發佈於 {{ reply.createdAt }}</small>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({ reply: Object });
  </script>
  