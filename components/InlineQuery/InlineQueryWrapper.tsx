"use client";

import dynamic from "next/dynamic";

const InlineQuery = dynamic(
  () => import("@/components/InlineQuery/InlineQuery"),
  {
    ssr: false,
  }
);

export default InlineQuery;
