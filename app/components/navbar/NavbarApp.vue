<script setup lang="ts">
const { loggedIn, user, clear } = useUserSession() as MappedLoveSessionComposable;
const logOut = () => {
  clear();
  navigateTo("/", { replace: true });
};
</script>

<template>
  <nav v-if="user" class="navbar navbar-expand-md sticky-top bg-body shadow-sm">
    <div class="container-fluid">
      <button class="navbar-toggler border-0 rounded-pill" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" />
      </button>
      <NuxtLink class="navbar-brand ms-2 ms-md-0 me-auto d-flex align-items-center gap-1 position-relative" to="/app">
        <Icon class="text-primary" name="solar:map-point-favourite-bold" />
        {{ SITE.name }}
        <span v-if="user.bond?.premium" class="badge text-primary position-absolute start-100 translate-middle p-0" style="top: 8px;">
          <small>{{ t("premium") }}</small>
        </span>
      </NuxtLink>
      <div id="offcanvasNavbar" class="offcanvas offcanvas-start" tabindex="-1" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header" data-bs-dismiss="offcanvas">
          <NuxtLink class="navbar-brand d-flex align-items-center gap-1" to="/app">
            <Icon class="text-primary" name="solar:map-point-favourite-bold" />
            {{ SITE.name }}
          </NuxtLink>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav ms-auto mb-lg-0 gap-md-3">
            <li v-for="(page, i) of SITE.pages.app" :key="i" class="nav-item" data-bs-dismiss="offcanvas">
              <div class="d-grid">
                <NuxtLink :class="page.button ? 'btn btn-primary rounded-pill px-4' : 'nav-link d-flex align-items-center gap-1'" :to="page.path">
                  <Icon v-if="page.icon" :name="page.icon" class="text-primary" />
                  {{ t(page.name) }}
                </NuxtLink>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="ms-3">
        <div v-if="loggedIn" class="nav-item dropdown">
          <button class="button btn btn-primary rounded-pill dropdown-toggle d-flex align-items-center justify-content-center" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <div v-if="user.showAvatar && user.hash" class="image-upload text-center">
              <label class="rounded-circle bg-body-tertiary position-relative overflow-hidden d-flex" style="width: 24px; height: 24px;">
                <img :src="`${getAvatarImage(user.hash)}?updated=${user.updatedAt}`" alt="avatar" width="24" height="24" class="img-fluid">
              </label>
            </div>
            <span :class="{ 'd-none d-md-inline ms-1': user.showAvatar }">{{ user.name }}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <template v-for="(page, i) of SITE.pages.user" :key="i">
              <li v-if="i < SITE.pages.user.length - 1">
                <NuxtLink class="dropdown-item" :to="page.path">{{ t(page.name) }}</NuxtLink>
              </li>
              <template v-else>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item" @click="logOut()"><Icon name="solar:exit-linear" /> {{ t(page.name) }}</button></li>
              </template>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>
