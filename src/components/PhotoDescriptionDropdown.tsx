import React from "react";

interface Props {
  label: string;
  options: string[];
  selected: string[];
  onChange: (newValues: string[]) => void;
}

const PhotoDescriptionDropdown: React.FC<Props> = ({ label, options, selected, onChange }) => {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(o => o !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ fontWeight: "bold" }}>{label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "5px" }}>
        {options.map((option) => (
          <button
            key={option}
             type="button"  // ← ADD THIS LINE
            onClick={() => toggleOption(option)}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: selected.includes(option) ? "2px solid black" : "1px solid gray",
              backgroundColor: selected.includes(option) ? "#d1d5db" : "white",
              cursor: "pointer"
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PhotoDescriptionDropdown;
