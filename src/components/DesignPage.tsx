import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Rnd } from "react-rnd";
import { SketchPicker } from "react-color";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { BlockPicker } from "react-color";



const saveFormAndBid = async (data) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const docRef = await addDoc(collection(db, "inspectionformsandbids"), {
    userId: user.uid,
    field: data.field,
    coverDesign: data.coverDesign,
    shapes: data.shapes,
    texts: data.texts,
    designs: data.designs,
    images: data.images,
    headerStyle: data.headerStyle, // 🆕
    footerStyle: data.footerStyle, // 🆕
    createdAt: serverTimestamp(),
  });

  console.log("🔥 Saved bid form with ID:", docRef.id);
};





const DesignPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const field = location.state?.field;

const [coverDesign, setCoverDesign] = useState({
  primaryColor: "",
  secondaryColor: "",
});


const [showShapeOptions, setShowShapeOptions] = useState(false);
const [showTextOptions, setShowTextOptions] = useState(false);
const [showDesignOptions, setShowDesignOptions] = useState(false);

  const [shapes, setShapes] = useState([]);
  const [texts, setTexts] = useState([]);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [designs, setDesigns] = useState([]);
const [selectedDesignId, setSelectedDesignId] = useState(null);
const [showImageOptions, setShowImageOptions] = useState(false);
const [images, setImages] = useState([]);
const [selectedImageId, setSelectedImageId] = useState(null);
const [title, setTitle] = useState("");


const [headerStyle, setHeaderStyle] = useState("");
const [footerStyle, setFooterStyle] = useState("");

const [showHeaderFooterTextOptions, setShowHeaderFooterTextOptions] = useState(false);
const [showHeaderFooterImageOptions, setShowHeaderFooterImageOptions] = useState(false);




// Add this state up top
const [showThemeColors, setShowThemeColors] = useState(false);

useEffect(() => {
  setDesigns((prevDesigns) =>
    prevDesigns.map((design) => {
      if (design.type === "footer" || design.type === "ascented") {
        return {
          ...design,
          primaryColor: coverDesign.primaryColor || "",
          accentColor: coverDesign.accentColor || "",
        };
      }
      return design;
    })
  );
}, [coverDesign.primaryColor, coverDesign.accentColor]);






const createNewShape = () => ({
  id: Date.now(),
  type: "square",
  color: "#ff0000",
  rotation: 0,
  width: 100,
  height: 60,
  x: 50,
  y: 50,
  zIndex: Date.now(), // 🧠 unique layer order
});

const createNewText = () => ({
  id: Date.now(),
  text: "",
  color: "#000000",
  rotation: 0,
  fontSize: 16,
  width: 150,
  height: 30,
  x: 50,
  y: 50,
  zIndex: Date.now(), // 🧠
});

const createNewDesign = () => ({
  id: Date.now(),
  type: "footer",
  primaryColor: "",
  accentColor: "",
  rotation: 0,
  width: 300,
  height: 40,
  x: 50,
  y: 50,
  zIndex: Date.now(), // 🧠
});

const createNewHeaderFooterText = () => ({
  id: Date.now(),
  text: "",
  color: "#000000",
  rotation: 0,
  fontSize: 16,
  width: 150,
  height: 30,
  x: 50,
  y: 50,
  zIndex: Date.now(),
  isHeaderFooter: true, // 🔥 New
});

const createNewHeaderFooterImage = (base64) => ({
  id: Date.now(),
  src: base64,
  x: 50,
  y: 50,
  width: 150,
  height: 150,
  rotation: 0,
  zIndex: getHighestZIndex() + 1,
  isHeaderFooter: true, // 🔥 critical
});







  const addNewShape = () => {
    const newShape = createNewShape();
    setShapes((prev) => [...prev, newShape]);
    setSelectedShapeId(newShape.id);
  };

  const addNewText = () => {
    const newText = createNewText();
    setTexts((prev) => [...prev, newText]);
    setSelectedTextId(newText.id);
  };

  const updateShape = (id, key, value) => {
    setShapes((prev) =>
      prev.map((shape) => (shape.id === id ? { ...shape, [key]: value } : shape))
    );
  };

  const updateText = (id, key, value) => {
    setTexts((prev) =>
      prev.map((text) => (text.id === id ? { ...text, [key]: value } : text))
    );
  };

  const updateDesign = (id, key, value) => {
  setDesigns((prev) =>
    prev.map((design) => (design.id === id ? { ...design, [key]: value } : design))
  );
};


