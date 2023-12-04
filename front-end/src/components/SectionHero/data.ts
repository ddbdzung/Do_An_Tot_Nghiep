import Image, { StaticImageData } from "next/image";
import { Route } from "@/routers/types";
// import imageRightPng from "@/images/hero-right.png";
import imageRightPng from "@/images/water-purifier/water-purifier-banner-e118-1.png";
import imageRightPng2 from "@/images/water-purifier/water-purifier-banner-kaq-l08.png";
import imageRightPng3 from "@/images/water-purifier/water-purifier-banner-karofi-khy-tn88.png";

interface Hero2DataType {
  image: StaticImageData | string;
  heading: string;
  subHeading: string;
  btnText: string;
  btnLink: Route;
}

export const HERO2_DEMO_DATA: Hero2DataType[] = [
  {
    image: imageRightPng2,
    heading: "Water purifier for everyone",
    subHeading: "In this year, we have the best 🔥",
    btnText: "Explore now",
    btnLink: "/",
  },
  {
    image: imageRightPng3,
    heading: "Water purifier for everyone",
    subHeading: "In this year, we have the best 🔥",
    btnText: "Explore now",
    btnLink: "/",
  },
  {
    image: imageRightPng,
    heading: "Water purifier for everyone",
    subHeading: "In this year, we have the best 🔥",
    btnText: "Explore now",
    btnLink: "/",
  },
];
