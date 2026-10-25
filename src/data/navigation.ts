export interface NavItem {
  label: string;
  href: "/" | "/work" | "/studio" | "/contact";
}

export const primaryNav: readonly NavItem[] = [
  { label: "Work", href: "/work" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "/contact" },
];

export const menuNav: readonly NavItem[] = [{ label: "Home", href: "/" }, ...primaryNav];
