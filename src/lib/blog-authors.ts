export type BlogEditorialAuthor = {
  name: string;
  role: string;
};

// These are editorial bylines for the public insight library. They keep the
// public-facing articles separate from internal administrator accounts.
const editorialAuthors: BlogEditorialAuthor[] = [
  { name: "Ananya Reddy", role: "Digital Strategy Editor" },
  { name: "Arjun Kumar", role: "Technology Writer" },
  { name: "Kavya Nair", role: "Growth & SEO Editor" },
  { name: "Rohan Mehta", role: "Product & Cloud Writer" },
  { name: "Priya Sharma", role: "Customer Experience Editor" },
];

function stableNumber(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

export function getBlogEditorialAuthor(slug: string): BlogEditorialAuthor {
  return editorialAuthors[stableNumber(slug) % editorialAuthors.length];
}
