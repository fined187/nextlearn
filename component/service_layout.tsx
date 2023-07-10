import Head from "next/head";
import GNB from "./GNB";
import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

export const ServiceLayout: React.FC<Props & BoxProps> = function ({
  title = "blah x2",
  children,
  ...boxProps
}) {
  return (
    <Box {...boxProps}>
      <Head>
        <title>{title}</title>
      </Head>
      <GNB />
      {children}
    </Box>
  );
};
