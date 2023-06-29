<script setup lang="ts">
definePageMeta({ layout: "start" });
</script>

<template>
  <main>
    <section class="banner banner-home text-dark py-5">
      <div class="container text-center py-5">
        <h1 class="display-3"><strong>{{ t("motto") }}</strong></h1>
        <p class="display-6 m-0">Mark the places you have visited together and preserve your special moments forever</p>
      </div>
    </section>
    <section class="py-5 bg-body-tertiary">
      <div class="container">
        <div class="row bg-body-tertiary">
          <div class="col-lg-6 text-center">
            <img src="/images/illustrations/mountains.png" class="img-fluid rounded-circle shadow" height="250" width="250">
          </div>
          <div class="col-lg-6 m-auto">
            <h2>Map Your Journey</h2>
            <p>Easily mark the locations you have visited on an interactive map and create a visual representation of your journey together.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="py-5 bg-body-secondary">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 m-auto">
            <h2>Share Your Memories</h2>
            <p>Upload photos and videos to your map and share them with your friends and family.</p>
          </div>
          <div class="col-lg-6 text-center">
            <img src="/images/illustrations/travelers.png" class="img-fluid rounded-circle shadow" height="250" width="250">
          </div>
        </div>
      </div>
    </section>
    <section class="py-5 bg-body-tertiary">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 text-center">
            <img src="/images/illustrations/card.png" class="img-fluid rounded-circle shadow" height="250" width="250">
          </div>
          <div class="col-lg-6 m-auto">
            <h2>Preserve Your Memories</h2>
            <p>Keep your memories alive by creating a visual representation of your journey together.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
