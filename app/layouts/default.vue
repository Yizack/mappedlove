<template>
  <div id="layout">
    <NavbarMain />
    <slot />
    <LazyFooterPage hydrate-on-visible />
  </div>
</template>
