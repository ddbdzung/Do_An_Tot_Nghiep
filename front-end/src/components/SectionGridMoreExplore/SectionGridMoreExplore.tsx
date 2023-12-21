"use client";

import React, { FC, useState } from "react";
import CardCategory1 from "@/components/CardCategories/CardCategory1";
import CardCategory4 from "@/components/CardCategories/CardCategory4";
import Heading from "@/components/Heading/Heading";
import NavItem2 from "@/components/NavItem2";
import Nav from "@/shared/Nav/Nav";
import CardCategory6 from "@/components/CardCategories/CardCategory6";
import { DEMO_MORE_EXPLORE_DATA, ExploreType } from "./data";
import explore1Svg from "@/images/collections/explore1.svg";
import explore3Svg from "@/images/collections/explore3.svg";
import explore4Svg from "@/images/collections/explore4.svg";
import explore5Svg from "@/images/collections/explore5.svg";
import explore7Svg from "@/images/collections/explore7.svg";
import explore9Svg from "@/images/collections/explore9.svg";
import { renderImageCloudinary } from "@/utils/renderImage";

const randomExploreSvg = () => {
  const x = [
    explore1Svg,
    explore3Svg,
    explore4Svg,
    explore5Svg,
    explore7Svg,
    explore9Svg,
  ];
  return x[Math.floor(Math.random() * x.length)];
};

export type CateWithMeta = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  productCount: number;
};

export interface SectionGridMoreExploreProps {
  className?: string;
  gridClassName?: string;
  boxCard?: "box1" | "box4" | "box6";
  data?: ExploreType[];
  cates?: CateWithMeta;
}

const SectionGridMoreExplore: FC<SectionGridMoreExploreProps> = ({
  className = "",
  boxCard = "box4",
  gridClassName = "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  data = DEMO_MORE_EXPLORE_DATA.filter((_, i) => i < 6),
  cates,
}) => {
  const [tabActive, setTabActive] = useState("Man");

  const renderCard = (item: ExploreType) => {
    // switch (boxCard) {
    //   case "box1":
    //     return (
    //       <CardCategory1 key={item.id} featuredImage={item.image} {...item} />
    //     );

    //   case "box4":
    //     return (
    //       <CardCategory4
    //         bgSVG={item.svgBg}
    //         featuredImage={item.image}
    //         key={item.id}
    //         color={item.color}
    //         {...item}
    //       />
    //     );
    //   case "box6":
    //     return (
    //       <CardCategory6
    //         bgSVG={item.svgBg}
    //         featuredImage={item.image}
    //         key={item.id}
    //         color={item.color}
    //         {...item}
    //       />
    //     );

    //   default:
    //     return (
    //       <CardCategory4
    //         bgSVG={item.svgBg}
    //         featuredImage={item.image}
    //         key={item.id}
    //         color={item.color}
    //         {...item}
    //       />
    //     );
    // }
    return (
      <CardCategory4
        bgSVG={randomExploreSvg()}
        featuredImage={renderImageCloudinary(item.images?.at(0)?.url) || ""}
        key={item.id}
        color="bg-orange-50"
        {...item}
      />
    );
  };

  const renderHeading = () => {
    return (
      <div>
        <Heading
          className="mb-12 lg:mb-14 text-neutral-900 dark:text-neutral-50"
          fontClass="text-3xl md:text-4xl 2xl:text-5xl font-semibold"
          isCenter
          desc=""
        >
          Bắt đầu khám phá.
        </Heading>
        <Nav
          className="p-1 bg-white dark:bg-neutral-800 rounded-full shadow-lg overflow-x-auto hiddenScrollbar"
          containerClassName="mb-12 lg:mb-14 relative flex justify-center w-full text-sm md:text-base"
        >
          {[
            {
              name: "Máy lọc nước",
              icon: ``,
            },
            {
              name: "Vòi lấy nước",
              icon: ``,
            },
            {
              name: "Lõi lọc nước",
              icon: ``,
            },
            {
              name: "Adapter",
              icon: ``,
            },
            {
              name: "Đèn UV diệt khuẩn",
              icon: ``,
            },
          ].map((item, index) => (
            <NavItem2
              key={index}
              isActive={tabActive === item.name}
              onClick={() => setTabActive(item.name)}
            >
              <div className="flex items-center justify-center space-x-1.5 sm:space-x-2.5 text-xs sm:text-sm ">
                <span
                  className="inline-block"
                  dangerouslySetInnerHTML={{ __html: item.icon }}
                ></span>
                <span>{item.name}</span>
              </div>
            </NavItem2>
          ))}
        </Nav>
      </div>
    );
  };

  return (
    <div className={`nc-SectionGridMoreExplore relative ${className}`}>
      {renderHeading()}
      <div className={`grid gap-4 md:gap-7 ${gridClassName}`}>
        {cates?.map((item) => renderCard(item))}
      </div>
    </div>
  );
};

export default SectionGridMoreExplore;
