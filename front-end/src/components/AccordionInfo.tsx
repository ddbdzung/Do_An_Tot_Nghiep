"use client";

import { Disclosure } from "@/app/(landing-page)/headlessui";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

const DEMO_DATA = [
  {
    name: "Bảo hành",
    content: `<ul class="list-disc list-inside leading-7">
    <li>
    5 năm bảo hành cho tất cả phụ kiện
    </li>
    <li>
    1 năm bảo hành cho tất cả các phần khác
    </li>
    <li>
    Với chính sách bảo hành 5 năm cho tất cả phần cứng và 1 năm cho tất cả các thành phần khác, quý khách hoàn toàn có thể tin tưởng rằng các sản phẩm cần thiết của mình đã được xây dựng để có tuổi thọ cao.
    </li>
  </ul>`,
  },
  {
    name: "FAQ",
    content: `
    <ul class="list-disc list-inside leading-7">
    <li>
    Tất cả các sản phẩm chưa qua sử dụng, có thẻ treo và trong bao bì gốc của chúng tôi đều có thể được trả lại hoặc trao đổi trong vòng 30 ngày kể từ khi đặt hàng.
    </li>
    <li>
    Hãy lưu ý, các sản phẩm phải được trả về đầy đủ. Chúng tôi không chấp nhận trả lại một phần của các sản phẩm.
    </li>
    <li>
    Bạn có thể xem chính sách hoàn trả của chúng tôi tại đây.
    </li>
    <li>
    Để biết thêm thông tin về vận chuyển, vật liệu hoặc hướng dẫn chăm sóc? Ở đây!
    </li>
  </ul>
    `,
  },
];

interface Props {
  panelClassName?: string;
  data?: typeof DEMO_DATA;
}

const AccordionInfo: FC<Props> = ({
  panelClassName = "p-4 pt-3 last:pb-0 text-slate-600 text-sm dark:text-slate-300 leading-6",
  description,
  data = DEMO_DATA,
}) => {
  const dataToRender = description
    ? [{ name: "Mô tả", content: description }, ...data]
    : data;
  return (
    <div className="w-full rounded-2xl space-y-2.5">
      {/* ============ */}
      {dataToRender.map((item, index) => {
        return (
          <Disclosure key={index} defaultOpen={index < 2}>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full px-4 py-2 font-medium text-left bg-slate-100/80 hover:bg-slate-200/60 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-75 ">
                  <span>{item.name}</span>
                  {!open ? (
                    <PlusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  ) : (
                    <MinusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  )}
                </Disclosure.Button>
                <Disclosure.Panel
                  className={panelClassName}
                  as="div"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                ></Disclosure.Panel>
              </>
            )}
          </Disclosure>
        );
      })}

      {/* ============ */}
    </div>
  );
};

export default AccordionInfo;
