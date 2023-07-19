<template>
  <div id="layout" class="vh-100 bg-secondary overflow-auto d-flex flex-column">
    <NavbarApp />
    <div class="container-fluid py-3 flex-fill d-flex align-items-center">
      <slot />
    </div>
  </div>
</template>
