<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
</script>

<template>
  <div class="row">
    <div class="col-lg-8 col-xl-6 mx-auto">
      <div class="bg-body rounded-3 px-3 py-4 p-lg-4">
        <h1 class="text-center">{{ t("our_bond") }}</h1>
        <div class="position-relative d-flex justify-content-center py-4">
          <div class="text-center position-relative">
            <img :src="`https://picsum.photos/seed/${Date.now()}/175`" width="175" height="175" class="img-fluid rounded-circle m-0 mx-md-3 mx-lg-4" alt="Responsive image">
            <h4 class="text-center m-0 w-100 position-absolute top-100 px-0 px-lg-2 fst-italic fw-bold">{{ partner1.name }}</h4>
          </div>
          <div class="position-absolute top-50 start-50 translate-middle z-1 display-1 d-flex">
            <Icon name="solar:hearts-bold-duotone" class="img-fluid bg-white rounded-circle p-2 p-lg-3 text-primary" />
          </div>
          <div class="text-center position-relative">
            <img :src="`https://picsum.photos/seed/${Date.now() + 1}/175`" width="175" height="175" class="img-fluid rounded-circle m-0 mx-md-3 mx-lg-4" alt="Responsive image">
            <h4 class="text-center m-0 w-100 position-absolute top-100 px-0 px-lg-2 fst-italic fw-bold">{{ partner2.name }}</h4>
          </div>
        </div>
        <div class="mt-5">
          <Transition name="tab" mode="out-in">
            <VueDatePicker v-if="!coupleDate" v-model="coupleDate" :format="'yyyy-MM-dd'" :enable-time-picker="false" :locale="t('lang_code')">
              <template #trigger>
                <div class="p-2 border rounded-3 hover" role="button">
                  <div class="d-flex align-items-center justify-content-center gap-1">
                    <Icon name="solar:heart-lock-outline" size="1.4rem" class="text-primary" />
                    <strong>{{ t("add_anniversary") }}</strong>
                  </div>
                </div>
              </template>
            </VueDatePicker>
            <div v-else>
              <div class="p-2 d-flex gap-3 border rounded-3 mb-2 position-relative" @mouseenter="deleteButton = true" @mouseleave="deleteButton = false">
                <div class="rounded-3 bg-secondary d-flex align-items-center justify-content-center" :style="{ width: '4.375rem', height: '4.375rem' }">
                  <div class="text-primary text-center">
                    <h4 class="m-0 fw-bold">{{ coupleDate.getDate() }}</h4>
                    <span class="fw-bold">{{ getMonth(coupleDate, "short") }}</span>
                  </div>
                </div>
                <div>
                  <div class="d-flex align-items-center gap-1">
                    <Icon name="solar:heart-lock-outline" size="1.4rem" class="text-primary" />
                    <h5 class="m-0">{{ t("anniversary") }}</h5>
                  </div>
                  <p class="m-0">{{ untilNextAnniversary(coupleDate) }}</p>
                </div>
                <Transition name="fade">
                  <div v-if="deleteButton" class="position-absolute top-0 end-0 m-2 d-flex flex-column">
                    <button class="btn btn-sm border-0" :title="t('delete')" @click="deleteDate">
                      <Icon name="solar:trash-bin-trash-linear" size="1.5rem" class="text-danger" />
                    </button>
                    <VueDatePicker v-model="coupleDate" :format="'yyyy-MM-dd'" :enable-time-picker="false" :locale="t('lang_code')">
                      <template #trigger>
                        <button class="btn btn-sm border-0" :title="t('delete')">
                          <Icon name="solar:pen-outline" size="1.5rem" />
                        </button>
                      </template>
                    </VueDatePicker>
                  </div>
                </Transition>
              </div>
              <div class="p-2 bg-secondary rounded-3 shadow-sm">
                <h4 class="text-center">{{ t("together_for") }}</h4>
                <div class="text-center d-flex gap-2 gap-lg-5 p-0 px-lg-5">
                  <div v-for="(field, key) in togetherFor" :key="key" class="bg-body py-3 rounded-3 flex-fill">
                    <h4 class="m-0 fw-bold">{{ field }}</h4>
                    <span>{{ t(key) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    bond: {
      type: Object as () => MappedLoveBond,
      required: true,
    },
  },
  data () {
    return {
      deleteButton: false,
      coupleDate: this.bond.coupleDate ? new Date(this.bond.coupleDate): undefined
    };
  },
  computed: {
    partner1 () {
      return this.bond.partner1 as MappedLovePartner;
    },
    partner2 () {
      return this.bond.partner2 as MappedLovePartner;
    },
    togetherFor () {
      return getTogetherFor(this.coupleDate);
    }
  },
  methods: {
    deleteDate () {
      this.coupleDate = undefined;
    }
  }
};
</script>
