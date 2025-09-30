<script setup lang="ts">
const props = defineProps<{
  text: string;
  placeholder?: string;
  lg?: boolean;
  uppercase?: boolean;
  floating?: boolean;
  bold?: boolean;
}>();

const { $toasts } = useNuxtApp();
const textToCopy = useTemplateRef("textToCopy");

const copyText = async () => {
  const copy = await copyToClipboard(props.text);
  if (copy.success) textToCopy.value?.select();
  $toasts.add(copy);
};
</script>

<template>
  <div v-if="floating" class="input-group">
    <div class="form-floating">
      <input ref="textToCopy" :value="text" type="text" class="form-control" :class="{ 'form-control-lg': lg, 'fw-bold': bold, 'text-uppercase': uppercase }" :placeholder="placeholder" readonly>
      <label>{{ placeholder }}</label>
    </div>
    <slot />
    <button class="btn btn-primary px-4" :class="{ 'btn-lg': lg }" type="button" :title="t('copy_link')" @click="copyText">
      <Icon name="solar:clipboard-text-bold" size="1.5rem" />
    </button>
  </div>
  <div v-else class="input-group">
    <input ref="textToCopy" :value="text" type="text" class="form-control" :class="{ 'form-control-lg': lg, 'fw-bold': bold, 'text-uppercase': uppercase }" :placeholder="placeholder" readonly>
    <slot />
    <button class="btn btn-primary px-4" :class="{ 'btn-lg': lg }" type="button" :title="t('copy_link')" @click="copyText">
      <Icon name="solar:clipboard-text-bold" size="1.5rem" />
    </button>
  </div>
</template>
