import styled from "@emotion/styled"

import memepadImage from "assets/images/memepad.webp"
import memepadImage2x from "assets/images/memepad@2x.webp"
import memepadImageMobile from "assets/images/memepad-mobile.webp"
import { theme } from "theme"

export const SContainer = styled.div`
  position: absolute;
  right: 20px;
  top: 0;
  pointer-events: none;

  @media ${theme.viewport.gte.sm} {
    position: relative;

    margin-top: -200px;
    margin-left: 80px;
  }
`

export const SBottleCaps = styled.div`
  position: relative;

  max-width: 100%;

  width: 75px;
  height: 100px;

  background-size: 100%;
  background-position: top;
  background-repeat: no-repeat;
  background-image: url(${memepadImageMobile});

  @media ${theme.viewport.gte.sm} {
    width: 350px;
    height: 500px;

    background-image: url(${memepadImage});

    @media only screen and (min-device-pixel-ratio: 2),
      only screen and (min-resolution: 2dppx) {
      background-image: url(${memepadImage2x});
    }
  }
`
