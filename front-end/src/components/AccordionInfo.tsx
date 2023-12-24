"use client";

import { Disclosure } from "@/app/(landing-page)/headlessui";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

const DEMO_DATA = [
  {
    name: "Bảo hành",
    content: `<ul class="list-disc list-inside leading-7">
    <li>
    5 year warranty on all hardware
    </li>
    <li>
    1 year warranty on all other elements
    </li>
    <li>
    With a 5 year warranty on all hardware and 1 year warranty on all other elements, you can be sure that your essentials are built to last.
    </li>
  </ul>`,
  },
  {
    name: "FAQ",
    content: `
    <ul class="list-disc list-inside leading-7">
    <li>All full-priced, unworn items, with tags attached and in their original packaging are eligible for return or exchange within 30 days of placing your order.</li>
    <li>
    Please note, packs must be returned in full. We do not accept partial returns of packs.
    </li>
    <li>
    Want to know our full returns policies? Here you go.
    </li>
    <li>
    Want more info about shipping, materials or care instructions? Here!
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