const updateImage = (id, key, value) => {
  setImages((prev) =>
    prev.map((img) => (img.id === id ? { ...img, [key]: value } : img))
  );
};


const getHighestZIndex = () => {
  const allItems = [...shapes, ...texts, ...designs, ...images];
  return allItems.length ? Math.max(...allItems.map((item) => item.zIndex || 0)) : 0;
};



  const handleContinue = () => {
    navigate("/form-builder", {
      state: { field, coverDesign },
    });
  };


  







  

  if (!field) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-500">No field selected. Please go back and choose a field.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col sm:flex-row px-6 py-12">
      <div className="w-full sm:w-1/2 pr-6 space-y-4">
        <h1 className="text-3xl font-bold mb-2">Customize Your Cover Page</h1>



        {/* 🎨 THEME COLOR DROPDOWN */}
<div className="mb-6">
  <button
    onClick={() => setShowThemeColors((prev) => !prev)}
    className="bg-gray-800 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded shadow transition w-full text-left"
  >
    {showThemeColors ? "▼" : "▶"} Set Theme Colors
  </button>

  {showThemeColors && (
    <div className="bg-gray-700 p-4 mt-2 rounded shadow-inner space-y-6">
      <div>
        <label className="block mb-1 text-white font-semibold">Primary Color</label>
        <SketchPicker
          color={coverDesign.primaryColor}
          onChangeComplete={(color) =>
            setCoverDesign((prev) => ({
              ...prev,
              primaryColor: color.hex,
            }))
          }
        />
      </div>

      <div>
        <label className="block mb-1 text-white font-semibold">Accent Color</label>
        <SketchPicker
          color={coverDesign.accentColor}
          onChangeComplete={(color) =>
            setCoverDesign((prev) => ({
              ...prev,
              accentColor: color.hex,
            }))
          }
        />
      </div>
    </div>
  )}
</div>

        <p className="text-gray-400">You selected: <span className="text-purple-400 font-semibold">{field}</span></p>

        <div className="mb-6">






          <h2 className="text-xl font-bold mb-2 mt-6">Add Elements:</h2>
          <div className="flex flex-col space-y-3">
            <div>
              <button
                className="bg-gray-800 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded shadow transition w-full text-left"
