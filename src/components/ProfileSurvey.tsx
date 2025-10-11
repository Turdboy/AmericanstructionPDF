// src/components/ProfileSurvey.tsx
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { saveInspectionDraftToFirestore as saveProfileDraftToFirestore } from "../services/inspectionService";
import { uploadImageToStorage } from "../services/imageservices";

const ProfileSurvey: React.FC = () => {
  const { currentUser } = useAuth();

  // ---------------- STATE ----------------
  const [profileData, setProfileData] = useState({
    businessName: "",
    tagline: "",
    description: "",
    industry: "",
    location: "",
    website: "",
    contactEmail: "",
    phone: "",
    sponsorshipGoals: "",
    socialLinks: {
      instagram: "",
      facebook: "",
      linkedin: "",
      youtube: "",
    },
  });

  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<
    { name: string; role: string; image?: string }[]
  >([]);
  const [newTeam, setNewTeam] = useState({ name: "", role: "" });

  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState("");

  const [testimonials, setTestimonials] = useState<string[]>([]);
  const [newTestimonial, setNewTestimonial] = useState("");

  // ---------------- HANDLERS ----------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "cover" | "gallery" | "team"
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!currentUser) return alert("You must be logged in to upload images.");
    const url = await uploadImageToStorage(file, `profiles/${currentUser.uid}`);

    if (type === "logo") setLogoImage(url);
    if (type === "cover") setCoverImage(url);
    if (type === "gallery") setGalleryImages((prev) => [...prev, url]);
    if (type === "team") {
      const updated = [...teamMembers];
      updated[updated.length - 1].image = url;
      setTeamMembers(updated);
    }
  };

  const addService = () => {
    if (!newService.trim()) return;
    setServices((prev) => [...prev, newService.trim()]);
    setNewService("");
  };

  const addTeamMember = () => {
    if (!newTeam.name.trim() || !newTeam.role.trim()) return;
    setTeamMembers((prev) => [...prev, { ...newTeam }]);
    setNewTeam({ name: "", role: "" });
  };

  const addTestimonial = () => {
    if (!newTestimonial.trim()) return;
    setTestimonials((prev) => [...prev, newTestimonial.trim()]);
    setNewTestimonial("");
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return alert("Please log in to save a profile.");

    const finalProfile = {
      profileData,
      logoImage,
      coverImage,
      galleryImages,
      teamMembers,
      services,
      testimonials,
      published: false,
      createdAt: new Date().toISOString(),
    };

    await saveProfileDraftToFirestore(
      currentUser.uid,
      profileData.businessName,
      finalProfile
    );

    alert("✅ Profile saved successfully!");
  };

  // ---------------- UI ----------------
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto text-center mt-12">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          You must be logged in
        </h2>
        <p className="text-gray-700">
          Please log in to create and save your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      {/* Logged-in user info */}
      <div className="mb-6 p-4 border rounded bg-gray-50 text-sm">
        <p>
          Logged in as:{" "}
          <span className="font-semibold">{currentUser.email}</span>
        </p>
        <p className="text-gray-600">UID: {currentUser.uid}</p>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center text-[#7C3AED]">
        Build Your Business Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Business Basics */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Business Basics</h2>
          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            value={profileData.businessName}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="text"
            name="tagline"
            placeholder="Tagline"
            value={profileData.tagline}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
          />
          <textarea
            name="description"
            placeholder="Business Description"
            value={profileData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={profileData.location}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="text"
            name="website"
            placeholder="Website"
            value={profileData.website}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="email"
            name="contactEmail"
            placeholder="Contact Email"
            value={profileData.contactEmail}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={profileData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </section>

        {/* Social Media */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Social Media</h2>
          {Object.keys(profileData.socialLinks).map((platform) => (
            <input
              key={platform}
              type="text"
              name={platform}
              placeholder={`${platform} link`}
              value={
                profileData.socialLinks[
                  platform as keyof typeof profileData.socialLinks
                ]
              }
              onChange={handleSocialChange}
              className="w-full border p-2 rounded mb-2"
            />
          ))}
        </section>

        {/* Branding */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Branding</h2>
          <label>Upload Logo</label>
          <input type="file" onChange={(e) => handleImageUpload(e, "logo")} />
          {logoImage && <img src={logoImage} alt="Logo" className="w-24 mt-2" />}
          <label>Upload Cover Image</label>
          <input type="file" onChange={(e) => handleImageUpload(e, "cover")} />
          {coverImage && (
            <img src={coverImage} alt="Cover" className="w-48 mt-2 rounded" />
          )}
        </section>

        {/* Services */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Services</h2>
          <div className="flex mb-2">
            <input
              type="text"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="Add a service"
              className="flex-1 border p-2 rounded"
            />
            <button
              type="button"
              onClick={addService}
              className="ml-2 px-4 py-2 bg-[#111] text-white rounded"
            >
              Add
            </button>
          </div>
          <ul className="list-disc ml-5">
            {services.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        {/* Gallery */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Gallery</h2>
          <input type="file" onChange={(e) => handleImageUpload(e, "gallery")} />
          <div className="flex flex-wrap gap-2 mt-2">
            {galleryImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Gallery"
                className="w-24 h-24 object-cover rounded"
              />
            ))}
          </div>
        </section>

        {/* Team */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Team Members</h2>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Name"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              className="flex-1 border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Role"
              value={newTeam.role}
              onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })}
              className="flex-1 border p-2 rounded"
            />
            <button
              type="button"
              onClick={addTeamMember}
              className="px-4 py-2 bg-[#111] text-white rounded"
            >
              Add
            </button>
          </div>
          <ul className="list-disc ml-5">
            {teamMembers.map((tm, i) => (
              <li key={i}>
                {tm.name} – {tm.role}
              </li>
            ))}
          </ul>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Testimonials</h2>
          <textarea
            placeholder="Add a testimonial"
            value={newTestimonial}
            onChange={(e) => setNewTestimonial(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <button
            type="button"
            onClick={addTestimonial}
            className="px-4 py-2 bg-[#111] text-white rounded"
          >
            Add
          </button>
          <ul className="list-disc ml-5 mt-2">
            {testimonials.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>

        {/* Sponsorship */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Sponsorship Goals</h2>
          <textarea
            name="sponsorshipGoals"
            placeholder="Describe your goals for sponsorship"
            value={profileData.sponsorshipGoals}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </section>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#7C3AED] text-white py-3 rounded font-bold hover:bg-[#5B21B6]"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileSurvey;