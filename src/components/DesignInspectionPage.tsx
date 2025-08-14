import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

type Field = {
  id: string;
  label: string;
  type: "text" | "multipleChoice" | "photo";
  value?: string;
  options?: string[];
};

type DropdownSection = {
  id: string;
  title: string;
  fields: Field[];
  newLabel: string;
  newType: "text" | "multipleChoice" | "photo";
};

type FormElement =
  | { type: "field"; id: string; data: Field }
  | { type: "dropdown"; id: string; data: DropdownSection };

const DesignInspectionPage: React.FC = () => {
  const [formName, setFormName] = useState("Untitled Inspection Form");
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "multipleChoice" | "photo">("text");
  const [activeDropdownForm, setActiveDropdownForm] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
















  //part 2



  // ➕ Add a top-level field
const addField = () => {
  if (!newFieldLabel.trim()) return;

  const newField: Field = {
    id: uuidv4(),
    label: newFieldLabel.trim(),
    type: newFieldType,
    ...(newFieldType === "multipleChoice" ? { options: ["Option 1", "Option 2"] } : {}),
  };

  setFormElements((prev) => [
    ...prev,
    { type: "field", id: uuidv4(), data: newField },
  ]);
  setNewFieldLabel("");
  setNewFieldType("text");
};

// ➕ Add a dropdown section
const addDropdown = () => {
  const newId = uuidv4();
  const newDropdown: DropdownSection = {
    id: newId,
    title: `Section ${formElements.filter((el) => el.type === "dropdown").length + 1}`,
    fields: [],
    newLabel: "",
    newType: "text",
  };
  setFormElements((prev) => [
    ...prev,
    { type: "dropdown", id: newId, data: newDropdown },
  ]);
};

// 🧠 Reorder logic for drag-and-drop
const handleDragEnd = (result: DropResult) => {
  const { source, destination, type } = result;
  if (!destination) return;

  // 🟢 Top-level movement
  if (type === "top-level") {
    const reordered = Array.from(formElements);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    setFormElements(reordered);
  }

  // 🟡 Dropdown field movement
  if (type.startsWith("dropdown-")) {
    const dropdownId = type.split("dropdown-")[1];

    setFormElements((prev) =>
      prev.map((el) => {
        if (el.type !== "dropdown" || el.id !== dropdownId) return el;

        const newFields = Array.from(el.data.fields);
        const [moved] = newFields.splice(source.index, 1);
        newFields.splice(destination.index, 0, moved);

        return {
          ...el,
          data: {
            ...el.data,
            fields: newFields,
          },
        };
      })
    );
  }
};




const deleteElement = (id: string) => {
  setFormElements((prev) => prev.filter((el) => el.id !== id));
};

const deleteFieldInsideDropdown = (dropdownId: string, fieldId: string) => {
  setFormElements((prev) =>
    prev.map((el) =>
      el.type === "dropdown" && el.id === dropdownId
        ? {
            ...el,
            data: {
              ...el.data,
              fields: el.data.fields.filter((f) => f.id !== fieldId),
            },
          }
        : el
    )
  );
};











//Part 3



return (
  <div className="p-6 max-w-5xl mx-auto">
    <h1 className="text-3xl font-bold mb-4">🛠️ Design Your Inspection</h1>

    <div className="mb-4">
      <label className="font-semibold mb-1 block">Form Name</label>
      <input
        type="text"
        className="border px-4 py-2 w-full rounded"
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
      />
    </div>

    {/* Add Field */}
    <div className="mb-6 bg-gray-100 p-4 rounded">
      <h2 className="text-xl font-semibold mb-3">➕ Add Top-Level Field</h2>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Field Label"
          className="border px-3 py-1 rounded w-1/2"
          value={newFieldLabel}
          onChange={(e) => setNewFieldLabel(e.target.value)}
        />
        <select
          className="border px-3 py-1 rounded"
          value={newFieldType}
          onChange={(e) => setNewFieldType(e.target.value as Field["type"])}
        >
          <option value="text">Text Input</option>
          <option value="multipleChoice">Multiple Choice</option>
          <option value="photo">Photo Upload</option>
        </select>
        <button onClick={addField} className="bg-black text-white px-4 py-1 rounded">
          Add
        </button>
      </div>
    </div>

    {/* Add Dropdown */}
    <div className="mb-8 bg-gray-100 p-4 rounded">
      <h2 className="text-xl font-semibold mb-3">➕ Add Dropdown Section</h2>
      <button
        onClick={addDropdown}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Add Dropdown
      </button>
    </div>

    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="formElements" type="top-level">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {formElements.map((element, index) => (
              <Draggable key={element.id} draggableId={element.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-6 bg-white p-4 rounded shadow"
                  >
                    {/* Render Top-Level Field */}
                   {element.type === "field" && (
  <div className="relative">
    <h4 className="font-bold mb-2">{element.data.label}</h4>
    {element.data.type === "text" && (
      <input
        disabled
        type="text"
        className="border px-3 py-2 rounded w-full"
        placeholder="Text input preview"
      />
    )}
    {element.data.type === "photo" && (
      <div className="text-gray-400 italic">
        [Photo Upload Placeholder]
      </div>
    )}
    {element.data.type === "multipleChoice" && (
      <ul className="pl-4">
        {element.data.options?.map((opt, i) => (
          <li key={i} className="text-gray-600">
            ◉ {opt}
          </li>
        ))}
      </ul>
    )}
    <button
      onClick={() => deleteElement(element.id)}
      className="absolute top-0 right-0 text-sm text-red-600"
    >
      ✖ Delete Field
    </button>
  </div>
)}


                    {/* Render Dropdown Section */}
                 {element.type === "dropdown" && (
  <>
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-bold">{element.data.title}</h3>
      <button
        className="text-sm text-blue-600"
        onClick={() =>
          setCollapsedSections((prev) => ({
            ...prev,
            [element.id]: !prev[element.id],
          }))
        }
      >
        {collapsedSections[element.id] ? "Expand" : "Collapse"}
      </button>
    </div>

    {!collapsedSections[element.id] && (
      <Droppable droppableId={`dropdown-${element.id}`} type={`dropdown-${element.id}`}>
        {(dropProvided) => (
          <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
            {element.data.fields.map((field, i) => (
              <Draggable key={field.id} draggableId={field.id} index={i}>
                {(dragProvided) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    className="bg-gray-100 p-3 rounded mb-2"
                  >
                    <div className="font-semibold">{field.label}</div>
                    {field.type === "text" && (
                      <input
                        type="text"
                        disabled
                        placeholder="Text input"
                        className="border p-2 w-full rounded mt-1"
                      />
                    )}
                    {field.type === "photo" && (
                      <div className="mt-1 text-gray-500 italic">
                        [Photo Upload Placeholder]
                      </div>
                    )}
                    {field.type === "multipleChoice" && (
                      <ul className="pl-4 mt-1">
                        {(field.options || []).map((opt, idx) => (
                          <li key={idx} className="text-gray-600">
                            ◉ {opt}
                          </li>
                        ))}
                      </ul>
                    )}
                    <button
                      onClick={() => deleteFieldInsideDropdown(element.id, field.id)}
                      className="text-sm text-red-500 mt-1"
                    >
                      ✖ Delete
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {dropProvided.placeholder}
          </div>
        )}
      </Droppable>
    )}
  </>
)}

                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>

    <div className="text-right mt-6">
<button
  className="bg-blue-600 text-white px-6 py-2 rounded"
  onClick={() => {
    const cleanStructure = formElements.map((el) => {
      if (el.type === "field") {
        return { type: "field", ...el.data };
      }
      if (el.type === "dropdown") {
        return {
          type: "dropdown",
          title: el.data.title,
          fields: el.data.fields,
        };
      }
      return null;
    });
    console.log("🧾 Clean Structure:", cleanStructure);
    alert("Saved! Check console for export.");
  }}
>
  Save Inspection Form
</button>
</div>
</div>
);
};

export default DesignInspectionPage;


