export const SUBSCRIPTION = {
  pricing: {
    plans: {
      free: {
        name: "free",
        price: 0,
        features: [
          { name: "share_public_map" },
          { name: "free_markers_quota", quota: Quota.FREE_MARKERS },
          { name: "free_image_upload_quota", quota: Quota.FREE_IMAGE_FILESIZE.replace("MB", t("mb")) },
          { name: "free_summary" },
          { name: "email_support" }
        ]
      },
      premium: {
        name: "premium",
        price: 2,
        features: [
          { name: "share_public_map" },
          { name: "premium_markers_quota" },
          { name: "premium_image_upload_quota", quota: Quota.PREMIUM_IMAGE_FILESIZE.replace("MB", t("mb")) },
          { name: "premium_summary" },
          { name: "email_support" }
        ]
      }
    }
  }
};
