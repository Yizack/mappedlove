<script setup lang="ts">
definePageMeta({ layout: "utils" });
const { isModalActive } = useCookieControl();

const cookieManager = (e: Event) => {
  e.preventDefault();
  isModalActive.value = true;
};

useSeo({
  title: `${t("cookie_policy")} | ${SITE.name}`,
  name: t("cookie_policy"),
  description: t("seo_cookie_description")
});
</script>

<template>
  <main>
    <div class="col-lg-8 col-xl-9 mx-auto bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
      <h2>COOKIE POLICY</h2>
      <p><small>Last updated March 09, 2024</small></p>
      <p>This Cookie Policy explains how {{ SITE.name }} ("<strong>we</strong>," "<strong>us</strong>," and "<strong>our</strong>") uses cookies and similar technologies to recognize you when you visit our website at  <NuxtLink to="/">{{ SITE.host }}</NuxtLink> ("<strong>Website</strong>"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.</p>
      <p>In some cases we may use cookies to collect personal information, or that becomes personal information if we combine it with other information.</p>
      <section id="what-are-cookies">
        <h4>What are cookies?</h4>
        <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
        <p>Cookies set by the website owner (in this case, Yizack Rangel) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.</p>
      </section>
      <section id="why-do-we-use-cookies">
        <h4>Why do we use cookies?</h4>
        <p>We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes. This is described in more detail below.</p>
        <p><strong>Operational Cookies:</strong> These cookies are critical to the operation of the {{ SITE.name }} Services. These cookies are used, for example, to maintain your login state and remember your preferences. These cookies cannot be disabled without severely affecting your use of the {{ SITE.name }} Services.</p>
        <p>Examples of operational cookies include the following:</p>
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th colspan="5">Operational cookie examples</th>
              </tr>
              <tr>
                <th>Provider</th>
                <th>Cookie ID</th>
                <th>Type</th>
                <th>Purpose</th>
                <th>Expiration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ SITE.name }}</td>
                <td>nuxt-session</td>
                <td>Cookies store</td>
                <td>Authentication, authorization and session management</td>
                <td>Until user closes browser</td>
              </tr>
              <tr>
                <td>{{ SITE.name }}</td>
                <td>nuxt-color-mode</td>
                <td>Local storage</td>
                <td>Color mode preference</td>
                <td>Persistent</td>
              </tr>
              <tr>
                <td>{{ SITE.name }}</td>
                <td>nuxt-loading-enable-animation</td>
                <td>Local storage</td>
                <td>Enable loading animation</td>
                <td>Persistent</td>
              </tr>
              <tr>
                <td>{{ SITE.name }}</td>
                <td>iconify-count</td>
                <td>Local storage</td>
                <td>Iconify icons count</td>
                <td>Persistent</td>
              </tr>
              <tr>
                <td>{{ SITE.name }}</td>
                <td>iconify-version</td>
                <td>Local storage</td>
                <td>Iconify icons version</td>
                <td>Persistent</td>
              </tr>
              <tr>
                <td>{{ SITE.name }}</td>
                <td>iconify[n]</td>
                <td>Local storage</td>
                <td>Iconify icons</td>
                <td>Persistent</td>
              </tr>
              <tr>
                <td>{{ SITE.name }}</td>
                <td>ncc_c</td>
                <td>Cookies store</td>
                <td>Validates user's choice about cookies</td>
                <td>One year</td>
              </tr>
              <tr>
                <td>{{ SITE.name }}</td>
                <td>ncc_e</td>
                <td>Cookies store</td>
                <td>Id of enabled cookies</td>
                <td>One year</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section id="how-can-i-control-cookies">
        <h4>How can I control cookies?</h4>
        <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the <a href="#" @click="cookieManager">Cookie Consent Manager</a>. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.</p>
        <p>The Cookie Consent Manager can be found in the notification banner and on our website. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. You may also set or amend your web browser controls to accept or refuse cookies.</p>
      </section>
      <section id="how-can-i-control-cookies-on-my-browser">
        <h4>How can I control cookies on my browser?</h4>
        <p>As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information. The following is information about how to manage cookies on the most popular browsers:</p>
        <ul>
          <li><NuxtLink to="https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies" target="_blank">Chrome</NuxtLink></li>
          <li><NuxtLink to="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank">Internet Explorer</NuxtLink></li>
          <li><NuxtLink to="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectslug=enable-and-disable-cookies-website-preferences&redirectlocale=en-US" target="_blank">Firefox</NuxtLink></li>
          <li><NuxtLink to="https://support.apple.com/en-ie/guide/safari/sfri11471/mac" target="_blank">Safari</NuxtLink></li>
          <li><NuxtLink to="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" target="_blank">Edge</NuxtLink></li>
          <li><NuxtLink to="https://help.opera.com/en/latest/web-preferences/" target="_blank">Opera</NuxtLink></li>
          <li><NuxtLink to="https://support.brave.com/hc/en-us/articles/360050634931-How-Do-I-Manage-Cookies-In-Brave" target="_blank">Brave</NuxtLink></li>
        </ul>
        <p>In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit:</p>
        <ul>
          <li><NuxtLink to="https://optout.aboutads.info/?c=2&lang=ES" target="_blank">Digital Advertising Alliance</NuxtLink></li>
          <li><NuxtLink to="https://youradchoices.ca/" target="_blank">Digital Advertising Alliance of Canada</NuxtLink></li>
          <li><NuxtLink to="https://www.youronlinechoices.com/" target="_blank">European Interactive Digital Advertising Alliance</NuxtLink></li>
        </ul>
      </section>
      <section id="what-about-other-tracking-technologies-like-web-beacons">
        <h4>What about other tracking technologies, like web beacons?</h4>
        <p>Cookies are not the only way to recognize or track visitors to a website. We may use other, similar technologies from time to time, like web beacons (sometimes called "tracking pixels" or "clear gifs"). These are tiny graphics files that contain a unique identifier that enables us to recognize when someone has visited our Website or opened an email including them. This allows us, for example, to monitor the traffic patterns of users from one page within a website to another, to deliver or communicate with cookies, to understand whether you have come to the website from an online advertisement displayed on a third-party website, to improve site performance, and to measure the success of email marketing campaigns. In many instances, these technologies are reliant on cookies to function properly, and so declining cookies will impair their functioning.</p>
      </section>
      <section id="do-you-serve-targeted-advertising">
        <h4>Do you serve targeted advertising?</h4>
        <p>Third parties may serve cookies on your computer or mobile device to serve advertising through our Website. These companies may use information about your visits to this and other websites in order to provide relevant advertisements about goods and services that you may be interested in. They may also employ technology that is used to measure the effectiveness of advertisements. They can accomplish this by using cookies or web beacons to collect information about your visits to this and other sites in order to provide relevant advertisements about goods and services of potential interest to you. The information collected through this process does not enable us or them to identify your name, contact details, or other details that directly identify you unless you choose to provide these.</p>
      </section>
      <section id="how-often-will-you-update-this-cookie-policy">
        <h4>How often will you update this Cookie Policy?</h4>
        <p>We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.</p>
        <p>The date at the top of this Cookie Policy indicates when it was last updated.</p>
      </section>
      <section id="where-can-i-get-further-information">
        <h4>Where can I get further information?</h4>
        <p>If you have any questions about our use of cookies or other technologies, please email us at <a :href="`mailto:legal@${SITE.domain}`">legal@{{ SITE.domain }}</a>.</p>
      </section>
    </div>
  </main>
</template>
