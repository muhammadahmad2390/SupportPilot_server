export type policy = {
  title: string;
  content: string;
  category:
    | "returns"
    | "shipping"
    | "warranty"
    | "faq"
    | "technical"
    | "internal";
};

export type policyResponse = {
  title: string;
  slug: string;
  content: string;
  category:
    | "returns"
    | "shipping"
    | "warranty"
    | "faq"
    | "technical"
    | "internal";
  updatedBy: string;
};
