import React, { memo, useEffect, useState, VFC, VFCX } from "react";
import styled from "@emotion/styled";
import { CompactPicker, ColorChangeHandler, TwitterPicker } from "react-color";
import { Dialog, Button, IconButton } from "@material-ui/core";
import BorderColorIcon from "@material-ui/icons/BorderColor";

import { FabricCanvasContainer } from "../containers";
import { Action } from "../types/canvas";

type Props = {
  color: string,
  dispatch: React.Dispatch<Action>,
};

const COLORS = [
  "#000000",
  "#333333",
  "#4D4D4D",

  "#666666",
  "#808080",
  "#999999",

  "#B3B3B3",
  "#cccccc",
  "#FFFFFF",

  "#9F0500",
  "#D33115",
  "#F44E3B",

  "#C45100",
  "#E27300",
  "#FE9200",

  "#FB9E00",
  "#FCC400",
  "#FCDC00",

  "#808900",
  "#B0BC00",
  "#DBDF00",

  "#194D33",
  "#68BC00",
  "#A4DD00",

  "#0C797D",
  "#16A5A5",
  "#68CCCA",

  "#0062B1",
  "#009CE0",
  "#73D8FF",

  "#653294",
  "#7B64FF",
  "#AEA1FF",

  "#AB149E",
  "#FA28FF",
  "#FDA1FF",
];

const Component: VFCX<Props> = memo(({ className, color, dispatch }) => {
  const [open, setOpen] = useState(false);

  const onChange: ColorChangeHandler = (color) => {
    setOpen(false);
    dispatch({ type: "update", color: color.hex });
  };

  return (
    <span className={className}>
      <IconButton onClick={() => setOpen(true)}>
        <BorderColorIcon />
      </IconButton>
      {open && (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <TwitterPicker colors={COLORS} onChangeComplete={onChange} />
        </Dialog>
      )}
    </span>
  );
});

const StyledComponent = styled(Component)`
  margin: 0 8px;

  svg {
    fill: ${({ color }) => color};
  }
`;

const Container: VFC = () => {
  const { color, dispatch } = FabricCanvasContainer.useContainer();

  return <StyledComponent color={color} dispatch={dispatch} />;
};

export default Container;
