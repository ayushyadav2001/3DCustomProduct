import { fabric } from "fabric";

export type State = {
  canvas: fabric.Canvas | null;
  width: number;
  color: string;
};

export type Action =
  | {
      type: "init";
      canvas: fabric.Canvas;
    }
  | {
      type: "download";
    }
  | {
      type: "update";
      color?: string;
      width?: number;
    }
  | {
      type: "clear";
    };
