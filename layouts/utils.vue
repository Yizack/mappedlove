<template>
  <div id="layout">
    <NavbarMain sticky />
    <div class="container-fluid py-3">
      <Suspense>
        <slot />
      </Suspense>
    </div>
    <FooterPage />
  </div>
</template>
