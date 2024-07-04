<script setup lang="ts">
const props = defineProps({
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
  floating: {
    type: Boolean,
    default: false
  },
  bold: {
    type: Boolean,
    default: false
  }
});

const { $toasts } = useNuxtApp();
const textToCopy = ref() as Ref<HTMLInputElement>;

const copyText = async () => {
  const copy = await copyToClipboard(props.text);
  if (copy.success) textToCopy.value.select();
  $toasts.add(copy);
};
</script>

<template>
  <div v-if="floating" class="input-group">
    <div class="form-floating">
      <input ref="textToCopy" :value="text" type="text" class="form-control" :class="{ 'form-control-lg': lg, 'fw-bold': bold, 'text-uppercase': uppercase }" :placeholder="placeholder" readonly>
      <label>{{ placeholder }}</label>
    </div>
    <button class="btn btn-primary px-4" :class="{ 'btn-lg': lg }" type="button" @click="copyText">
      <Icon name="solar:clipboard-text-bold" size="1.5rem" />
    </button>
  </div>
  <div v-else class="input-group">
    <input ref="textToCopy" :value="text" type="text" class="form-control" :class="{ 'form-control-lg': lg, 'fw-bold': bold, 'text-uppercase': uppercase }" :placeholder="placeholder" readonly>
    <button class="btn btn-primary px-4" :class="{ 'btn-lg': lg }" type="button" @click="copyText">
      <Icon name="solar:clipboard-text-bold" size="1.5rem" />
    </button>
  </div>
</template>
