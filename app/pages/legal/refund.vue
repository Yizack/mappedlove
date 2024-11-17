<script setup lang="ts">
definePageMeta({ layout: "utils" });

useSeo({
  title: `${t("refund_policy")} | ${SITE.name}`,
  name: t("refund_policy"),
  description: t("seo_refund_description")
});
</script>

<template>
  <main>
    <div class="col-lg-8 col-xl-9 mx-auto bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
      <h2>REFUND POLICY</h2>
      <p><small>Last updated March 09, 2024</small></p>
      <section id="refund-eligibility">
        <h4>Refund eligibility</h4>
        <p>You are elegible to request a refund if you meet the following conditions:</p>
        <ul>
          <li>you have purchased the product or service within the last 14 days;</li>
          <li>you have not requested a refund before; and</li>
          <li>you have not violated the <NuxtLink to="/legal/terms">Terms of use</NuxtLink>.</li>
        </ul>
        <p>There is generally no obligation to provide a refund or credit in situations like the following:</p>
        <ul>
          <li>you have changed your mind about your subscription;</li>
          <li>you subscribed by mistake;</li>
          <li>you are not satisfied with the current offering</li>
          <li>you ask for goodwill; or</li>
          <li>you can no longer access any of your desired items because they have been removed from {{ SITE.name }}.</li>
        </ul>
        <p>If you are only after cancelling your {{ SITE.name }} Premium subscription, you can go ahead, cancel it and use {{ SITE.name }} Premium features until the subscription expires automatically at the end of the billing period.</p>
      </section>
      <section id="how-can-i-request-a-refund">
        <h4>How can I request a refund?</h4>
        <p>Before requesting a refund, please cancel your subscription by accessing your <NuxtLink to="/app/premium/billing">account billing settings</NuxtLink> and clicking on the "Cancel subscription" button.</p>
        <p>To request a refund, please go to your <NuxtLink to="/app/premium/billing">account billing settings</NuxtLink>. There you will find a "Request a refund" button. Click on it and fill in the form with the required information.</p>
        <p>Once we receive your refund request, we will review it and notify you that we have received your request. We will immediately notify you on the status of your refund after reviewing your request.</p>
      </section>
      <section id="how-will-i-receive-it">
        <h4>How will I receive it?</h4>
        <p>Once your refund request is approved, we will process the refund through our payment processor (<a href="https://www.paddle.com" target="_blank">Paddle</a>). The time it takes for the refund to appear in your account may vary depending on the payment method used.</p>
        <p>Card refunds typically take 3-5 working days to credit back into the customer’s account.</p>
        <p>PayPal refunds typically re-appear in a customer’s account within 48 hours of requesting the refund.</p>
      </section>
    </div>
  </main>
</template>
