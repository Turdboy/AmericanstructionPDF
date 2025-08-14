import React from "react";
import { useLocation } from "react-router-dom";
import PowerWashingForm from "./forms/PowerWashingForm";

const CustomInspectionPage = () => {
const location = useLocation();
const { form, coverDesign, texts, shapes, designs, images } = location.state || {};

if (!form) return <p>No form data found.</p>;

if (form.field === "Power Washing") {
  return (
    <PowerWashingForm
      data={form}
      coverDesign={form.coverDesign || {}}
      shapes={form.shapes || []}
      texts={form.texts || []}
      designs={form.designs || []}
      images={form.images || []}
    />
  );
}


};

export default CustomInspectionPage;
