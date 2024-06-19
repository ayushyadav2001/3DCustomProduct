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
          `<svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#21acf2" stroke="#21acf2"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>meta_fill</title> <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Brand" transform="translate(-480.000000, -48.000000)"> <g id="meta_fill" transform="translate(480.000000, 48.000000)"> <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" id="MingCute" fill-rule="nonzero"> </path> <path d="M16.0235,4.50341 C17.8529,4.3766 19.267,5.44519 20.2076,6.67737 C21.156,7.91976 21.8094,9.54336 22.1673,11.1394 C22.5251,12.7347 22.6208,14.4504 22.3239,15.9123 C22.0388,17.3161 21.2785,18.9223 19.5568,19.437 C17.9375,19.9211 16.5179,19.2167 15.5052,18.3648 C14.4894,17.5103 13.6292,16.3122 12.953,15.1885 C12.6252,14.6438 12.3272,14.0938 12.0637,13.573 C11.8001,14.0938 11.5021,14.6438 11.1743,15.1885 C10.4981,16.3122 9.63792,17.5103 8.62209,18.3648 C7.60941,19.2167 6.18982,19.9211 4.57048,19.437 C2.84884,18.9223 2.08848,17.3161 1.80341,15.9123 C1.50655,14.4504 1.60217,12.7347 1.95995,11.1394 C2.31789,9.54336 2.97134,7.91976 3.91972,6.67737 C4.86029,5.44519 6.27437,4.3766 8.10383,4.50341 C9.81996636,4.62237364 11.0674829,5.78648603 11.8446591,6.77187041 L12.0637,7.0609 L12.0637,7.0609 L12.2827156,6.77187041 C13.059814,5.78648603 14.3073182,4.62237364 16.0235,4.50341 Z M7.89637,7.49623 C7.47584,7.46708 6.92691,7.6821 6.30436,8.49766 C5.68961,9.30301 5.17981,10.4913 4.88724,11.7959 C4.59453,13.1011 4.5524,14.3747 4.74341,15.3153 C4.90819312,16.126825 5.17222414,16.4173547 5.33536471,16.5186918 L5.40276778,16.5532373 L5.40276778,16.5532373 L5.42973,16.5627 C5.6624,16.6322 6.04382,16.6134 6.69089,16.0691 C7.33482,15.5274 7.99318,14.6564 8.60392,13.6416 C8.87629333,13.1890333 9.12860444,12.7252222 9.35564593,12.2790926 L9.61563301,11.7540754 L9.61563301,11.7540754 L9.8493616,11.25714 L9.8493616,11.25714 L10.0548321,10.7993939 L10.0548321,10.7993939 L10.2300447,10.3919447 L10.2300447,10.3919447 L10.373,10.0459 L10.373,10.0459 C10.2165,9.73315 9.99218,9.32834 9.71032,8.92724 C9.06612,8.01052 8.42073,7.53258 7.89637,7.49623 Z M16.2309,7.49623 C15.7066,7.53258 15.0612,8.01052 14.417,8.92724 C14.1351,9.32834 13.9108,9.73315 13.7543,10.0459 L13.9809584,10.588688 L13.9809584,10.588688 L14.1715556,11.0226741 C14.2058156,11.0990422 14.2412947,11.1772747 14.2779512,11.25714 L14.511686,11.7540754 L14.511686,11.7540754 L14.7716778,12.2790926 C14.9987222,12.7252222 15.2510333,13.1890333 15.5234,13.6416 C16.1341,14.6564 16.7925,15.5274 17.4364,16.0691 C18.0372786,16.5745214 18.4090587,16.6268332 18.6454171,16.576082 L18.6976,16.5627 C18.8279,16.5237 19.1811,16.3141 19.3839,15.3153 C19.5749,14.3747 19.5328,13.1011 19.2401,11.7959 C18.9475,10.4913 18.4377,9.30301 17.8229,8.49766 C17.2004,7.6821 16.6515,7.46708 16.2309,7.49623 Z" id="形状" fill="#437ddb"> </path> </g> </g> </g> </g></svg>`,
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
              <FabricJSCanvas  className="sample-canvas" onReady={onReady} />
            </div>
          </div>
        </div>
        <div className="col-6 custom-h">
          <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
            <color attach="background" args={["#ececec"]} />
            <Experience textureDataUrl={textureDataUrl} />
          </Canvas>
        </div>
        <div className="flex ">
        <button className="btn btn-primary w-50" onClick={updateImage}>Generate</button>
        </div>
      </div>
    </>
  );
}

export default App;
