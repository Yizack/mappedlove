<script setup lang="ts">
import { Body, Button, Column, Font, Head, Heading, Html, Img, Link, Row, Section, Text } from "@vue-email/components";
import { SITE } from "../shared/utils/site";

defineProps<{
  lang: string;
  requestLink: string;
  request: string;
}>();
</script>

<template>
  <Html :lang="lang">
    <Head>
      <title>Account data request</title>
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
              <Heading as="h1" style="color: #fff; font-size: 2rem;">Account data request</Heading>
            </Column>
          </Row>
          <Section style="padding: 36px 30px 36px 30px; background-color: #f8f9fa;">
            <Heading as="h1" style="font-size: 1.5rem; margin: 0 0 20px 0;">Hello,</Heading>
            <Text style="margin: 0; font-size: 1rem;">
              <span v-if="request === 'download'">You requested a copy of your account data. Click the button below to download your information.</span>
              <span v-else>If you wish to proceed with account deletion, click the button below to confirm and remove your data.</span>
            </Text>
            <Row>
              <Column align="center">
                <Button :href="requestLink" target="_blank" style="display: inline-block; background: #c25050; color: #fff; font-weight: 400; text-decoration: none; text-transform: none; padding: 1rem 1.5rem; border-radius: 50rem; margin: 1rem 0 1rem 0; font-size: 1rem;">
                  <strong v-if="request === 'download'">Download my data</strong>
                  <strong v-else>Delete my account</strong>
                </Button>
              </Column>
            </Row>
            <Text style="margin: 0 0 12px 0; font-size: 1rem;">This link or account code is unique, and expires after 7 days.</Text>
            <Text style="margin: 0; font-size: 1rem;">If you didn't request this, please ignore this email or contact support if you have any questions.</Text>
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
