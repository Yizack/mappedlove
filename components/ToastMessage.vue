<template>
  <div class="toast-container position-fixed bottom-0 start-0 p-3">
    <div id="toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">{{ name }}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close" />
      </div>
      <div class="toast-body">
        <div class="d-flex align-items-center gap-2">
          <Icon v-if="success" name="solar:check-circle-bold" size="1.5em" class="text-success" />
          <Icon v-else name="solar:close-circle-bold" size="1.5em" class="text-danger" />
          <span>{{ text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    text: {
      type: String,
      default: ""
    },
    success: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.$nuxt.$bootstrap.showToast("#toast");
  }
};
</script>
