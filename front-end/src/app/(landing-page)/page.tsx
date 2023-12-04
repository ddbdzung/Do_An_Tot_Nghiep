import React from "react";
import SectionHowItWork from "@/components/SectionHowItWork/SectionHowItWork";
import BackgroundSection from "@/components/BackgroundSection/BackgroundSection";
import SectionPromo1 from "@/components/SectionPromo1";
import SectionHero2 from "@/components/SectionHero/SectionHero2";
import SectionSliderLargeProduct from "@/components/SectionSliderLargeProduct";
import SectionSliderProductCard from "@/components/SectionSliderProductCard";
import DiscoverMoreSlider from "@/components/DiscoverMoreSlider";
import SectionGridMoreExplore from "@/components/SectionGridMoreExplore/SectionGridMoreExplore";
import SectionPromo2 from "@/components/SectionPromo2";
import SectionSliderCategories from "@/components/SectionSliderCategories/SectionSliderCategories";
import SectionPromo3 from "@/components/SectionPromo3";
import SectionClientSay from "@/components/SectionClientSay/SectionClientSay";
import Heading from "@/components/Heading/Heading";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import { PRODUCTS, REAL_PRODUCTS, SPORT_PRODUCTS } from "@/data/data";
import SectionGridFeatureItems from "@/components/SectionGridFeatureItems";
import SectionMagazine5 from "@/app/(landing-page)/blog/SectionMagazine5";
import { customAxios } from "@/http-service/fetchAPI";
import { GET_PRODUCTS } from "@/api/product/endpoints";
import { GET_CATEGORIES_WITH_METADATA } from "@/api/category/endpoints";

const fetchSampleProducts = async () => {
  const res = await customAxios.get(
    GET_PRODUCTS({
      limit: 8,
    })
  );
  const sampleProducts = res.data.data.results;
  return sampleProducts;
};

const fetchCategoriesWithMetadata = async () => {
  const res = await customAxios.get(
    GET_CATEGORIES_WITH_METADATA({
      limit: 5,
    })
  );
  const categories = res.data.data.results;
  return categories;
};

async function PageHome() {
  const [sampleProducts, categories] = await Promise.all([
    fetchSampleProducts(),
    fetchCategoriesWithMetadata(),
  ]);

  return (
    <div className="nc-PageHome relative overflow-hidden">
      <SectionHero2 />

      <div className="mt-24 lg:mt-32">
        <DiscoverMoreSlider />
      </div>

      <div className="container relative space-y-24 my-24 lg:space-y-32 lg:my-32">
        <SectionSliderProductCard
          data={sampleProducts}
          // data={[REAL_PRODUCTS[0]]}
          // data={[
          //   PRODUCTS[4],
          //   SPORT_PRODUCTS[5],
          //   PRODUCTS[7],
          //   SPORT_PRODUCTS[1],
          //   PRODUCTS[6],
          // ]}
        />

        <div className="py-24 lg:py-32 border-t border-b border-slate-200 dark:border-slate-700">
          <SectionHowItWork />
        </div>
        <SectionPromo1 />

        <div className="relative py-24 lg:py-32">
          <BackgroundSection />
          <SectionGridMoreExplore cates={categories} />
        </div>

        <SectionSliderProductCard
          heading="Best Sellers"
          subHeading="Best selling of the month"
        />

        <SectionPromo2 />
        {/* 
        <SectionSliderLargeProduct cardStyle="style2" />

        <SectionSliderCategories /> */}

        <SectionPromo3 />

        {/* <SectionGridFeatureItems /> */}

        {/* <div className="relative py-24 lg:py-32">
          <BackgroundSection />
          <div>
            <Heading rightDescText="From the Ciseco blog">
              The latest news
            </Heading>
            <SectionMagazine5 />
            <div className="flex mt-16 justify-center">
              <ButtonSecondary>Show all blog articles</ButtonSecondary>
            </div>
          </div>
        </div> */}
        <SectionClientSay />
      </div>
    </div>
  );
}

export default PageHome;
