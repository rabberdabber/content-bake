import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "MDX Editor",
  description: "Bite Sized Blog by bake.",
};

const DynamicComponentWithNoSSR = dynamic(() => import("./editor"), {
  ssr: false,
});

export default () => <DynamicComponentWithNoSSR />;
