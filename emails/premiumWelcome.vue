<script setup lang="ts">
import { EHtml, EHead, EFont, EBody, ESection, ERow, EColumn, EImg, EHeading, EText, ELink } from "vue-email";

defineProps({
  lang: { type: String, default: "{{ lang }}" },
  domain: { type: String, default: "{{ domain }}" }
});
</script>

<template>
  <EHtml :lang="lang">
    <EHead>
      <title>Premium</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="x-apple-disable-message-reformatting">
      <EFont font-family="Arial" />
    </EHead>
    <EBody style="margin:0;">
      <ESection style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; background: #ffe5e5; color: #443c47; line-height: 24px; letter-spacing: 0.5px;">
        <ESection style="max-width: 602px; border-collapse: collapse; border: 0; border-spacing: 0; background-color: #f8f9fa;">
          <ERow style="padding: 1.2rem 0;">
            <EColumn align="center">
              <EImg :src="`https://${domain}/images/text-logo.png`" alt="MappedLove Logo" style="width: 180px;" />
            </EColumn>
          </ERow>
          <ERow style="padding: 1rem 0; background-color: #ff6969;">
            <EColumn align="center">
              <EHeading as="h1" style="color: #fff; font-size: 2rem;">Premium</EHeading>
            </EColumn>
          </ERow>
          <ESection style="padding: 36px 30px 36px 30px; background-color: #f8f9fa;">
            <EHeading as="h1" style="font-size: 1.5rem; margin: 0 0 20px 0;">Hello,</EHeading>
            <EText style="margin: 0 0 12px 0; font-size: 1rem;">You have upgraded your bond to premium. Enjoy the benefits of your premium subscription!</EText>
            <EText style="margin: 0; font-size: 1rem;">Premium features are available for your bond, ensuring they are accessible to both you and your partner.</EText>
          </ESection>
          <ERow style="padding: 15px 30px 15px 30px; background: #e9ecef; color: #443c47; font-size: 14px;">
            <EColumn align="center">
              <ELink style="color: #443c47; text-decoration: underline;" :href="`https://${domain}`">{{ domain }}</ELink>
            </EColumn>
          </ERow>
        </ESection>
      </ESection>
    </EBody>
  </EHtml>
</template>
