import type { IndustryCategory } from "./industries-data";
import automotive from "../assets/industry-directory-automotive.png";
import food from "../assets/industry-directory-food.png";
import retail from "../assets/industry-directory-retail.png";
import healthcare from "../assets/industry-directory-healthcare.png";
import beauty from "../assets/industry-directory-beauty.png";
import fitness from "../assets/industry-directory-fitness.png";
import education from "../assets/industry-directory-education.png";
import travel from "../assets/industry-directory-travel.png";
import realEstate from "../assets/industry-directory-real-estate.png";
import interiors from "../assets/industry-directory-interiors.png";
import tech from "../assets/industry-directory-tech.png";
import fashion from "../assets/industry-directory-fashion.png";
import creative from "../assets/industry-directory-creative.png";
import logistics from "../assets/industry-directory-logistics.png";

const photos: Partial<Record<IndustryCategory, string>> = {
  "Automotive & Transport": automotive,
  "Food & Beverage": food,
  "Retail & Grocery": retail,
  "Healthcare & Wellness": healthcare,
  "Beauty & Personal Care": beauty,
  "Fitness & Sports": fitness,
  "Education & Training": education,
  "Hospitality & Travel": travel,
  "Real Estate & Construction": realEstate,
  "Home & Interiors": interiors,
  "Electronics & Technology": tech,
  "Fashion & Lifestyle": fashion,
  "Creative & Marketing": creative,
  "Logistics & Delivery": logistics,
};

/** Returns one title-matched panel from a ten-photo, two-row source sheet. */
export const getDirectoryIndustryPhoto = (category: IndustryCategory, index: number) => {
  const src = photos[category];
  if (!src) return null;
  const column = index % 5;
  const row = Math.floor(index / 5) % 2;
  return {
    src,
    crop: `${column === 0 ? "0%" : column === 1 ? "25%" : column === 2 ? "50%" : column === 3 ? "75%" : "100%"} ${row === 0 ? "0%" : "100%"}`,
    imageSize: "500% 200%",
  };
};
