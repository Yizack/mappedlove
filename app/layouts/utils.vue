<template>
  <div id="layout" class="d-flex flex-column min-vh-100">
    <NavbarMain sticky />
    <div class="container-fluid py-3 d-flex align-items-center flex-grow-1">
      <slot />
    </div>
    <LazyFooterPage hydrate-on-visible />
  </div>
</template>
