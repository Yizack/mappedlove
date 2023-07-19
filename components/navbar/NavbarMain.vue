<template>
  <nav class="navbar navbar-expand-md fixed-top" :class="{'bg-body shadow': scrolled}">
    <div class="container">
      <button class="navbar-toggler border-0 rounded-pill" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" />
      </button>
      <NuxtLink class="navbar-brand ms-2 ms-md-0 me-auto" to="/">{{ SITE.name }}</NuxtLink>
      <div id="offcanvasNavbar" class="offcanvas offcanvas-start" tabindex="-1" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header">
          <NuxtLink class="navbar-brand" to="/">{{ SITE.name }}</NuxtLink>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav ms-auto mb-lg-0 gap-md-3">
            <li v-for="(page, i) of SITE.pages" :key="i" class="nav-item" data-bs-dismiss="offcanvas">
              <div class="d-grid">
                <NuxtLink :class="`${page.button ? 'btn btn-primary rounded-pill px-4' : 'nav-link'}`" :to="page.path">{{ page.name }}</NuxtLink>
              </div>
            </li>
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
      scrolled: false,
      maxScroll: 50
    };
  },
  mounted () {
    window.onscroll = () => {
      this.scrolled = (document.body.scrollTop > this.maxScroll || document.documentElement.scrollTop > this.maxScroll);
    };
  }
};
</script>
