import { css, DefaultTheme } from 'styled-components/macro';

import { MEDIA_WIDTHS } from 'shared/constant';

const mediaWidthTemplates: {
  [width in keyof typeof MEDIA_WIDTHS]: typeof css;
} = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
  (accumulator as any)[size] = (a: any, b: any, c: any) => css`
    @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
      ${css(a, b, c)}
    }
  `;
  return accumulator;
}, {}) as any;

export interface ThemeColors {
  black: string,
  blackOp015: string,
  white: string,
  pink: string,
  pinkOp01: string,
  darkPink: string,
  darkPinkHv: string,
  darkPinkActive: string,
  pinkHover: string,
  pinkActive: string,
  lightPink: string,
  lightPinkHover: string,
  lightPinkActive: string,

  gray: string,
  grayOp01: string,
  grayOp04: string,
  grayOp06: string,
  grayLine: string,
  lightRed: string,

  statusOpenBg: string,
  statusSoonBg: string,
  statusEndedBg: string,
  statusOpenText: string,
  statusSoonText: string,
  statusEndedText: string,

  boxShadowCard: string,
  pinkBgFooter: string,
  pinkCircle: string,
  cardDescription: string,
  placeholder: string,
  boxShadowInput: string,
  transparent: string,
}

export const colors: ThemeColors = {
  black: '#000000',
  blackOp015: 'rgba(0, 0, 0, 0.15)',
  white: '#FFFFFF',
  pink: '#BC439A',
  pinkOp01: '#F8ECF5',
  darkPink: '#572649',
  darkPinkHv: '#461E3A',
  darkPinkActive: '#38182E',
  pinkHover: '#B23990',
  pinkActive: '#A82F86',
  lightPink: 'rgba(188, 67, 154, 0.1)',
  lightPinkHover: 'rgba(188, 67, 154, 0.2)',
  lightPinkActive: 'rgba(188, 67, 154, 0.3)',

  gray: '#8E939A',
  grayOp01: '#F4F4f5',
  grayOp04: '#D2D4D7',
  grayOp06: '#BBBEC2',
  grayLine: '#8E939A',
  lightRed: '#F86069',

  statusOpenBg: '#DCEED1',
  statusSoonBg: '#FDE9CC',
  statusEndedBg: '#E8E9EB',
  statusOpenText: '#51A81B',
  statusSoonText: '#F49302',
  statusEndedText: '#8E939A',

  boxShadowCard: 'rgba(19, 19, 19, 0.2)',
  pinkBgFooter: '#F8ECF5',
  pinkCircle: '#BC439A',
  cardDescription: '#676C73',
  placeholder: '#F0F1F3',
  boxShadowInput: 'rgba(188, 67, 154, 0.1)',
  transparent: 'transparent',
};

function theme(): DefaultTheme {
  return {
    ...colors,
    // media queries
    mediaWidth: mediaWidthTemplates,
  };
}

export default theme;
