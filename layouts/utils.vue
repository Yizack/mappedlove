<template>
  <div id="layout" class="d-flex flex-column vh-100">
    <NavbarMain sticky />
    <div class="container-fluid py-3 flex-fill">
      <slot />
    </div>
    <FooterPage />
  </div>
</template>
