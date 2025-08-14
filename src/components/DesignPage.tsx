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


  const [pageCount, setPageCount] = useState(2); // starts with 2 pages (cover + 1)
  const [pagesExpanded, setPagesExpanded] = useState(false);


const defaultColor = "#4444ff"; // or any hex you like
const [coverDesign, setCoverDesign] = useState({
  primaryColor: "#001f3f",  // 🌑 Navy / Dark Blue
  accentColor: "#8B0000",   // 🟥 Dark Red
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


const [showFormBuilder, setShowFormBuilder] = useState(false);


const [showHeaderFooterTextOptions, setShowHeaderFooterTextOptions] = useState(false);
const [showHeaderFooterImageOptions, setShowHeaderFooterImageOptions] = useState(false);
const [showThemeColors, setShowThemeColors] = useState(false);


const [formSections, setFormSections] = useState<{ title: string; fields: { label: string; type: string; options: string[] }[] }[]>([]);


const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
  setDraggedIndex(index);
};

const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
  if (draggedIndex === null) return;
  const updatedSections = [...formSections];
  const [movedSection] = updatedSections.splice(draggedIndex, 1);
  updatedSections.splice(index, 0, movedSection);
  setFormSections(updatedSections);
  setDraggedIndex(null);
};








useEffect(() => {
  setDesigns((prevDesigns) =>
    prevDesigns.map((design) => {
      if (design.type === "footer" || design.type === "ascented") {
        return {
          ...design,
          primaryColor: coverDesign.primaryColor || "#000000",
          accentColor: coverDesign.accentColor || "#ff0000",
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

const createNewText = (page = 1) => ({
  id: Date.now(),
  text: "",          // ✅ Default text
  color: "#ffffff",             // ✅ Light color to show on dark backgrounds
  rotation: 0,
  fontSize: 16,
  width: 150,
  height: 30,
  x: 50,
  y: 50,
  zIndex: Date.now(),
  page,
});


const createNewDesign = () => ({
  id: Date.now(),
  type: "footer",
  primaryColor: coverDesign.primaryColor || "#000000",
  accentColor: coverDesign.accentColor || "#ff0000",
  rotation: 0,
  width: 300,
  height: 40,
  x: 50,
  y: 50,
  zIndex: Date.now(),
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


const updateSectionTitle = (index: number, title: string) => {
  const newSections = [...formSections];
  newSections[index].title = title;
  setFormSections(newSections);
};

const addSection = () => {
  setFormSections([
    ...formSections,
    {
      title: "",
      fields: [] // start empty!
    }
  ]);
};


const addField = (sectionIndex: number) => {
  setFormSections(prev => {
    const updated = [...prev];

    // Only allow ONE field per section
    if (updated[sectionIndex].fields.length === 0) {
      updated[sectionIndex].fields.push({
        label: "",
        type: "",
        options: []
      });
    }

    return updated;
  });
};


const updateField = (sIndex: number, fIndex: number, label: string) => {
  const newSections = [...formSections];
  newSections[sIndex].fields[fIndex].label = label;
  setFormSections(newSections);
};

const updateFieldType = (sIndex: number, fIndex: number, type: string) => {
  const newSections = [...formSections];
  newSections[sIndex].fields[fIndex].type = type;
  setFormSections(newSections);
};

const deleteField = (sIndex: number, fIndex: number) => {
  const newSections = [...formSections];
  newSections[sIndex].fields.splice(fIndex, 1);
  setFormSections(newSections);
};

  




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


        <div className="mb-6">






          <h2 className="text-xl font-bold mb-2 mt-6">Add Elements:</h2>
          <div className="flex flex-col space-y-3">
            <div>
              <button
                className="bg-gray-800 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded shadow transition w-full text-left"
onClick={() => setShowShapeOptions(prev => !prev)}
              >
              Shapes Menu
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
                Text Menu
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
   Design Menu
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
    Image Menu
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

{/* 🔽 New Dropdown Panel for Inspection Form Layout */}
<div className="border-t border-gray-300 mt-8 pt-6">
  <button
    className="w-full text-left text-lg font-semibold mb-2 flex justify-between items-center"
    onClick={() => setShowFormBuilder(!showFormBuilder)}
  >
    <span>📋 Inspection Form Builder</span>
    <span>{showFormBuilder ? "▲" : "▼"}</span>
  </button>

  {showFormBuilder && (
    <div className="border p-4 rounded bg-gray-50 dark:bg-gray-800 dark:text-white">
      <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
        <strong>Instructions:</strong> Each section can only have one field. Start by entering a section title, then click <em>Add Field</em> to define the input type and label. If you choose “Multiple Choice,” you can add options.
      </p>

{formSections.map((section, sIndex) => (
  <div
    key={sIndex}
    className="mb-6 border p-4 bg-white dark:bg-gray-900 rounded cursor-move"
    draggable
    onDragStart={(e) => handleDragStart(e, sIndex)}
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => handleDrop(e, sIndex)}
  >
    <div className="flex items-center mb-2">
      <span className="mr-2 font-bold text-lg">#{sIndex + 1}</span>
      <label className="block font-semibold">Section Heading:</label>
    </div>

          <label className="block font-semibold mb-1">Section Heading:</label>
          <input
            type="text"
            placeholder="Leave Blank if you Don't Want Your Field to have a Label"
            value={section.title}
            onChange={(e) => updateSectionTitle(sIndex, e.target.value)}
            className="mb-3 border p-2 w-full rounded dark:bg-gray-800 dark:text-white"
          />

          {section.fields.length === 0 && (
            <button
              onClick={() => addField(sIndex)}
              className="text-blue-600 text-sm mb-2"
            >
              + Add Field
            </button>
          )}

          {section.fields.map((field, fIndex) => (
            <div key={fIndex} className="mb-3">
              <div className="flex gap-2 items-center mb-2">
               <select
  value={field.type}
  onChange={(e) => updateFieldType(sIndex, fIndex, e.target.value)}
  className="border p-2 rounded text-black bg-white"
>

  <option value="text">Text Input</option>
  <option value="number">Number Input</option>
  <option value="checkbox">Checkbox</option>
  <option value="multipleChoice">Multiple Choice</option>
  <option value="image">Image Upload</option>
  <option value="signature">Signature</option>
  <option value="initials">Initials</option>
  <option value="price">Price Field</option>
  <option value="address">Address</option>
  <option value="date">Date Picker</option>
  <option value="document">Upload Document (PDF)</option>
  <option value="note">Read-Only Note</option>
  <option value="checkboxGroup">Checkbox Group</option>
</select>


                <input
                  type="text"
                  placeholder="Field Label (e.g., Roof Age)"
                  value={field.label}
                  onChange={(e) => updateField(sIndex, fIndex, e.target.value)}
                  className="border p-2 flex-1 rounded dark:bg-gray-800 dark:text-white"
                />

                <button
                  onClick={() => deleteField(sIndex, fIndex)}
                  className="text-red-500 text-sm"
                >
                  🗑️
                </button>
              </div>

              {field.type === "multiple-choice" && (
                <div className="pl-4">
                  {field.options?.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2 mb-1">
                      <input
                        type="text"
                        placeholder={`Option ${oIndex + 1}`}
                        value={option}
                        onChange={(e) =>
                          updateOption(sIndex, fIndex, oIndex, e.target.value)
                        }
                        className="border p-1 rounded w-full dark:bg-gray-800 dark:text-white"
                      />
                      <button
                        onClick={() => removeOption(sIndex, fIndex, oIndex)}
                        className="text-red-400 text-sm"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(sIndex, fIndex)}
                    className="text-blue-600 text-sm mt-1"
                  >
                    + Add Option
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={addSection}
        className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
      >
        + Add New Section
      </button>
    </div>
  )}
</div>





</div>





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
    form: { formData: {} },
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



  </div>
</div>


        





    </div>
  );
};

export default DesignPage;