onClick={() => setShowShapeOptions(prev => !prev)}
              >
             Add Shapes
              </button>
{showShapeOptions && (
                <div className="bg-gray-700 p-4 mt-2 rounded shadow-inner space-y-6">
                  {shapes.map((shape, idx) => (
                    <div
                      key={shape.id}
                      className={`bg-gray-800 p-3 rounded space-y-2 border ${selectedShapeId === shape.id ? 'border-2 border-blue-400 shadow-md' : 'border-gray-600'}`}
                      onClick={() => setSelectedShapeId(shape.id)}
                    >
                      <label className="text-white text-sm font-semibold block">Annotation {idx + 1}</label>
                      <select
                        value={shape.type}
                        onChange={(e) => updateShape(shape.id, "type", e.target.value)}
                        className="w-full px-2 py-1 bg-gray-900 text-white rounded border border-gray-600"
                      >
                        <option value="square">Square</option>
                        <option value="circle">Circle</option>
              
                        <option value="triangle">Triangle</option>
                        <option value="line">Line</option>

                      </select>

                      <label className="text-white text-xs block mt-2">Color</label>
                      <SketchPicker
                        color={shape.color}
                        onChangeComplete={(color) => updateShape(shape.id, "color", color.hex)}
                      />

                      <label className="text-white text-xs block mt-2">Rotate</label>
                      <input
                        type="range"
                        min={-180}
                        max={180}
                        value={shape.rotation}
                        onChange={(e) => updateShape(shape.id, "rotation", Number(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-gray-400 text-xs">{shape.rotation}°</p>


<button
  onClick={() => updateShape(shape.id, "zIndex", getHighestZIndex() + 1)}
  className="text-green-400 text-xs underline"
>
  Bring to Front
</button>
                      <button
                        onClick={() => setShapes(shapes.filter(s => s.id !== shape.id))}
                        className="text-red-400 text-xs underline mt-1"
                      >
                        Delete
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={addNewShape}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1 px-2 rounded"
                  >
                    + Add Shape
                  </button>
                </div>
              )}
            </div>

            <div>
              <button
                className="bg-gray-800 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded shadow transition w-full text-left"
onClick={() => setShowTextOptions(prev => !prev)}
              >
                Add Text
              </button>
{showTextOptions && (
                <div className="bg-gray-700 p-4 mt-2 rounded shadow-inner space-y-6">
                  {texts.map((text, idx) => (
                    <div
                      key={text.id}
                      className={`bg-gray-800 p-3 rounded space-y-2 border ${selectedTextId === text.id ? 'border-2 border-blue-400 shadow-md' : 'border-gray-600'}`}
                      onClick={() => setSelectedTextId(text.id)}
                    >
                      <label className="text-white text-sm font-semibold block">Text {idx + 1}</label>
                      <input
                        type="text"
                        value={text.text}
                        onChange={(e) => updateText(text.id, "text", e.target.value)}
                        className="w-full px-2 py-1 bg-gray-900 text-white rounded border border-gray-600"
                      />
                      <label className="text-white text-xs block mt-2">Color</label>
                      <SketchPicker
                        color={text.color}
                        onChangeComplete={(color) => updateText(text.id, "color", color.hex)}
                      />
                      <label className="text-white text-xs block mt-2">Rotate</label>
                      <input
                        type="range"
                        min={-180}
                        max={180}
                        value={text.rotation}
                        onChange={(e) => updateText(text.id, "rotation", Number(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-gray-400 text-xs">{text.rotation}°</p>



<button
  onClick={() => updateText(text.id, "zIndex", getHighestZIndex() + 1)}
  className="text-green-400 text-xs underline"
>
  Bring to Front
</button>

                      <button
                        onClick={() => setTexts(texts.filter(t => t.id !== text.id))}
                        className="text-red-400 text-xs underline mt-1"
                      >
                        Delete
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={addNewText}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1 px-2 rounded"
                  >
                    + Add Text
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>



        <div>
  <button
    className="bg-gray-800 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded shadow transition w-full text-left"
onClick={() => setShowDesignOptions(prev => !prev)}
  >
    Add Designs
  </button>
{showDesignOptions && (
    <div className="bg-gray-700 p-4 mt-2 rounded shadow-inner space-y-6">
      {designs.map((design, idx) => (
        <div
          key={design.id}
          className={`bg-gray-800 p-3 rounded space-y-2 border ${selectedDesignId === design.id ? 'border-2 border-blue-400 shadow-md' : 'border-gray-600'}`}
          onClick={() => setSelectedDesignId(design.id)}
        >
          <label className="text-white text-sm font-semibold block">Design {idx + 1}</label>
      <select
  value={design.type}
  onChange={(e) => updateDesign(design.id, "type", e.target.value)}
  className="w-full px-2 py-1 bg-gray-900 text-white rounded border border-gray-600"
>
  
  <option value="ascented">Ascented Decor</option>
  <option value="footer">Footer Bar</option>
</select>



          <label className="text-white text-xs block mt-2">Rotate</label>
          <input
            type="range"
            min={-180}
            max={180}
            value={design.rotation}
            onChange={(e) => updateDesign(design.id, "rotation", Number(e.target.value))}
            className="w-full"
          />
          <p className="text-gray-400 text-xs">{design.rotation}°</p>

<button
  onClick={() => updateDesign(design.id, "zIndex", getHighestZIndex() + 1)}
  className="text-green-400 text-xs underline"
>
  Bring to Front
</button>




          <button
            onClick={() => setDesigns(designs.filter(d => d.id !== design.id))}
            className="text-red-400 text-xs underline mt-1"
          >
            Delete
          </button>
        </div>
      ))}

      <button
        onClick={() => {
          const newDesign = createNewDesign();
          setDesigns([...designs, newDesign]);
          setSelectedDesignId(newDesign.id);
        }}
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1 px-2 rounded"
      >
        + Add Design
      </button>
    </div>
  )}
</div>

<div>
  <button
    className="bg-gray-800 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded shadow transition w-full text-left"
    onClick={() => setShowImageOptions(prev => !prev)}
  >
    Add Image
  </button>
  {showImageOptions && (
    <div className="bg-gray-700 p-4 mt-2 rounded shadow-inner space-y-4">
      {/* Upload input */}
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImage = {
        id: Date.now(),
        src: reader.result,
        x: 50,
        y: 50,
        width: 150,
        height: 150,
        rotation: 0,
        zIndex: getHighestZIndex() + 1,
      };
      setImages((prev) => [...prev, newImage]);
      setSelectedImageId(newImage.id);
    };
    reader.readAsDataURL(file);
  }}
  className="text-white"
/>

{/* ✅ Render existing image controls separately below */}
{images.map((img, idx) => (
  <div
    key={img.id}
    className={`bg-gray-800 p-3 rounded space-y-2 border ${
      selectedImageId === img.id ? "border-2 border-blue-400 shadow-md" : "border-gray-600"
    }`}
    onClick={() => setSelectedImageId(img.id)}
  >
    <label className="text-white text-sm font-semibold block">Image {idx + 1}</label>

    <button
      onClick={() => updateImage(img.id, "zIndex", getHighestZIndex() + 1)}
      className="text-green-400 text-xs underline"
    >
      Bring to Front
    </button>

    <button
      onClick={() => setImages(images.filter((i) => i.id !== img.id))}
      className="text-red-400 text-xs underline block mt-1"
    >
      Delete
    </button>
  </div>
))}



    </div>






  )}






  <h2 className="text-2xl font-bold mt-10 mb-2">Customize Your Header and Footer</h2>


  {/* TEXT DROPDOWN */}
<div className="mb-6">
  <button
    className="bg-gray-800 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded shadow transition w-full text-left"
    onClick={() => setShowHeaderFooterTextOptions(prev => !prev)}
  >
    Add Text to Header/Footer Page
  </button>

  {showHeaderFooterTextOptions && (
    <div className="bg-gray-700 p-4 mt-2 rounded shadow-inner space-y-6">
      {texts.filter(t => t.isHeaderFooter).map((text, idx) => (
        <div
          key={text.id}
          className={`bg-gray-800 p-3 rounded space-y-2 border ${
            selectedTextId === text.id ? "border-2 border-blue-400 shadow-md" : "border-gray-600"
          }`}
          onClick={() => setSelectedTextId(text.id)}
        >
          <label className="text-white text-sm font-semibold block">Text {idx + 1}</label>
          <input
            type="text"
            value={text.text}
            onChange={(e) => updateText(text.id, "text", e.target.value)}
            className="w-full px-2 py-1 bg-gray-900 text-white rounded border border-gray-600"
          />
          <label className="text-white text-xs block mt-2">Color</label>
          <SketchPicker
            color={text.color}
            onChangeComplete={(color) => updateText(text.id, "color", color.hex)}
          />
          <label className="text-white text-xs block mt-2">Rotate</label>
          <input
            type="range"
            min={-180}
            max={180}
            value={text.rotation}
            onChange={(e) => updateText(text.id, "rotation", Number(e.target.value))}
            className="w-full"
          />
          <p className="text-gray-400 text-xs">{text.rotation}°</p>

          <button
            onClick={() => updateText(text.id, "zIndex", getHighestZIndex() + 1)}
            className="text-green-400 text-xs underline"
          >
            Bring to Front
          </button>
          <button
            onClick={() => setTexts(texts.filter(t => t.id !== text.id))}
            className="text-red-400 text-xs underline mt-1"
          >
            Delete
          </button>
        </div>
      ))}

      <button
        onClick={() => {
          const newText = {
            ...createNewText(),
            isHeaderFooter: true,
          };
          setTexts((prev) => [...prev, newText]);
          setSelectedTextId(newText.id);
        }}
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1 px-2 rounded"
      >
        + Add Text
      </button>
    </div>
  )}
</div>

<div className="mb-6">
  <button
    className="bg-gray-800 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded shadow transition w-full text-left"
    onClick={() => setShowHeaderFooterImageOptions(prev => !prev)}
  >
    Add Image to Header/Footer Page
  </button>

  {showHeaderFooterImageOptions && (
    <div className="bg-gray-700 p-4 mt-2 rounded shadow-inner space-y-6">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onloadend = () => {
            const newImage = createNewHeaderFooterImage(reader.result);
            setImages((prev) => [...prev, newImage]);
            setSelectedImageId(newImage.id);
          };
          reader.readAsDataURL(file);
        }}
        className="text-white"
      />

      {images.filter(i => i.isHeaderFooter).map((img, idx) => (
        <div
          key={img.id}
          className={`bg-gray-800 p-3 rounded space-y-2 border ${
            selectedImageId === img.id ? "border-2 border-blue-400 shadow-md" : "border-gray-600"
          }`}
          onClick={() => setSelectedImageId(img.id)}
        >
          <label className="text-white text-sm font-semibold block">Image {idx + 1}</label>

          <button
            onClick={() => updateImage(img.id, "zIndex", getHighestZIndex() + 1)}
            className="text-green-400 text-xs underline"
          >
            Bring to Front
          </button>
          <button
            onClick={() => setImages(images.filter((i) => i.id !== img.id))}
            className="text-red-400 text-xs underline mt-1"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )}
</div>




<div className="space-y-4">
  <div>
    <label className="block text-sm font-semibold mb-1">Header Style</label>
    <select
  value={headerStyle}
  onChange={(e) => setHeaderStyle(e.target.value)}
  className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
>
  <option value="">None</option>
  <option value="ascented">Ascented Header</option>
</select>

  </div>
<div>
  <label className="block text-sm font-semibold mb-1">Footer Style</label>
  <select
    value={footerStyle}
    onChange={(e) => setFooterStyle(e.target.value)}
    className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
  >
    <option value="">None</option>
    <option value="accentedLine">Accented Line Footer</option>
  </select>
</div>

</div>

</div>



        <button
          onClick={handleContinue}
          className="bg-purple-600 hover:bg-purple-700 transition text-white font-semibold py-2 px-6 rounded-lg shadow"
        >
          Continue
        </button>



         <button
  onClick={() =>
    import("../utils/coverPDFGenerator").then(({ generateCoverPDF }) =>
generateCoverPDF({
  texts,
  shapes,
  designs,
  images,
  coverDesign,
  headerStyle,
  footerStyle,
      })
    )
  }
  className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded shadow"
>
  Print Design Mockup
</button>


<button
onClick={async () => {
  let finalTitle = title;
  if (!finalTitle.trim()) {
    finalTitle = prompt("Please enter a title for this inspection:") || "";
    if (!finalTitle.trim()) return alert("⚠️ Title is required.");
    setTitle(finalTitle); // for internal state
  }

  try {
await saveFormAndBid({
  field,
  coverDesign: { ...coverDesign, title: finalTitle },
  shapes,
  texts,
  designs,
  images,
  headerStyle,    // 🆕
  footerStyle,    // 🆕
});


navigate("/inspection", {
  state: {
    form: { field, formData: {} },
    coverDesign: { ...coverDesign, title: finalTitle },
    texts,
    shapes,
    designs,
    images,
    headerStyle,     // 🆕
    footerStyle,     // 🆕
  },
});

  } catch (error) {
    alert("❌ Error saving bid: " + error.message);
  }
}}

  className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
>
  Generate My Bid
</button>


      </div>

     <div className="w-full sm:w-1/2 flex justify-center items-start mt-10 sm:mt-0">
  <div className="flex flex-col items-center space-y-6">
    {/* Page 1: Custom editable with draggable designs */}
    <div className="bg-white w-[428px] h-[554px] p-4 rounded shadow-lg border border-gray-300 relative">
      {[...shapes, ...texts.filter(t => !t.isHeaderFooter), ...designs, ...images.filter(i => !i.isHeaderFooter)]

        .sort((a, b) => a.zIndex - b.zIndex)
        .map((item) => (
          <Rnd
            key={item.id}
            size={{ width: item.width, height: item.height }}
            position={{ x: item.x, y: item.y }}
            onDragStop={(e, d) => {
              const updater =
                texts.find((t) => t.id === item.id)
                  ? updateText
                  : shapes.find((s) => s.id === item.id)
                  ? updateShape
                  : designs.find((d) => d.id === item.id)
                  ? updateDesign
                  : updateImage;
              updater(item.id, "x", d.x);
              updater(item.id, "y", d.y);
            }}
            onResizeStop={(e, dir, ref, delta, position) => {
              const updater =
                texts.find((t) => t.id === item.id)
                  ? updateText
                  : shapes.find((s) => s.id === item.id)
                  ? updateShape
                  : designs.find((d) => d.id === item.id)
                  ? updateDesign
                  : updateImage;
              updater(item.id, "width", parseInt(ref.style.width));
              updater(item.id, "height", parseInt(ref.style.height));
              updater(item.id, "x", position.x);
              updater(item.id, "y", position.y);
            }}
            bounds="parent"
            enableResizing
            style={{ zIndex: item.zIndex }}
          >
            {item.text ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  color: item.color,
                  fontSize: item.fontSize,
                  transform: `rotate(${item.rotation}deg)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: selectedTextId === item.id ? "2px dashed #00f" : "none",
                  cursor: "move",
                }}
              >
                {item.text}
              </div>
            ) : item.type === "ascented" ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transform: `rotate(${item.rotation}deg)`,
                  border: selectedDesignId === item.id ? "2px dashed #00f" : "none",
                  cursor: "move",
                }}
              >
                <div style={{ height: "4px", backgroundColor: item.accentColor, width: "100%" }} />
                <div style={{ flexGrow: 1, backgroundColor: item.primaryColor }} />
                <div style={{ height: "4px", backgroundColor: item.accentColor, width: "100%" }} />
              </div>
            ) : item.type === "footer" ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  transform: `rotate(${item.rotation}deg)`,
                  border: selectedDesignId === item.id ? "2px dashed #00f" : "none",
                  cursor: "move",
                }}
              >
                <div style={{ height: "4px", backgroundColor: item.accentColor, width: "100%" }} />
                <div style={{ flexGrow: 1, backgroundColor: item.primaryColor }} />
              </div>
            ) : item.type === "line" ? (
              <div
                style={{
                  width: "100%",
                  height: "2px",
                  backgroundColor: item.color,
                  transform: `rotate(${item.rotation}deg)`,
                  outline: selectedShapeId === item.id ? "2px dashed #00f" : "none",
                  cursor: "move",
                }}
              />
            ) : item.src ? (
              <img
                src={item.src}
                alt="Uploaded"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transform: `rotate(${item.rotation}deg)`,
                  border: selectedImageId === item.id ? "2px dashed #00f" : "none",
                  cursor: "move",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: item.color,
                  transform: `rotate(${item.rotation}deg)`,
                  borderRadius: item.type === "circle" ? "50%" : 0,
                  clipPath:
                    item.type === "triangle"
                      ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                      : "none",
                  outline: selectedShapeId === item.id ? "2px dashed #00f" : "none",
                  cursor: "move",
                }}
              />
            )}
          </Rnd>
        ))}
    </div>
{/* Page 2: Only render dropdown-based header/footer */}
<div className="bg-white w-[428px] h-[554px] p-4 rounded shadow-lg border border-gray-300 relative">
  {[...texts, ...images]
  .filter((item) => item.isHeaderFooter)
  .sort((a, b) => a.zIndex - b.zIndex)
  .map((item) => (
    <Rnd
      key={item.id}
      size={{ width: item.width, height: item.height }}
      position={{ x: item.x, y: item.y }}
      onDragStop={(e, d) => {
        const updater = item.text ? updateText : updateImage;
        updater(item.id, "x", d.x);
        updater(item.id, "y", d.y);
      }}
      onResizeStop={(e, dir, ref, delta, position) => {
        const updater = item.text ? updateText : updateImage;
        updater(item.id, "width", parseInt(ref.style.width));
        updater(item.id, "height", parseInt(ref.style.height));
        updater(item.id, "x", position.x);
        updater(item.id, "y", position.y);
      }}
      bounds="parent"
      enableResizing
      style={{ zIndex: item.zIndex }}
    >
      {item.text ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            color: item.color,
            fontSize: item.fontSize,
            transform: `rotate(${item.rotation}deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: selectedTextId === item.id ? "2px dashed #00f" : "none",
            cursor: "move",
          }}
        >
          {item.text}
        </div>
      ) : (
        <img
          src={item.src}
          alt="Uploaded"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transform: `rotate(${item.rotation}deg)`,
            border: selectedImageId === item.id ? "2px dashed #00f" : "none",
            cursor: "move",
          }}
        />
      )}
    </Rnd>
  ))}

  {/* Header Style from dropdown */}
  {headerStyle === "ascented" && (
    <div className="absolute top-[10px] left-0 w-full h-[60px] flex flex-col z-0">
      <div style={{ height: "4px", backgroundColor: coverDesign.accentColor, width: "100%" }} />
      <div style={{ flexGrow: 1, backgroundColor: coverDesign.primaryColor }} />
      <div style={{ height: "4px", backgroundColor: coverDesign.accentColor, width: "100%" }} />
    </div>
  )}

{footerStyle === "accentedLine" && (
  <div
    style={{
      position: "absolute",
      bottom: "0px", // stick to page bottom
      left: 0,
      width: "100%",
      height: "4px",
      backgroundColor: coverDesign.accentColor,
      zIndex: 0,
    }}
  />
)}


</div>



  </div>
</div>


        





    </div>
  );
};

export default DesignPage;

