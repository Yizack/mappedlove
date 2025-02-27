<template>
  <div id="layout" class="layout-grid">
    <NavbarMain sticky />
    <div class="container-fluid py-3 d-flex align-items-center">
      <slot />
    </div>
    <FooterPage />
  </div>
</template>
