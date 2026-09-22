export type Spec = { label: string; value: string };
export type MaterialGroup = { part: string; options: string[] };

export type Category = {
  id: string;
  parent_id: string | null;
  slug: string;
  name: string;
  summary: string | null;
  description: string | null;
  illustration: string | null;
  image_url: string | null;
  sort_order: number;
  is_published: boolean;
};

export type CategoryNode = Category & { children: CategoryNode[] };

export type Product = {
  id: string;
  category_id: string;
  slug: string;
  code: string;
  name: string;
  summary: string | null;
  description: string | null;
  specs: Spec[];
  materials: MaterialGroup[];
  features: string[];
  applications: string[];
  standards: string[];
  equivalents: string[];
  industries: string[];
  illustration: string | null;
  image_url: string | null;
  gallery: string[];
  datasheet_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductCard = Pick<Product, "id" | "slug" | "code" | "name" | "summary" | "illustration" | "image_url" | "category_id">;

export type InquiryKind = "contact" | "quote";
export type InquiryStatus = "new" | "in_progress" | "answered" | "closed" | "spam";

export type QuoteItem = {
  product_id?: string | null;
  slug?: string | null;
  code: string;
  name: string;
  quantity: number;
  note?: string;
  /** Thumbnail shown in the visitor's quote list (not stored). */
  image?: string;
};

export type Inquiry = {
  id: string;
  kind: InquiryKind;
  status: InquiryStatus;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  subject: string | null;
  message: string | null;
  items: QuoteItem[];
  details: Record<string, string>;
  admin_notes: string | null;
  source_url: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
};

export type Settings = {
  notification_emails: string[];
  email_notifications: boolean;
  push_notifications: boolean;
  company_phone: string | null;
  company_whatsapp: string | null;
  company_email: string | null;
  company_address: string | null;
  company_maps_url: string | null;
  working_hours: string | null;
};

export type PublicSettings = Pick<Settings, "company_phone" | "company_whatsapp" | "company_email" | "company_address" | "company_maps_url" | "working_hours">;
