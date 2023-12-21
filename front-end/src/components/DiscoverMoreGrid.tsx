import React from "react";
import CardCategory2 from "./CardCategories/CardCategory2";
import Heading from "./Heading/Heading";
import img1 from "@/images/discover-more-1.png";
import img2 from "@/images/discover-more-2.png";
import img3 from "@/images/discover-more-3.png";

const CATS_DISCOVER = [
  {
    name: "Khám phá sản phẩm mới",
    desc: "Trải nghiệm các sản phẩm mới nhất của chúng tôi",
    featuredImage: img1,
  },
  {
    name: "Thẻ quà tặng kỹ thuật số",
    desc: "Tặng người thân và bạn bè của bạn",
    featuredImage: img2,
    //   "https://images.pexels.com/photos/45238/gift-made-surprise-loop-45238.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "Sản phẩm giảm giá",
    desc: "Lên đến 50% cho các sản phẩm được chọn",
    featuredImage: img3,
  },
];

const DiscoverMoreGrid = () => {
  return (
    <div className="nc-DiscoverMoreGrid relative">
      <Heading
        className="mb-12 text-neutral-900 dark:text-neutral-50"
        desc=""
        isCenter
        rightDescText="Good things are waiting for you"
      >
        Khám phá thêm.
      </Heading>
      <div className="relative grid grid-cols-3 gap-8">
        {CATS_DISCOVER.map((item, index) => (
          <CardCategory2
            key={index}
            name={item.name}
            desc={item.desc}
            featuredImage={item.featuredImage}
          />
        ))}
      </div>
    </div>
  );
};

export default DiscoverMoreGrid;
