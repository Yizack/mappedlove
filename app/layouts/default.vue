<template>
  <div id="layout" class="layout-grid">
    <NavbarMain />
    <slot />
    <LazyFooterPage hydrate-on-visible />
  </div>
</template>
