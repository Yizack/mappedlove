<template>
  <div class="input-group">
    <input ref="text" :value="text" type="text" class="form-control" :class="{ 'form-control-lg': lg, 'fw-bold': bold, 'text-uppercase': uppercase }" :placeholder="placeholder" readonly>
    <button class="btn btn-primary px-4" :class="{'btn-lg': lg}" type="button" @click="copyText"><Icon name="solar:clipboard-text-bold" size="1.5rem" /></button>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ""
    },
    lg: {
      type: Boolean,
      default: false
    },
    uppercase: {
      type: Boolean,
      default: false
    },
    bold: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async copyText () {
      const copy = await copyToClipboard(this.text);
      if (copy.success) (this.$refs.text as HTMLInputElement).select();
      this.$nuxt.$toasts.add(copy);
    }
  }
};
</script>
