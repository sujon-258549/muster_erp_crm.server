export const SubscriptionConstants = {
  DEFAULT_LIMIT: 10,
  DEFAULT_SORT: "desc",
};


// Subscription is now a pure instance — all plan-detail fields live on the
// related SubscriptionPlan. Keep searchable to instance fields only.
export const subscriptionSearchableFields = ["notes"]

export const subscriptionFilterableFields = [
  "branchId",
  "planId",
  "isActive",
  "isDeleted",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
]
