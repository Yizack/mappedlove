<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });
const { data: bond } = await useFetch("/api/bond");

const bondEvent = ref("");
const setBond = async (event: any) => {
  bond.value = event.bond;
  bondEvent.value = event.type;
  navigateTo("/app", { external: true, replace: true });
};

const isBonded = computed((): Boolean => {
  return Boolean(bond.value && bond.value.partner1 && bond.value.partner2);
});

const partner1 = computed((): MappedLovePartner => {
  if (!(bond.value && bond.value.partner1)) return {} as MappedLovePartner;
  return bond.value.partner1 as MappedLovePartner;
});

const partner2 = computed((): MappedLovePartner => {
  if (!(bond.value && bond.value.partner2)) return {} as MappedLovePartner;
  return bond.value.partner2 as MappedLovePartner;
});
</script>

<template>
  <main :class="{'h-100': isBonded }">
    <Transition name="tab" mode="out-in">
      <BondStart v-if="!bond" @bond="setBond" />
      <BondPending v-else-if="bond && !bond.partner2" :code="bond.code" @bond="setBond" />
    </Transition>
    <ToastMessage v-if="bond && bondEvent === 'created'" :name="SITE.name" :text="t('bond_code_created')" success />
    <ToastMessage v-if="bond && bondEvent === 'joined'" :name="SITE.name" :text="t('bond_joined')" success />
    <div v-if="isBonded" class="bg-body rounded-3 px-3 py-4 p-lg-4">
      <h1 class="text-center">{{ t("our_bond") }}</h1>
      <div class="position-relative d-flex justify-content-center py-4">
        <div class="text-center position-relative">
          <img src="https://picsum.photos/seed/1/175" width="175" height="175" class="img-fluid rounded-circle m-0 mx-md-3 mx-lg-4" alt="Responsive image">
          <h4 class="text-center m-0 w-100 position-absolute top-100 px-0 px-lg-2 fst-italic"><strong>{{ partner1.name }}</strong></h4>
        </div>
        <div class="position-absolute top-50 start-50 translate-middle z-1 display-1 d-flex">
          <Icon name="solar:hearts-bold-duotone" class="img-fluid bg-white rounded-circle p-2 p-lg-3 text-primary" />
        </div>
        <div class="text-center position-relative">
          <img src="https://picsum.photos/seed/2/175" width="175" height="175" class="img-fluid rounded-circle m-0 mx-md-3 mx-lg-4" alt="Responsive image">
          <h4 class="text-center m-0 w-100 position-absolute top-100 px-0 px-lg-2 fst-italic"><strong>{{ partner2.name }}</strong></h4>
        </div>
      </div>
      <div class="mt-5 text-center">
        <h2>{{ t("love_date") }}</h2>
      </div>
    </div>
  </main>
</template>
