import React, { useState } from "react";

const GetStartedPage = () => {
  const [showCover, setShowCover] = useState(false);
  const [coverData, setCoverData] = useState({
    title: "",
    preparedFor: "",
    preparedBy: "",
    date: "",
    summary: "",
  });
  const [pages, setPages] = useState([]); // no pages initially

  const handleAddPage = () => {
    const newId = pages.length + 2; // start numbering from 2 (cover = page 1)
    setPages([...pages, { id: newId, questions: [], show: true }]);
  };

  const handleAddQuestion = (pageId, question) => {
    if (question.trim() === "") return;
    setPages(
      pages.map((page) =>
        page.id === pageId
          ? { ...page, questions: [...page.questions, question] }
          : page
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left Column */}
      <div className="w-full sm:w-1/2 bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-4">Form</h1>
        <p className="text-gray-600 mb-4">
          This section is for filling out the form.
        </p>

        {/* Cover Page Section */}
        <div
          onClick={() => setShowCover(!showCover)}
          className="mb-4 bg-gray-200 px-4 py-2 rounded cursor-pointer flex justify-between items-center hover:bg-gray-300 transition"
        >
          <span className="font-semibold">Cover Page</span>
          <span className="text-lg">{showCover ? "▼" : "▶"}</span>
        </div>

        {showCover && (
          <div className="mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">
                Document Title
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded px-2 py-1 w-full"
                placeholder="e.g., 2025 Roofing Proposal"
                value={coverData.title}
                onChange={(e) =>
                  setCoverData({ ...coverData, title: e.target.value })
                }
              />
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Prepared For
                </label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  placeholder="Client Name"
                  value={coverData.preparedFor}
                  onChange={(e) =>
                    setCoverData({ ...coverData, preparedFor: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Prepared By
                </label>
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  placeholder="Your Name"
                  value={coverData.preparedBy}
                  onChange={(e) =>
                    setCoverData({ ...coverData, preparedBy: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">
                Date
              </label>
              <input
                type="date"
                className="border border-gray-300 rounded px-2 py-1 w-full"
                value={coverData.date}
                onChange={(e) =>
                  setCoverData({ ...coverData, date: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">
                Summary Intro
              </label>
              <textarea
                className="border border-gray-300 rounded px-2 py-1 w-full"
                rows={3}
                placeholder="Write an introduction or summary..."
                value={coverData.summary}
                onChange={(e) =>
                  setCoverData({ ...coverData, summary: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {/* Add Page Button */}
        <button
          onClick={handleAddPage}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add Page
        </button>

        {/* Pages Sections */}
        {pages.map((page) => (
          <div key={page.id} className="mb-4">
            <div
              onClick={() =>
                setPages(
                  pages.map((p) =>
                    p.id === page.id ? { ...p, show: !p.show } : p
                  )
                )
              }
              className="bg-gray-200 px-4 py-2 rounded cursor-pointer flex justify-between items-center hover:bg-gray-300 transition"
            >
              <span className="font-semibold">Page {page.id}</span>
              <span className="text-lg">{page.show ? "▼" : "▶"}</span>
            </div>

            {page.show && (
              <div className="p-2 bg-white border rounded mt-2">
                <div className="mb-2">
                  <label className="block text-gray-700 font-semibold mb-1">
                    Enter Field:
                  </label>
                  <QuestionInput
                    onAdd={(q) => handleAddQuestion(page.id, q)}
                  />
                </div>
                <ul className="space-y-2">
                  {page.questions.map((q, qIndex) => (
                    <li
                      key={qIndex}
                      className="bg-gray-100 p-2 rounded border"
                    >
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right Column - PDF Preview */}
      <div className="w-full sm:w-1/2 bg-black p-8 flex flex-col items-center space-y-8 overflow-y-auto">
        {/* Cover Page */}
        <div className="bg-white w-[428px] h-[554px] p-4 rounded shadow-lg border border-gray-300">

          <h1 className="text-xl font-bold mb-4 text-center">
            {coverData.title || "PDF Document Page 1 (Cover)"}
          </h1>
          <p className="text-sm mb-2">
            <strong>Prepared For:</strong> {coverData.preparedFor || "N/A"}
          </p>
          <p className="text-sm mb-2">
            <strong>Prepared By:</strong> {coverData.preparedBy || "N/A"}
          </p>
          <p className="text-sm mb-2">
            <strong>Date:</strong> {coverData.date || "N/A"}
          </p>
          <div className="mt-2">
            <p className="text-sm italic">
              {coverData.summary || "No summary provided."}
            </p>
          </div>
        </div>

        {/* Added Pages */}
        {pages.map((page) => (
          <div
            key={page.id}
          className="bg-white w-[428px] h-[554px] p-4 rounded shadow-lg border border-gray-300"
          >
            <h1 className="text-xl font-bold mb-4 text-center">
              📄 Page {page.id}
            </h1>
            <div className="overflow-y-auto max-h-[700px]">
              {page.questions.length === 0 ? (
                <p className="text-gray-500 italic text-center">
                  No fields added yet.
                </p>
              ) : (
                page.questions.map((q, index) => (
                  <div key={index} className="mb-4">
                    <p className="font-semibold text-sm">
                      {index + 1}. {q}
                    </p>
                    <div className="border-b border-gray-300 my-1"></div>
                    <input
                      type="text"
                      className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
                      placeholder="(Answer space)"
                      disabled
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuestionInput = ({ onAdd }) => {
  const [input, setInput] = useState("");

  return (
    <div className="flex">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border border-gray-300 rounded-l px-4 py-2 w-full"
        placeholder="Type your field here..."
      />
      <button
        onClick={() => {
          onAdd(input);
          setInput("");
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition"
      >
        Add
      </button>
    </div>
  );
};

export default GetStartedPage;
