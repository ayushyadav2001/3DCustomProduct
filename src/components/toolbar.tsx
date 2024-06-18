import React, { Dispatch, memo, VFC } from "react";
import styled from "@emotion/styled";

import { FabricCanvasContainer } from "../containers";
import { Action } from "../types/canvas";
import { Button } from "@material-ui/core";
import { ColorPicker, WidthSlider } from ".";

type Props = {
    className?: string;
    dispatch: Dispatch<Action>;
};

const Component: VFC<Props> = memo(({ className, dispatch }) => {
    const onClickClear = () => dispatch({ type: "clear" });
    const onClickDownload = () => dispatch({ type: "download" });

    return (
        <div className={className}>
            <Button variant="contained" color="primary" onClick={onClickClear}>
                クリア
            </Button>
            <Button variant="contained" color="primary" onClick={onClickDownload}>
                ダウンロード
            </Button>
            <ColorPicker />
            <WidthSlider />
        </div>
    );
});

const StyledComponent = styled(Component)`
  margin: 8px 0;
  display: flex;
  align-items: center;
  & > button {
    margin: 0 4px;
  }
`;

const Container: VFC = () => {
    const { dispatch } = FabricCanvasContainer.useContainer();

    return <StyledComponent dispatch={dispatch} />;
};

export default Container;
