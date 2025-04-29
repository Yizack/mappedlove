<script setup lang="ts">
const props = defineProps<{
  password: string;
}>();

const model = defineModel<boolean>({ required: true });

const requirements = computed(() => getPasswordRequirements(props.password));
const isValid = computed(() => isValidPassword(props.password, requirements.value));

watch(() => props.password, () => {
  model.value = isValid.value;
});
</script>

<template>
  <div class="position-absolute z-3 shadow mt-2 bg-body-tertiary rounded border p-4 small">
    <h4 class="fs-6 fw-medium mb-2">{{ t("pass_req") }}:</h4>
    <div class="d-flex align-items-center gap-2" :class="requirements.hasLength ? 'text-success' : 'text-muted'">
      <Icon :name="requirements.hasLength ? 'tabler:check' : 'tabler:x'" />
      <span>{{ t("pass_req_characters") }}</span>
    </div>
    <div class="d-flex align-items-center gap-2" :class="requirements.hasUppercase ? 'text-success' : 'text-muted'">
      <Icon :name="requirements.hasUppercase ? 'tabler:check' : 'tabler:x'" />
      <span>{{ t("pass_req_uppercase") }} (A-Z)</span>
    </div>
    <div class="d-flex align-items-center gap-2" :class="requirements.hasLowercase ? 'text-success' : 'text-muted'">
      <Icon :name="requirements.hasLowercase ? 'tabler:check' : 'tabler:x'" />
      <span>{{ t("pass_req_lowercase") }} (a-z)</span>
    </div>
    <div class="d-flex align-items-center gap-2" :class="requirements.hasNumber ? 'text-success' : 'text-muted'">
      <Icon :name="requirements.hasNumber ? 'tabler:check' : 'tabler:x'" />
      <span>{{ t("pass_req_number") }} (0-9)</span>
    </div>
    <div class="d-flex align-items-center gap-2" :class="requirements.hasSpecial ? 'text-success' : 'text-muted'">
      <Icon :name="requirements.hasSpecial ? 'tabler:check' : 'tabler:x'" />
      <span>{{ t("pass_req_special") }} (!@#$%^&*(),.?'":{}|&lt;&gt;)</span>
    </div>
  </div>
</template>
