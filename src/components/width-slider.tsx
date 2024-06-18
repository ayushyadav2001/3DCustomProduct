import React, { VFC } from "react";
import styled from "@emotion/styled";
import { InputLabel, Slider } from "@material-ui/core";

import { FabricCanvasContainer } from "../containers";

const Component: VFC<{ className?: string }> = ({ className }) => {
    const { width, dispatch } = FabricCanvasContainer.useContainer();

    const onChange: (
        event: React.ChangeEvent<{}>,
        value: number | number[]
    ) => void = (_, value) =>
            dispatch({
                type: "update",
                width: typeof value === "number" ? value : value[0]
            });

    return (
        <div className={className}>
            <InputLabel>ペンの太さ</InputLabel>
            <Slider
                value={width}
                onChange={onChange}
                valueLabelDisplay="auto"
                min={1}
                max={30}
            />
        </div>
    );
};

const StyledComponent = styled(Component)`
  display: inline-block;
  width: 200px;
`;

export default StyledComponent;
