<template>
  <div class="d-flex justify-content-center align-items-center">
    <div class="spinner-border" :class="{'spinner-border-sm': small}" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    small: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style>
.spinner-border {
  width: 1.875rem;
  height: 1.875rem;
}
.spinner-border-sm {
  width: 1em;
  height: 1em;
}
</style>
