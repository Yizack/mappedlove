<template>
  <div id="layout" class="position-absolute w-100 h-100 d-flex flex-column">
    <NavbarApp />
    <div class="container-fluid p-0 flex-fill">
      <slot />
    </div>
  </div>
</template>
