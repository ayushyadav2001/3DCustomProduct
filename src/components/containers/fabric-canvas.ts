import { createContainer } from "unstated-next";
import { fabric } from "fabric";
import { Reducer, useReducer, useState } from "react";

import { State, Action } from "../types/canvas";

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "init": {
      action.canvas.freeDrawingBrush.width = state.width;
      action.canvas.freeDrawingBrush.color = state.color;
      return { ...state, canvas: action.canvas };
    }
    case "update": {
      if (!state.canvas) {
        return state;
      }
      const { color, width } = action;
      if (color) {
        state.color = color;
        state.canvas.freeDrawingBrush.color = color;
      }
      if (width) {
        state.width = width;
        state.canvas.freeDrawingBrush.width = width;
      }
      return { ...state };
    }
    case "clear": {
      if (!state.canvas) {
        return state;
      }
      state.canvas.clear();
      state.canvas.backgroundColor = "#80beaf";
      return state;
    }
    case "download": {
      if (!state.canvas) {
        return state;
      }
      const a = document.createElement("a");
      a.download = "canvas.png";
      a.href = state.canvas.toDataURL();
      a.target = "_blank";

      document.body.append(a);
      a.click();
      document.body.removeChild(a);

      return state;
    }
  }
};

const hooks = () => {
  const [{ canvas, color, width }, dispatch] = useReducer(reducer, {
    canvas: null,
    width: 5,
    color: "#555",
  });

  return { canvas, color, width, dispatch };
};

export default createContainer(hooks);
