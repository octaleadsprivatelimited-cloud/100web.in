import type { IndustryCategory } from "./industries-data";
import set01 from "../assets/industry-photo-set-01.png";
import set02 from "../assets/industry-photo-set-02.png";
import set03 from "../assets/industry-photo-set-03.png";
import set04 from "../assets/industry-photo-set-04.png";
import set05 from "../assets/industry-photo-set-05.png";
import set06 from "../assets/industry-photo-set-06.png";
import set07 from "../assets/industry-photo-set-07.png";

export type IndustryPhoto = { src: string; crop: string; imageSize: string };

const row = (src: string, rowIndex: number): IndustryPhoto[] =>
  ["0%", "50%", "100%"].map((x) => ({
    src,
    crop: `${x} ${rowIndex === 0 ? "0%" : rowIndex === 1 ? "33.333%" : rowIndex === 2 ? "66.667%" : "100%"}`,
    imageSize: "300% 400%",
  }));

const sets: Record<IndustryCategory, IndustryPhoto[]> = {
  "Automotive & Transport": row(set01, 0),
  "Food & Beverage": row(set01, 1),
  "Retail & Grocery": row(set01, 2),
  "Healthcare & Wellness": row(set01, 3),
  "Beauty & Personal Care": row(set02, 0),
  "Fitness & Sports": row(set02, 1),
  "Education & Training": row(set02, 2),
  "Hospitality & Travel": row(set02, 3),
  "Real Estate & Construction": row(set03, 0),
  "Home & Interiors": row(set03, 1),
  "Electronics & Technology": row(set03, 2),
  "Fashion & Lifestyle": row(set03, 3),
  "Creative & Marketing": row(set04, 0),
  "Logistics & Delivery": row(set04, 1),
  "Finance & Legal": row(set04, 2),
  Agriculture: row(set04, 3),
  "Local Services": row(set05, 0),
  "Community & Non-Profit": row(set05, 1),
  "Manufacturing & Industrial": row(set05, 2),
  "Energy & Utilities": row(set05, 3),
  "Pets & Plants": row(set06, 0),
  "Business Services": row(set06, 1),
  "Media & Entertainment": row(set06, 2),
  "Waste & Recycling": row(set06, 3),
  "Materials & Mining": row(set07, 0),
  "Trade & Commerce": row(set07, 1),
  "Marine & Aviation": row(set07, 2),
  Telecom: row(set07, 3),
};

/** Real, category-specific photography used throughout the industries experience. */
export const getIndustryPhotos = (category: IndustryCategory) => sets[category];
