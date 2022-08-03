import { css } from "styled-components/macro";
import { theme } from "theme";

type NumOrAuto = number | "auto";

export type MarginProps = {
  mt?: NumOrAuto;
  mr?: NumOrAuto;
  mb?: NumOrAuto;
  ml?: NumOrAuto;
  m?: number | string;
};
export type PaddingProps = {
  pt?: number;
  pr?: number;
  pb?: number;
  pl?: number;
  p?: number | string;
};

const autoOrPx = (val: NumOrAuto) => {
  if (val === "auto") return val;
  return val + "px";
};

export type SizeProps = {
  width?: number;
  height?: number;
};

type Color = keyof typeof theme.colors;

export type ColorProps = {
  color?: Color;
  bg?: Color;
};

export type FlexProps = {
  align?: string;
  justify?: string;
  flex?: boolean;
  gap?: number;
  acenter?: boolean;
  spread?: boolean;
  column?: boolean;
  wrap?: boolean;
  even?: boolean;
  grow?: boolean;
  stretch?: boolean;
  relative?: boolean;
  center?: boolean;
};

export const margins = css<MarginProps>`
  ${(p) => p.mt && `margin-top: ${autoOrPx(p.mt)}`};
  ${(p) => p.mr && `margin-right: ${autoOrPx(p.mr)}`};
  ${(p) => p.mb && `margin-bottom: ${autoOrPx(p.mb)}`};
  ${(p) => p.ml && `margin-left: ${autoOrPx(p.ml)}`};
  ${(p) => p.m && `margin: ${typeof p.m === "string" ? p.m : `${p.m}`}px`};
`;

export const paddings = css<PaddingProps>`
  ${(p) => p.p && `padding: ${p.p}px`};
  ${(p) => p.pt && `padding-top: ${p.pt}px`};
  ${(p) => p.pr && `padding-right: ${p.pr}px`};
  ${(p) => p.pb && `padding-bottom: ${p.pb}px`};
  ${(p) => p.pl && `padding-left: ${p.pl}px`};
`;

export const size = css<SizeProps>`
  ${(p) => p.width && `width: ${p.width}px`};
  ${(p) => p.height && `height: ${p.height}px`};
`;

export const flex = css<FlexProps>`
  ${(p) =>
    p.align &&
    `
      align-items: ${p.align};
    `};
  ${(p) =>
    p.justify &&
    `
      justify-content: ${p.justify};
    `};
  ${(p) =>
    p.gap &&
    `
      gap: ${p.gap}px;
    `};

  ${(p) =>
    p.flex &&
    `
    display: flex;
  `};

  ${(p) =>
    p.acenter &&
    `
    align-items: center;
  `};

  ${(p) =>
    p.spread &&
    `
    justify-content: space-between;
  `};

  ${(p) =>
    p.column &&
    `
    flex-direction: column;
  `};

  ${(p) =>
    p.wrap &&
    `
    flex-wrap: wrap;
    `};

  ${(p) =>
    p.even &&
    `
      > * {
        flex: 1;
      }
    `}

  ${(p) =>
    p.grow &&
    `
      flex: 1 1 1px;
    `}
  ${(p) =>
    p.stretch &&
    `
      width: 100%;
    `}
  ${(p) =>
    p.relative &&
    `
      position: relative;
    `}
  ${(p) =>
    p.center &&
    `
      margin-left: auto;
      margin-right: auto;
    `}
`;

export const colors = css<ColorProps>`
  ${(p) => p.color && `color: ${theme.colors[p.color]}`}
  ${(p) => p.bg && `background: ${theme.colors[p.bg]}`}
`;
