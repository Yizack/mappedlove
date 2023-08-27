<template>
  <div class="input-group">
    <input ref="text" :value="text" type="text" class="form-control" :class="{ 'form-control-lg': lg, 'fw-bold': bold, 'text-uppercase': uppercase }" :placeholder="placeholder" readonly>
    <button class="btn btn-primary px-4" :class="{'btn-lg': lg}" type="button" @click="copyText"><Icon name="solar:clipboard-text-bold" size="1.5rem" /></button>
  </div>
  <ToastMessage v-if="copy.toast" :success="copy.success" :text="copy.message" @dispose="copy.toast = false" />
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
  data () {
    return {
      copy: {
        toast: false,
        success: false,
        message: ""
      }
    };
  },
  methods: {
    async copyText () {
      const copy = await copyToClipboard(this.text);
      this.copy = { ...copy, toast: true };
      if (this.copy.success) (this.$refs.text as HTMLInputElement).select();
    }
  }
};
</script>
