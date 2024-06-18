import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import "./styles.css";

function App() {
    const { editor, onReady } = useFabricJSEditor();

    const history = [];
     const [textureDataUrl, setTextureDataUrl] = useState("");
    const [color, setColor] = useState("#35363a");
    const [cropImage, setCropImage] = useState(true);

      useEffect(() => {
        if (!editor || !fabric) {
          return;
        }

        if (cropImage) {
          editor.canvas.__eventListeners = {};
          return;
        }

        if (!editor.canvas.__eventListeners["mouse:wheel"]) {
          editor.canvas.on("mouse:wheel", function (opt) {
            var delta = opt.e.deltaY;
            var zoom = editor.canvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            editor.canvas.zoomToPoint(
              { x: opt.e.offsetX, y: opt.e.offsetY },
              zoom
            );
            opt.e.preventDefault();
            opt.e.stopPropagation();
          });
        }

        if (!editor.canvas.__eventListeners["mouse:down"]) {
          editor.canvas.on("mouse:down", function (opt) {
            var evt = opt.e;
            if (evt.ctrlKey === true) {
              this.isDragging = true;
              this.selection = false;
              this.lastPosX = evt.clientX;
              this.lastPosY = evt.clientY;
            }
          });
        }

        if (!editor.canvas.__eventListeners["mouse:move"]) {
          editor.canvas.on("mouse:move", function (opt) {
            if (this.isDragging) {
              var e = opt.e;
              var vpt = this.viewportTransform;
              vpt[4] += e.clientX - this.lastPosX;
              vpt[5] += e.clientY - this.lastPosY;
              this.requestRenderAll();
              this.lastPosX = e.clientX;
              this.lastPosY = e.clientY;
            }
          });
        }

        if (!editor.canvas.__eventListeners["mouse:up"]) {
          editor.canvas.on("mouse:up", function (opt) {
            // on mouse up we want to recalculate new interaction
            // for all objects, so we call setViewportTransform
            this.setViewportTransform(this.viewportTransform);
            this.isDragging = false;
            this.selection = true;
          });
        }

         editor.canvas.on("object:modified", () => updateTexture());
         editor.canvas.on("object:added", () => updateTexture());
         editor.canvas.on("object:removed", () => updateTexture());

        editor.canvas.renderAll();
      }, [editor]);
      const addBackground = () => {
        if (!editor || !fabric) {
          return;
        }

        fabric.Image.fromURL(
          "https://thegraphicsfairy.com/wp-content/uploads/2019/02/Anatomical-Heart-Illustration-Black-GraphicsFairy.jpg",
          (image) => {
            editor.canvas.setBackgroundImage(
              image,
              editor.canvas.renderAll.bind(editor.canvas)
            );
          }
        );
      };
      const fromSvg = () => {
        fabric.loadSVGFromString(
          `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 297.5 297.5" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_40_"> <g> <path style="fill:#ACBFC7;" d="M277.71,158.52v85.7H19.79v-85.7h6.53v40.54c0,16.98,13.81,30.78,30.78,30.78 s30.78-13.8,30.78-30.78v-40.54h30.09v40.54c0,16.98,13.81,30.78,30.78,30.78c16.98,0,30.78-13.8,30.78-30.78v-40.54h30.1v40.54 c0,16.98,13.8,30.78,30.78,30.78c16.97,0,30.78-13.8,30.78-30.78v-40.54H277.71z"></path> <rect x="218.66" y="53.28" style="fill:#CDD9DD;" width="43.49" height="10.53"></rect> <rect x="229.17" y="83.35" style="fill:#CDD9DD;" width="22.48" height="23.92"></rect> <rect x="137.51" y="83.35" style="fill:#CDD9DD;" width="22.48" height="23.92"></rect> <rect x="127.01" y="53.28" style="fill:#CDD9DD;" width="43.49" height="10.53"></rect> <rect x="35.35" y="53.28" style="fill:#CDD9DD;" width="43.49" height="10.53"></rect> <rect x="45.86" y="83.35" style="fill:#CDD9DD;" width="22.48" height="23.92"></rect> <path style="fill:#FF4855;" d="M251.65,126.81v72.25c0,6.2-5.05,11.24-11.24,11.24c-6.2,0-11.24-5.04-11.24-11.24v-72.25H251.65z"></path> <path style="fill:#D61616;" d="M68.34,126.81v72.25c0,6.2-5.04,11.24-11.24,11.24s-11.24-5.04-11.24-11.24v-72.25H68.34z"></path> <path style="fill:#FFD63F;" d="M159.99,126.81v72.25c0,6.2-5.04,11.24-11.24,11.24s-11.24-5.04-11.24-11.24v-72.25H159.99z"></path> <path d="M297.25,148.75v105.24c0,5.4-4.37,9.77-9.77,9.77H10.02c-5.39,0-9.77-4.37-9.77-9.77V148.75c0-5.4,4.38-9.77,9.77-9.77 h16.3V83.35h-0.74c-5.39,0-9.77-4.38-9.77-9.77V43.51c0-5.4,4.38-9.77,9.77-9.77h63.03c5.4,0,9.77,4.37,9.77,9.77v30.07 c0,5.39-4.37,9.77-9.77,9.77h-0.73v55.63h30.09V83.35h-0.73c-5.4,0-9.77-4.38-9.77-9.77V43.51c0-5.4,4.37-9.77,9.77-9.77h63.03 c5.39,0,9.77,4.37,9.77,9.77v30.07c0,5.39-4.38,9.77-9.77,9.77h-0.74v55.63h30.1V83.35h-0.74c-5.39,0-9.77-4.38-9.77-9.77V43.51 c0-5.4,4.38-9.77,9.77-9.77h63.03c5.4,0,9.77,4.37,9.77,9.77v30.07c0,5.39-4.37,9.77-9.77,9.77h-0.73v55.63h16.29 C292.88,138.98,297.25,143.35,297.25,148.75z M277.71,244.22v-85.7h-6.52v40.54c0,16.98-13.81,30.78-30.78,30.78 c-16.98,0-30.78-13.8-30.78-30.78v-40.54h-30.1v40.54c0,16.98-13.8,30.78-30.78,30.78c-16.97,0-30.78-13.8-30.78-30.78v-40.54 H87.88v40.54c0,16.98-13.81,30.78-30.78,30.78s-30.78-13.8-30.78-30.78v-40.54h-6.53v85.7H277.71z M262.15,63.81V53.28h-43.49 v10.53H262.15z M251.65,199.06v-72.25h-22.48v72.25c0,6.2,5.04,11.24,11.24,11.24C246.6,210.3,251.65,205.26,251.65,199.06z M251.65,107.27V83.35h-22.48v23.92H251.65z M170.5,63.81V53.28h-43.49v10.53H170.5z M159.99,199.06v-72.25h-22.48v72.25 c0,6.2,5.04,11.24,11.24,11.24S159.99,205.26,159.99,199.06z M159.99,107.27V83.35h-22.48v23.92H159.99z M78.84,63.81V53.28H35.35 v10.53H78.84z M68.34,199.06v-72.25H45.86v72.25c0,6.2,5.04,11.24,11.24,11.24S68.34,205.26,68.34,199.06z M68.34,107.27V83.35 H45.86v23.92H68.34z"></path> </g> <g> </g> </g> </g></svg>`,
          (objects, options) => {
            editor.canvas._objects.splice(0, editor.canvas._objects.length);
            editor.canvas.backgroundImage = objects[0];
            const newObj = objects.filter((_, index) => index !== 0);
            newObj.forEach((object) => {
              editor.canvas.add(object);
            });

            editor.canvas.renderAll();
          }
        );
      };
        useEffect(() => {
          if (!editor || !fabric) {
            return;
          }
          editor.canvas.setHeight(500);
          editor.canvas.setWidth(600);
          // addBackground();
          editor.canvas.renderAll();
        }, [editor?.canvas.backgroundImage]);
          const toggleSize = () => {
            editor.canvas.freeDrawingBrush.width === 12
              ? (editor.canvas.freeDrawingBrush.width = 5)
              : (editor.canvas.freeDrawingBrush.width = 12);
          };

            useEffect(() => {
              if (!editor || !fabric) {
                return;
              }
              editor.canvas.freeDrawingBrush.color = color;
              editor.setStrokeColor(color);
            }, [color]);

             const toggleDraw = () => {
               editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
             };
             const undo = () => {
               if (editor.canvas._objects.length > 0) {
                 history.push(editor.canvas._objects.pop());
               }
               editor.canvas.renderAll();
             };
             const redo = () => {
               if (history.length > 0) {
                 editor.canvas.add(history.pop());
               }
             };

             const clear = () => {
               editor.canvas._objects.splice(0, editor.canvas._objects.length);
               history.splice(0, history.length);
               editor.canvas.renderAll();
             };

             const removeSelectedObject = () => {
               editor.canvas.remove(editor.canvas.getActiveObject());
             };

             const onAddCircle = () => {
               editor.addCircle();
               editor.addLine();
             };
             const onAddRectangle = () => {
               editor.addRectangle();
             };
             const addText = () => {
               editor.addText("inset text");
             };

             const exportSVG = () => {
               const svg = editor.canvas.toSVG();
               console.info(svg);
             };

               const updateTexture = () => {
                 const dataUrl = editor?.canvas?.toDataURL();
                 setTextureDataUrl(dataUrl);
               };
              //  useEffect(() => {
              //    if (editor) {

              //     const handleCanvasUpdate = () => {
              //       const dataUrl = canvas.toDataURL();
              //       updateTexture(dataUrl);
              //     };
              //      const canvas = editor.canvas;
              //      canvas.on("object:modified", handleCanvasUpdate);
              //      canvas.on("object:added", handleCanvasUpdate);
              //      canvas.on("object:removed", handleCanvasUpdate);
              //      canvas.on("background:changed", handleCanvasUpdate);

              //      return () => {
              //        canvas.off("object:modified", handleCanvasUpdate);
              //        canvas.off("object:added", handleCanvasUpdate);
              //        canvas.off("object:removed", handleCanvasUpdate);
              //        canvas.off("background:changed", handleCanvasUpdate);
              //      };
              //    }
              //  }, [editor]);

              //  console.log("textureDataUrl", textureDataUrl);
              // const updateImage=()=>{
              //   updateTexture()
              // }
                // const updateImage = () => {
                //   const dataUrl = editor?.canvas?.toDataURL();
                //   onUpdate(dataUrl);
                // };

                const updateImage = () => {
                  if (!editor || !editor.canvas) return;

                  // Temporarily disable rendering of background image to avoid tainted canvas issue
                  const originalBackground = editor.canvas.backgroundImage;
                  editor.canvas.setBackgroundImage(null);

                  // Create a temporary canvas to render fabric canvas content
                  const tempCanvas = document.createElement("canvas");
                  const tempCtx = tempCanvas.getContext("2d");

                  if (tempCtx) {
                    tempCanvas.width = editor.canvas.width;
                    tempCanvas.height = editor.canvas.height;

                    // Render fabric canvas content onto the temp canvas
                    editor.canvas.renderAll();
                    editor.canvas.forEachObject((obj) => {
                      const originalOpacity = obj.opacity;
                      obj.set("opacity", 1); // Ensure all objects are fully opaque for rendering
                      obj.render(tempCtx);
                      obj.set("opacity", originalOpacity); // Restore original opacity
                    });

                    // Convert temp canvas to data URL and pass to onUpdate callback
                    const dataUrl = tempCanvas.toDataURL();
                    // console.log("dataUrl", dataUrl);
                 const byteCharacters = atob(dataUrl.split(",")[1]);
                 const byteNumbers = new Array(byteCharacters.length);
                 for (let i = 0; i < byteCharacters.length; i++) {
                   byteNumbers[i] = byteCharacters.charCodeAt(i);
                 }
                 const byteArray = new Uint8Array(byteNumbers);
                 const blob = new Blob([byteArray], { type: "image/jpeg" });
                 const blobUrl = URL.createObjectURL(blob);
                //  console.log("blobUrl", blobUrl);
                    updateTexture(blobUrl);

                    // Restore original background image
                    editor.canvas.setBackgroundImage(originalBackground);
                  }
                };


  return (
    <>
      <div className="row ">
        <div className="col-6">
          <div className="">
            <h1>FabricJS React Sample</h1>
            <button onClick={onAddCircle}>Add circle</button>
            <button onClick={onAddRectangle} disabled={!cropImage}>
              Add Rectangle
            </button>
            <button onClick={addText} disabled={!cropImage}>
              Add Text
            </button>
            <button onClick={toggleDraw} disabled={!cropImage}>
              Toggle draw
            </button>
            <button onClick={clear} disabled={!cropImage}>
              Clear
            </button>
            <button onClick={undo} disabled={!cropImage}>
              Undo
            </button>
            <button onClick={redo} disabled={!cropImage}>
              Redo
            </button>
            <button onClick={toggleSize} disabled={!cropImage}>
              ToggleSize
            </button>
            <button onClick={removeSelectedObject} disabled={!cropImage}>
              Delete
            </button>
            <button onClick={(e) => setCropImage(!cropImage)}>Crop</button>
            <label disabled={!cropImage}>
              <input
                disabled={!cropImage}
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </label>
            <button onClick={exportSVG} disabled={!cropImage}>
              {" "}
              ToSVG
            </button>
            <button onClick={fromSvg} disabled={!cropImage}>
              fromsvg
            </button>

            <div
              style={{
                border: `3px ${!cropImage ? "dotted" : "solid"} Green`,
                width: "100%",
                height: "500px",
              }}
            >
              <FabricJSCanvas className="sample-canvas" onReady={onReady} />
            </div>
          </div>
        </div>
        <div className="col-6 custom-h">
          <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
            <color attach="background" args={["#ececec"]} />
            <Experience textureDataUrl={textureDataUrl} />
          </Canvas>
        </div>
        <button onClick={updateImage}>Generate</button>
      </div>
    </>
  );
}

export default App;
