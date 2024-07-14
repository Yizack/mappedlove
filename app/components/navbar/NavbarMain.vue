<script setup lang="ts">
defineProps({
  sticky: {
    type: Boolean,
    default: false
  }
});

const scrolled = ref(false);
const maxScroll = 50;

onMounted(() => {
  onscroll = () => {
    scrolled.value = (document.body.scrollTop > maxScroll || document.documentElement.scrollTop > maxScroll);
  };
});
</script>

<template>
  <nav class="navbar navbar-expand-md" :class="{ 'bg-body shadow-sm': scrolled || sticky, 'sticky-top': sticky, 'fixed-top': !sticky }">
    <div class="container-fluid container-md">
      <button class="navbar-toggler border-0 rounded-pill" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" />
      </button>
      <NuxtLink class="navbar-brand ms-2 ms-md-0 me-auto d-flex align-items-center gap-1" :class="scrolled || sticky ? 'text-body' : 'text-dark'" to="/">
        <Icon :class="scrolled || sticky ? 'text-primary' : 'text-dark'" name="solar:map-point-favourite-bold" />
        {{ SITE.name }}
      </NuxtLink>
      <div id="offcanvasNavbar" class="offcanvas offcanvas-start" tabindex="-1" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header" data-bs-dismiss="offcanvas">
          <NuxtLink class="navbar-brand d-flex align-items-center gap-1" to="/">
            <Icon class="text-primary" name="solar:map-point-favourite-bold" />
            {{ SITE.name }}
          </NuxtLink>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav ms-auto mb-lg-0 gap-md-3">
            <li v-for="(page, i) of SITE.pages.main" :key="i" class="nav-item" data-bs-dismiss="offcanvas">
              <div class="d-grid">
                <NuxtLink :class="page.button ? 'btn btn-primary rounded-pill px-4 my-2 my-md-0' : 'nav-link'" :to="page.path">{{ t(page.name) }}</NuxtLink>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>
