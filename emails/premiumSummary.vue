<script setup lang="ts">
import { Body, Column, Font, Head, Heading, Html, Img, Link, Row, Section, Text } from "@vue-email/components";
import { SITE } from "~~/shared/utils/site";

defineProps<{
  lang: string;
  year: string;
  summaryLink: string;
}>();
</script>

<template>
  <Html :lang="lang">
    <Head>
      <title>Yearly Summary</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="x-apple-disable-message-reformatting">
      <Font font-family="Arial" />
    </Head>
    <Body style="margin:0;">
      <Section style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; background: #ffe1e1; color: #443c47; line-height: 24px; letter-spacing: 0.5px;">
        <Section style="max-width: 602px; border-collapse: collapse; border: 0; border-spacing: 0; background-color: #f8f9fa;">
          <Row style="padding: 1.2rem 0;">
            <Column align="center">
              <Img :src="`https://${SITE.domain}/images/text-logo.png`" alt="MappedLove Logo" style="width: 180px;" />
            </Column>
          </Row>
          <Row style="padding: 1rem 0; background-color: #c25050;">
            <Column align="center">
              <Heading as="h1" style="color: #fff; font-size: 2rem;">Yearly Summary</Heading>
            </Column>
          </Row>
          <Section style="padding: 36px 30px 36px 30px; background-color: #f8f9fa;">
            <Heading as="h1" style="font-size: 1.5rem; margin: 0 0 20px 0; text-align: center">Your {{ year }} Summary is here</Heading>
            <Text style="margin: 0 0 12px 0; font-size: 1rem;">You can now view your Bond Summary by clicking the button below. Log in now to discover your summary and relive your cherished memories!</Text>
            <Row>
              <Column align="center">
                <Button :href="summaryLink" target="_blank" style="display: inline-block; background: #c25050; color: #fff; font-weight: 400; margin: 0; text-decoration: none; text-transform: none; padding: 1rem 1.5rem; border-radius: 50rem; margin-top: 1rem; font-size: 1rem;">
                  <strong>Get your Bond Summary</strong>
                </Button>
              </Column>
            </Row>
          </Section>
          <Row style="padding: 15px 30px 15px 30px; background: #e9ecef; color: #443c47; font-size: 14px;">
            <Column align="center">
              <Link style="color: #443c47; text-decoration: underline;" :href="`https://${SITE.domain}`">{{ SITE.domain }}</Link>
            </Column>
          </Row>
        </Section>
      </Section>
    </Body>
  </Html>
</template>
