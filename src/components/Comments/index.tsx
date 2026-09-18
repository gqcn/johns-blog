import { useColorMode } from "@docusaurus/theme-common";
import Giscus from "@giscus/react";

// https://rikublock.dev/docs/tutorials/giscus-integration/
export default function Comments(): JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <div className="docusaurus-mt-lg">
      <Giscus
        id="comments"
        repo="gqcn/johns-blog"
        repoId="R_kgDON_w4iA"
        category="General"
        categoryId="DIC_kwDON_w4iM4CnWx-"
        mapping="pathname"
        strict="1"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={colorMode === "dark" ? "dark_tritanopia" : "light_tritanopia"}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
