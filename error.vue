<script setup>
const { statusCode, statusMessage, message } = useError().value;
</script>

<template>
  <div class="container vh-100 d-flex justify-content-center align-items-center">
    <div>
      <h1>Error <span class="text-primary">{{ statusCode }}</span></h1>
      <h5>Sorry, an error has occured. {{ statusMessage || message }}</h5>
      <p>Go back: <NuxtLink to="/" class="text-decoration-underline">mappedlove.com</NuxtLink></p>
    </div>
  </div>
</template>
