import type { DefaultTheme } from "vitepress/theme";

export const sidebar: DefaultTheme.Sidebar = [
  {
    text: "Looking for help",
    collapsed: false,
    items: [
      {
        text: "Technical Support",
        items: [
          { text: "🚩 I want to report a bug", link: "/support/bug-report" },
          { text: "✅ Basic troubleshooting", link: "/support/basic" }
        ]
      },
      {
        text: "Contribute",
        items: [
          { text: "💡 Suggest new features", link: "/contribute/suggest-features" }
        ]
      }
    ]
  },
  {
    text: "Using the App",
    collapsed: false,
    items: [
      {
        text: "Account",
        items: [
          { text: "😎 Create an account", link: "/account/sign-up" },
          { text: "🗝️ Change password", link: "/account/change-password" },
          { text: "💟 Link our accounts", link: "/account/link-accounts" },
          { text: "🛑 Delete my account", link: "/account/delete-account" },
          { text: "🔓 Account recovery", link: "/account/account-recovery" }
        ]
      },
      {
        text: "Mapping",
        items: [
          { text: "📍 Markers", link: "/mapping/markers" },
          { text: "📝 Stories", link: "/mapping/stories" },
          { text: "🗺️ Public map", link: "/mapping/public-map" }
        ]
      },
      {
        text: "Premium",
        items: [
          { text: "🚀 Upgrade to Premium", link: "/premium/upgrade" },
          { text: "🔧 Manage subscription", link: "/premium/manage-subscription" },
          { text: "📅 Billing history", link: "/premium/billing-history" }
        ]
      }
    ]
  }
];
