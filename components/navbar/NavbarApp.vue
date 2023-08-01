<script setup lang="ts">
const { loggedIn, user, clear } = useUserSession();
const logOut = () => {
  clear();
  navigateTo("/", { replace: true });
};
</script>

<template>
  <nav class="navbar navbar-expand-md sticky-top bg-body shadow">
    <div class="container-fluid">
      <button class="navbar-toggler border-0 rounded-pill" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" />
      </button>
      <NuxtLink class="navbar-brand ms-2 ms-md-0 me-auto d-flex align-items-center gap-1" to="/app">
        <Icon class="text-primary" name="solar:map-point-favourite-bold" />
        {{ SITE.name }}
      </NuxtLink>
      <div id="offcanvasNavbar" class="offcanvas offcanvas-start" tabindex="-1" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header">
          <NuxtLink class="navbar-brand" to="/">{{ SITE.name }}</NuxtLink>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav ms-auto mb-lg-0 gap-md-3">
            <li v-for="(page, i) of pages" :key="i" class="nav-item" data-bs-dismiss="offcanvas">
              <div class="d-grid">
                <NuxtLink :class="`${page.button ? 'btn btn-primary rounded-pill px-4' : 'nav-link'}`" :to="page.path">{{ page.name }}</NuxtLink>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="ms-3">
        <div v-if="loggedIn" class="nav-item dropdown">
          <button class="button btn btn-primary rounded-pill dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <img v-if="user.showAvatar" :src="`${SITE.cdn}/avatar/${user.id}`" alt="avatar" class="rounded-circle" width="24" height="24">
            <span :class="{'d-none d-md-inline': user.showAvatar}">{{ user.name }}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><NuxtLink class="dropdown-item" to="/app/settings">Settings</NuxtLink></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item" @click="logOut()"><Icon name="solar:exit-linear" /> Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
export default {
  data () {
    return {
      pages: [
        {
          name: "App",
          path: "/app",
          button: false
        },
        {
          name: "Map",
          path: "/app/map",
          button: false
        },
        {
          name: "Bond",
          path: "/app/bond",
          button: false
        }
      ]
    };
  }
};
</script>
