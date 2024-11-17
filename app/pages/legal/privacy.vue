<script setup lang="ts">
definePageMeta({ layout: "utils" });

useSeo({
  title: `${t("privacy_policy")} | ${SITE.name}`,
  name: t("privacy_policy"),
  description: t("seo_privacy_description")
});
</script>

<template>
  <main>
    <div class="col-lg-8 col-xl-9 mx-auto bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
      <h2>PRIVACY POLICY</h2>
      <p><small>Last updated March 08, 2024</small></p>
      <p>This privacy notice for {{ SITE.name }} ("<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>"), describes how and why we might collect, store, use, and/or share ("<strong>process</strong>") your information when you use our services ("<strong>Services</strong>"), such as when you:</p>
      <ul>
        <li>Visit our website at <NuxtLink to="/">{{ SITE.host }}</NuxtLink>, or any website of ours that links to this privacy notice</li>
        <!-- <li>Download and use our mobile application ({{ SITE.name }}), or any other application of ours that links to this privacy notice</li> -->
        <li>Engage with us in other related ways, including any sales, marketing, or events</li>
      </ul>
      <p><strong>Questions or concerns?</strong> Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <a :href="`mailto:legal@${SITE.domain}`">legal@{{ SITE.domain }}</a>.</p>
      <section id="summary-of-key-points">
        <h4>SUMMARY OF KEY POINTS</h4>
        <p><strong><i>This summary provides key points from our privacy notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our <a href="#table-of-contents">table of contents</a> below to find the section you are looking for.</i></strong></p>
        <p><strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use. Learn more about <a href="#what-information-do-we-collect">personal information you disclose to us</a>.</p>
        <p><strong>Do we process any sensitive personal information?</strong> We do not process sensitive personal information.</p>
        <p><strong>Do we receive any information from third parties?</strong> We do not receive any information from third parties.</p>
        <p><strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. Learn more about <a href="#how-do-we-process-your-information">how we process your information</a>.</p>
        <p><strong>In what situations and with which parties do we share personal information?</strong> We may share information in specific situations and with specific third parties. Learn more about <a href="#when-and-with-whom-do-we-share-your-personal-information">when and with whom we share your personal information</a>.</p>
        <p><strong>How do we keep your information safe?</strong> We have organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Learn more about how we keep your information safe.</p>
        <p><strong>What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. Learn more about <a href="#what-are-your-privacy-rights">your privacy rights</a>.</p>
        <p><strong>How do you exercise your rights?</strong> The easiest way to exercise your rights is by accessing your account settings and review, update or delete your data or by visiting <NuxtLink to="/account-data" target="_blank">{{ SITE.host }}/account-data</NuxtLink>, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws. Learn more about <a href="#how-can-you-review-update-or-delete-the-data-we-collect-from-you">how can you review, update or delete the data we collect from you</a>.</p>
        <p><strong>Want to learn more about what we do with any information we collect?</strong> Review the privacy notice in full.</p>
      </section>
      <section id="table-of-contents">
        <h4>TABLE OF CONTENTS</h4>
        <ol>
          <li><a href="#what-information-do-we-collect">WHAT INFORMATION DO WE COLLECT?</a></li>
          <li><a href="#how-do-we-process-your-information">HOW DO WE PROCESS YOUR INFORMATION?</a></li>
          <li><a href="#what-legal-bases-do-we-rely-on-to-process-your-personal-information">WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?</a></li>
          <li><a href="#when-and-with-whom-do-we-share-your-personal-information">WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a></li>
          <li><a href="#do-we-use-cookies-and-other-tracking-technologies">DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</a></li>
          <li><a href="#how-long-do-we-keep-your-information">HOW LONG DO WE KEEP YOUR INFORMATION?</a></li>
          <li><a href="#how-do-we-keep-your-information-safe">HOW DO WE KEEP YOUR INFORMATION SAFE?</a></li>
          <li><a href="#do-we-collect-information-from-minors">DO WE COLLECT INFORMATION FROM MINORS?</a></li>
          <li><a href="#what-are-your-privacy-rights">WHAT ARE YOUR PRIVACY RIGHTS?</a></li>
          <li><a href="#controls-for-do-not-track-features">CONTROLS FOR DO-NOT-TRACK FEATURES</a></li>
          <li><a href="#do-united-states-residents-have-specific-privacy-rights">DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</a></li>
          <li><a href="#do-we-make-updates-to-this-notice">DO WE MAKE UPDATES TO THIS NOTICE?</a></li>
          <li><a href="#how-can-you-contact-us-about-this-notice">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a></li>
          <li><a href="#how-can-you-review-update-or-delete-the-data-we-collect-from-you">HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</a></li>
        </ol>
      </section>
      <section id="what-information-do-we-collect">
        <h4>1. WHAT INFORMATION DO WE COLLECT?</h4>
        <h5>Personal information you disclose to us</h5>
        <p><strong>In Short:</strong> We collect personal information that you provide to us.</p>
        <p>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>
        <p><strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
        <ul>
          <li>names</li>
          <li>email addresses</li>
          <li>usernames</li>
          <li>passwords</li>
        </ul>
        <p><strong>Sensitive Information.</strong> We do not process sensitive information.</p>
        <p><strong>Payment Data.</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is stored by Paddle. You may find their privacy notice link(s) here: <a href="https://www.paddle.com/legal/privacy">https://www.paddle.com/legal/privacy</a>.</p>
        <p>All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</p>
        <h5>Information automatically collected</h5>
        <p><strong>In Short:</strong> Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.</p>
        <p>We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes</p>
        <p>Like many businesses, we also collect information through cookies and similar technologies. You can find out more about this in our Cookie Notice: <a href="/legal/cookies" target="_blank">{{ SITE.host }}/legal/cookies</a>.</p>
        <p>The information we collect includes:</p>
        <ul>
          <li>Log and Usage Data. Log and usage data is service-related, diagnostic, usage, and performance information our servers automatically collect when you access or use our Services and which we record in log files. Depending on how you interact with us, this log data may include your IP address, device information, browser type, and settings and information about your activity in the Services (such as the date/time stamps associated with your usage, pages and files viewed, searches, and other actions you take such as which features you use), device event information (such as system activity, error reports (sometimes called "crash dumps"), and hardware settings).</li>
        </ul>
      </section>
      <section id="how-do-we-process-your-information">
        <h4>2. HOW DO WE PROCESS YOUR INFORMATION?</h4>
        <p><strong>In Short:</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</p>
        <p><strong>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</strong></p>
        <ul>
          <li><strong>To facilitate account creation and authentication and otherwise manage user accounts.</strong> We may process your information so you can create and log in to your account, as well as keep your account in working order.</li>
          <li><strong>To save or protect an individual's vital interest.</strong> We may process your information when necessary to save or protect an individual's vital interest, such as to prevent harm.</li>
        </ul>
      </section>
      <section id="what-legal-bases-do-we-rely-on-to-process-your-personal-information">
        <h4>3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?</h4>
        <p><strong>In Short:</strong> We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.</p>
        <p><strong><i><u>If you are located in the EU or UK, this section applies to you.</u></i></strong></p>
        <p>The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information:</p>
        <ul>
          <li><strong>Consent.</strong> We may process your information if you have given us permission (i.e., consent) to use your personal information for a specific purpose. You can withdraw your consent at any time. Learn more about withdrawing your consent.</li>
          <li><strong>Legal Obligations.</strong> We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.</li>
          <li><strong>Vital Interests.</strong> We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person.</li>
        </ul>
        <p><strong><i><u>If you are located in Canada, this section applies to you.</u></i></strong></p>
        <p>We may process your information if you have given us specific permission (i.e., express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e., implied consent). You can withdraw your consent at any time.</p>
        <p>In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example:</p>
        <ul>
          <li>If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way</li>
          <li>For investigations and fraud detection and prevention</li>
          <li>For business transactions provided certain conditions are met</li>
          <li>If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim</li>
          <li>For identifying injured, ill, or deceased persons and communicating with next of kin</li>
          <li>If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse</li>
          <li>If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the information and the collection is reasonable for purposes related to investigating a breach of an agreement or a contravention of the laws of Canada or a province</li>
          <li>If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records</li>
          <li>If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced</li>
          <li>If the collection is solely for journalistic, artistic, or literary purposes</li>
          <li>If the information is publicly available and is specified by the regulations</li>
        </ul>
      </section>
      <section id="when-and-with-whom-do-we-share-your-personal-information">
        <h4>4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h4>
        <p><strong>In Short:</strong> We may share information in specific situations described in this section and/or with the following third parties.</p>
        <p>We may need to share your personal information in the following situations:</p>
        <ul>
          <li><strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
        </ul>
      </section>
      <section id="do-we-use-cookies-and-other-tracking-technologies">
        <h4>5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h4>
        <p><strong>In Short:</strong> We may use cookies and other tracking technologies to collect and store your information.</p>
        <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice: <NuxtLink to="/legal/cookies" target="_blank">{{ SITE.host }}/legal/cookies</NuxtLink>.</p>
      </section>
      <section id="how-long-do-we-keep-your-information">
        <h4>6. HOW LONG DO WE KEEP YOUR INFORMATION?</h4>
        <p><strong>In Short:</strong> We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.</p>
        <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.</p>
        <p>When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.</p>
      </section>
      <section id="how-do-we-keep-your-information-safe">
        <h4>7. HOW DO WE KEEP YOUR INFORMATION SAFE?</h4>
        <p><strong>In Short:</strong> We aim to protect your personal information through a system of organizational and technical security measures.</p>
        <p>We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.</p>
      </section>
      <section id="do-we-collect-information-from-minors">
        <h4>8. DO WE COLLECT INFORMATION FROM MINORS?</h4>
        <p><strong>In Short:</strong> We do not knowingly collect data from or market to children under 18 years of age.</p>
        <p>We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at <a :href="`mailto:legal@${SITE.domain}`">legal@{{ SITE.domain }}</a>.</p>
      </section>
      <section id="what-are-your-privacy-rights">
        <h4>9. WHAT ARE YOUR PRIVACY RIGHTS?</h4>
        <p><strong>In Short:</strong> In some regions, such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.</p>
        <p>In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated decision-making. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below.</p>
        <p>We will consider and act upon any request in accordance with applicable data protection laws.</p>
        <p>If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your Member State data protection authority or UK data protection authority.</p>
        <p>If you are located in Switzerland, you may contact the Federal Data Protection and Information Commissioner.</p>
        <p><strong>Withdrawing your consent:</strong> If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below or updating your preferences.</p>
        <p>However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.</p>
        <h5>Account Information</h5>
        <p>If you would at any time like to review or change the information in your account or terminate your account, you can:</p>
        <ul>
          <li>Log in to your account settings and update your user account.</li>
          <li>Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.</li>
        </ul>
        <p><strong><u>Cookies and similar technologies:</u></strong> Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services. For further information, please see our Cookie Notice: <NuxtLink to="/legal/cookies" target="_blank">{{ SITE.host }}/legal/cookies</NuxtLink>.</p>
        <p>If you have questions or comments about your privacy rights, you may email us at <a :href="`mailto:legal@${SITE.domain}`">legal@{{ SITE.domain }}</a>.</p>
      </section>
      <section id="controls-for-do-not-track-features">
        <p>Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.</p>
      </section>
      <section id="do-united-states-residents-have-specific-privacy-rights">
        <h4>11. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h4>
        <p><strong>In Short:</strong> If you are a resident of California, Colorado, Connecticut, Utah or Virginia, you are granted specific rights regarding access to your personal information.</p>
        <p><strong>What categories of personal information do we collect?</strong></p>
        <p>We have collected the following categories of personal information in the past twelve (12) months:</p>
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Category</th>
                <th>Examples</th>
                <th>Collected</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A. Identifiers</td>
                <td>Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name</td>
                <td>YES</td>
              </tr>
              <tr>
                <td>B. Personal information as defined in the California Customer Records statute</td>
                <td>Name, contact information, education, employment, employment history, and financial information</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>C. Protected classification characteristics under state or federal law</td>
                <td>Gender and date of birth</td>
                <td>YES</td>
              </tr>
              <tr>
                <td>D. Commercial information</td>
                <td>Transaction information, purchase history, financial details, and payment information</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>E. Biometric information</td>
                <td>Fingerprints and voiceprints</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>F. Internet or other similar network activity</td>
                <td>Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>G. Geolocation data</td>
                <td>Device location</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>H. Audio, electronic, visual, thermal, olfactory, or similar information</td>
                <td>Images and audio, video or call recordings created in connection with our business activities</td>
                <td>YES</td>
              </tr>
              <tr>
                <td>I. Professional or employment-related information</td>
                <td>Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>J. Education Information</td>
                <td>Student records and directory information</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>K. Inferences drawn from collected personal information</td>
                <td>Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual's preferences and characteristics</td>
                <td>NO</td>
              </tr>
              <tr>
                <td>L. Sensitive personal Information</td>
                <td />
                <td>NO</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>We will use and retain the collected personal information as needed to provide the Services or for:</p>
        <ul>
          <li>Category B - As long as the user has an account with us</li>
          <li>Category C - As long as the user has an account with us</li>
        </ul>
        <p>We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:</p>
        <ul>
          <li>Receiving help through our customer support channels;</li>
          <li>Participation in customer surveys or contests; and</li>
          <li>Facilitation in the delivery of our Services and to respond to your inquiries.</li>
        </ul>
        <p><strong>How do we use and share your personal information?</strong></p>
        <p>Learn about how we use your personal information in the section, "<a href="#how-do-we-process-your-information">HOW DO WE PROCESS YOUR INFORMATION?</a>"</p>
        <p><strong>Will your information be shared with anyone else?</strong></p>
        <p>We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Learn more about how we disclose personal information to in the section, "<a href="#when-and-with-whom-do-we-share-your-personal-information">WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a>"</p>
        <p>We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be "selling" of your personal information.</p>
        <p>We have not disclosed, sold, or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months. We will not sell or share personal information in the future belonging to website visitors, users, and other consumers.</p>
        <h5>California Residents</h5>
        <p>California Civil Code Section 1798.83, also known as the "Shine The Light" law permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.</p>
        <p>If you are under 18 years of age, reside in California, and have a registered account with the Services, you have the right to request removal of unwanted data that you publicly post on the Services. To request removal of such data, please contact us using the contact information provided below and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the Services, but please be aware that the data may not be completely or comprehensively removed from all our systems (e.g., backups, etc.).</p>
        <p><strong><u>CCPA Privacy Notice</u></strong></p>
        <p>This section applies only to California residents. Under the California Consumer Privacy Act (CCPA), you have the rights listed below.</p>
        <p>The California Code of Regulations defines a "residents" as:</p>
        <ol>
          <li>every individual who is in the State of California for other than a temporary or transitory purpose and</li>
          <li>every individual who is domiciled in the State of California who is outside the State of California for a temporary or transitory purpose</li>
        </ol>
        <p>All other individuals are defined as "non-residents."</p>
        <p>If this definition of "resident" applies to you, we must adhere to certain rights and obligations regarding your personal information.</p>
        <p><strong>Your rights with respect to your personal data</strong></p>
        <p><u>Right to request deletion of the data — Request to delete</u></p>
        <p>You can ask for the deletion of your personal information. If you ask us to delete your personal information, we will respect your request and delete your personal information, subject to certain exceptions provided by law, such as (but not limited to) the exercise by another consumer of his or her right to free speech, our compliance requirements resulting from a legal obligation, or any other legal exceptions.</p>
        <p><u>Right to be informed — Request to know</u></p>
        <p>Depending on the circumstances, you have a right to know:</p>
        <ul>
          <li>whether we collect and use your personal information;</li>
          <li>the categories of personal information that we collect;</li>
          <li>the purposes for which the collected personal information is used;</li>
          <li>whether we sell your personal information to third parties;</li>
          <li>the categories of personal information that we sold or disclosed for a business purpose;</li>
          <li>the categories of third parties to whom the personal information was sold or disclosed for a business purpose; and</li>
          <li>the business or commercial purpose for collecting or selling personal information.</li>
        </ul>
        <p>In accordance with applicable law, we are not obligated to provide or delete consumer information that is de-identified in response to a consumer request or to re-identify individual data to verify a consumer request.</p>
        <p><u>Right to Non-Discrimination for the Exercise of a Consumer's Privacy Rights</u></p>
        <p>We will not discriminate against you if you exercise your privacy rights.</p>
        <p><u>Verification process</u></p>
        <p>Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. These verification efforts require us to ask you to provide information so that we can match it with information you have previously provided us. For instance, depending on the type of request you submit, we may ask you to provide certain information so that we can match the information you provide with the information we already have on file, or we may contact you through a communication method (e.g. phone or email) that you have previously provided to us. We may also use other verification methods as the circumstances dictate.</p>
        <p>We will only use personal information provided in your request to verify your identity or authority to make the request. To the extent possible, we will avoid requesting additional information from you for the purposes of verification. If, however, we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity, and for security or fraud-prevention purposes. We will delete such additional information as soon as we finish verifying you.</p>
        <p><u>Other privacy rights</u></p>
        <p>You may object to the processing of your personal data</p>
        <p>You may request correction of your personal data if it is incorrect or no longer relevant, or ask to restrict the processing of the data</p>
        <p>You can designate an authorized agent to make a request under the CCPA on your behalf. We may deny a request from an authorized agent that does not submit proof that they have been validly authorized to act on your behalf in accordance with the CCPA.</p>
        <p>You may request to opt-out from future selling of your personal information to third parties. Upon receiving a request to opt-out, we will act upon the request as soon as feasibly possible, but no later than 15 days from the date of the request submission.</p>
        <p>To exercise these rights, you can contact us by at <a :href="`mailto:legal@${SITE.domain}`">legal@{{ SITE.domain }}</a>, or by referring to the contact details at the bottom of this document. If you have a complaint about how we handle your data, we would like to hear from you.</p>
        <h5>Colorado Residents</h5>
        <p>This section applies only to Colorado residents. Under the Colorado Privacy Act (CPA), you have the rights listed below. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law.</p>
        <ul>
          <li>Right to be informed whether or not we are processing your personal data</li>
          <li>Right to access your personal data</li>
          <li>Right to correct inaccuracies in your personal data</li>
          <li>Right to request deletion of your personal data</li>
          <li>Right to obtain a copy of the personal data you previously shared with us</li>
          <li>Right to opt out of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects ("profiling")</li>
        </ul>
        <p>To submit a request to exercise these rights described above, please email <a :href="`mailto:legal@${SITE.domain}`">legal@{{ SITE.domain }}</a>.</p>
        <p>If we decline to take action regarding your request and you wish to appeal our decision, please email us at <a :href="`mailto:legal@${SITE.domain}`">legal@{{ SITE.domain }}</a>. Within forty-five (45) days of receipt of an appeal, we will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions.</p>
        <h5>Connecticut Residents</h5>
        <p>This section applies only to Connecticut residents. Under the Connecticut Data Privacy Act (CTDPA), you have the rights listed below. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law.</p>
        <ul>
          <li>Right to be informed whether or not we are processing your personal data</li>
          <li>Right to access your personal data</li>
          <li>Right to correct inaccuracies in your personal data</li>
          <li>Right to request deletion of your personal data</li>
          <li>Right to obtain a copy of the personal data you previously shared with us</li>
          <li>Right to opt out of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects ("profiling")</li>
        </ul>
        <p>To submit a request to exercise these rights described above, please email <a :href="`mailto:legal@${SITE.domain}`">legal@{{ SITE.domain }}</a>.</p>
        <p>If we decline to take action regarding your request and you wish to appeal our decision, please email us at <a :href="`mailto:legal@${SITE.domain}`">legal@{{ SITE.domain }}</a>. Within sixty (60) days of receipt of an appeal, we will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions.</p>
        <h5>Utah Residents</h5>
        <p>This section applies only to Utah residents. Under the Utah Consumer Privacy Act (UCPA), you have the rights listed below. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law.</p>
        <ul>
          <li>Right to be informed whether or not we are processing your personal data</li>
          <li>Right to access your personal data</li>
          <li>Right to request deletion of your personal data</li>
          <li>Right to obtain a copy of the personal data you previously shared with us</li>
          <li>Right to opt out of the processing of your personal data if it is used for targeted advertising or the sale of personal data</li>
        </ul>
        <p>To submit a request to exercise these rights described above, please email <a :href="`mailto:legal@${SITE.domain}`">legal@{{ SITE.domain }}</a>.</p>
        <h5>Virginia Residents</h5>
        <p>Under the Virginia Consumer Data Protection Act (VCDPA):</p>
        <p>"Consumer" means a natural person who is a resident of the Commonwealth acting only in an individual or household context. It does not include a natural person acting in a commercial or employment context.</p>
        <p>"Personal data" means any information that is linked or reasonably linkable to an identified or identifiable natural person. "Personal data" does not include de-identified data or publicly available information.</p>
        <p>"Sale of personal data" means the exchange of personal data for monetary consideration.</p>
        <p>If this definition of "consumer" applies to you, we must adhere to certain rights and obligations regarding your personal data.</p>
        <p><u>Your rights with respect to your personal data</u></p>
        <ul>
          <li>Right to be informed whether or not we are processing your personal data</li>
          <li>Right to access your personal data</li>
          <li>Right to correct inaccuracies in your personal data</li>
          <li>Right to request deletion of your personal data</li>
          <li>Right to obtain a copy of the personal data you previously shared with us</li>
          <li>Right to opt out of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects ("profiling")</li>
        </ul>
        <p><u>Verification process</u></p>
        <p>We may request that you provide additional information reasonably necessary to verify you and your consumer's request. If you submit the request through an authorized agent, we may need to collect additional information to verify your identity before processing your request.</p>
        <p>Upon receiving your request, we will respond without undue delay, but in all cases, within forty-five (45) days of receipt. The response period may be extended once by forty-five (45) additional days when reasonably necessary. We will inform you of any such extension within the initial 45-day response period, together with the reason for the extension.</p>
        <p><u>Right to appeal</u></p>
        <p>If we decline to take action regarding your request, we will inform you of our decision and reasoning behind it. If you wish to appeal our decision, please email us at <a :href="`mailto:legal@${SITE.domain}`">legal@{{ SITE.domain }}</a>. Within sixty (60) days of receipt of an appeal, we will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions. If your appeal is denied, you may contact the <NuxtLink to="https://www.oag.state.va.us/consumer-protection/index.php/file-a-complaint" target="_blank">Attorney General to submit a complaint</NuxtLink>.</p>
      </section>
      <section id="do-we-make-updates-to-this-notice">
        <h4>12. DO WE MAKE UPDATES TO THIS NOTICE?</h4>
        <p><strong>In Short:</strong> Yes, we will update this notice as necessary to stay compliant with relevant laws.</p>
        <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.</p>
      </section>
      <section id="how-can-you-contact-us-about-this-notice">
        <h4>13. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h4>
        <p>If you have questions or comments about this notice, you may email us at <a :href="`mailto:legal@${SITE.domain}`">legal@{{ SITE.domain }}</a>.</p>
      </section>
      <section id="how-can-you-review-update-or-delete-the-data-we-collect-from-you">
        <h4>14. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h4>
        <p>You have the right to request access to the personal information we collect from you, change that information, or delete it.</p>
        <h5>Data Deletion</h5>
        <p>You can request to delete your account and associated data for this Service using the in-app account settings deletion option or by accessing the web-based deletion resource at <NuxtLink to="/account-data?request=delete">{{ SITE.host }}/account-data?request=delete</NuxtLink>.</p>
        <p>When you delete your account, all your data is deleted from the server. This includes your name, email address, passwords, birth date, avatar, and any additional data related to your account. We do not keep any data from you.</p>
        <h5>Data Review</h5>
        <p>You can request to review your account and associated data for this Service using the in-app account settings review option or by accessing the web-based review resource at <NuxtLink to="/account-data?request=review">{{ SITE.host }}/account-data?request=review</NuxtLink>.</p>
        <h5>Data Update</h5>
        <p>For updating your data, you should log in to your account and update your user account settings.</p>
      </section>
    </div>
  </main>
</template>
