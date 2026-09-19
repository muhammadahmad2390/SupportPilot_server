export type policy = {
  id: string;
  title: string;
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
