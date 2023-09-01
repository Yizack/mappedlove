<template>
  <div id="layout" class="position-absolute w-100 h-100 d-flex flex-column">
    <NavbarApp />
    <div class="container-fluid py-3 flex-fill d-flex align-items-center">
      <slot />
    </div>
  </div>
</template>
