<script setup lang="ts">
import { SITE } from "../shared/utils/site";

defineProps<{
  lang: string;
  year: string;
  summaryLink: string;
}>();
</script>

<template>
  <EHtml :lang="lang">
    <EHead>
      <title>Yearly Summary</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="x-apple-disable-message-reformatting">
      <EFont font-family="Arial" />
    </EHead>
    <EBody :style="{ margin: 0 }">
      <ESection style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; background: #ffe1e1; color: #443c47; line-height: 24px; letter-spacing: 0.5px;">
        <ESection style="max-width: 602px; border-collapse: collapse; border: 0; border-spacing: 0; background-color: #f8f9fa;">
          <ERow style="padding: 1.2rem 0;">
            <EColumn align="center">
              <EImg :src="`https://${SITE.domain}/images/text-logo.png`" alt="MappedLove Logo" style="width: 180px;" />
            </EColumn>
          </ERow>
          <ERow style="padding: 1rem 0; background-color: #c25050;">
            <EColumn align="center">
              <EHeading as="h1" style="color: #fff; font-size: 2rem;">Yearly Summary</EHeading>
            </EColumn>
          </ERow>
          <ESection style="padding: 36px 30px 36px 30px; background-color: #f8f9fa;">
            <EHeading as="h1" style="font-size: 1.5rem; margin: 0 0 20px 0; text-align: center">Your {{ year }} Summary is here</EHeading>
            <EText style="margin: 0 0 12px 0; font-size: 1rem;">You can now view your Bond Summary by clicking the button below. Log in now to discover your summary and relive your cherished memories!</EText>
            <ERow>
              <EColumn align="center">
                <EButton :href="summaryLink" target="_blank" style="display: inline-block; background: #c25050; color: #fff; font-weight: 400; margin: 0; text-decoration: none; text-transform: none; padding: 1rem 1.5rem; border-radius: 50rem; margin-top: 1rem; font-size: 1rem;">
                  <strong>Get your Bond Summary</strong>
                </EButton>
              </EColumn>
            </ERow>
          </ESection>
          <ERow style="padding: 15px 30px 15px 30px; background: #e9ecef; color: #443c47; font-size: 14px;">
            <EColumn align="center">
              <ELink style="color: #443c47; text-decoration: underline;" :href="`https://${SITE.domain}`">{{ SITE.domain }}</ELink>
            </EColumn>
          </ERow>
        </ESection>
      </ESection>
    </EBody>
  </EHtml>
</template>
