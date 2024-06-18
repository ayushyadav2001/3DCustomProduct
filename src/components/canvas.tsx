import React, { Dispatch, memo, useEffect, VFC } from "react";
import styled from "@emotion/styled";
import { fabric } from "fabric";

import { FabricCanvasContainer } from "../containers";
import { Action } from "../types/canvas";

const CANVAS_ID = "canvas";

type Props = {
    className?: string;
    dispatch: Dispatch<Action>;
};

const Component: VFC<Props> = memo(({ className, dispatch }) => {
    useEffect(() => {
        const initCanvas = new fabric.Canvas(CANVAS_ID, {
            isDrawingMode: true,
            width: 800,
            height: 300,
            backgroundColor: "#80beaf"
        });

        dispatch({ type: "init", canvas: initCanvas });
    }, []);

    return (
        <div className={className}>
            <canvas id={CANVAS_ID} />
        </div>
    );
});

const StyledComponent = styled(Component)`
  border: 3px double #aaa;
`;

const Container: VFC = () => {
    const { dispatch } = FabricCanvasContainer.useContainer();

    return <StyledComponent dispatch={dispatch} />;
};

export default Container;
