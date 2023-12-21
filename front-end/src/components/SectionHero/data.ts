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
    heading: "Máy lọc nước cho mọi nhà",
    subHeading: "Vào năm nay, chúng tôi phân phối những sản phẩm tốt nhất 🔥",
    btnText: "Khám phá ngay",
    btnLink: "/",
  },
  {
    image: imageRightPng3,
    heading: "Máy lọc nước cho mọi nhà",
    subHeading: "Vào năm nay, chúng tôi phân phối những sản phẩm tốt nhất 🔥",
    btnText: "Khám phá ngay",
    btnLink: "/",
  },
  {
    image: imageRightPng,
    heading: "Máy lọc nước cho mọi nhà",
    subHeading: "Vào năm nay, chúng tôi phân phối những sản phẩm tốt nhất 🔥",
    btnText: "Khám phá ngay",
    btnLink: "/",
  },
];
