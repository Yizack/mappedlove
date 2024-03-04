<template>
  <div id="layout">
    <NavbarMain />
    <Suspense>
      <slot />
    </Suspense>
    <FooterPage />
  </div>
</template>
