<template>
  <div class="d-flex justify-content-center align-items-center">
    <div class="spinner-border" :class="{'spinner-border-sm': small}" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script>
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
</style>
