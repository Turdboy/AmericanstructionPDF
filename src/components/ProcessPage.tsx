import React from "react";
import { useNavigate } from "react-router-dom";

const ProcessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-6 py-12">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center mb-10">
        How Our System Works
      </h1>

      {/* Step-by-Step Process */}
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Step 1 */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Step 1: Complete the Survey</h2>
          <p className="text-gray-700">
            Our detailed survey collects key information about your business.
            This data is securely saved and forms the foundation of your
            customized public profile.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">
            Step 2: Get Your Public Profile
          </h2>
          <p className="text-gray-700">
            Using your survey responses, we automatically generate a unique,
            professional profile. This profile is public and shareable, helping
            your business get discovered by new customers, sponsors, and
            partners.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">
            Step 3: Monetize with Stripe
          </h2>
          <p className="text-gray-700">
            Unlock premium features, sponsorship opportunities, and creator
            tools. Stripe integration makes it easy to manage payments and grow
            your brand.
          </p>
        </div>
      </div>

      {/* Call-to-Action */}
      <div className="text-center mt-12">
        <button
  onClick={() => navigate("/profilesurvey")}
  className="bg-[#111111] text-white px-4 py-2 rounded hover:bg-gray-800"
>
  Start Survey
</button>
      </div>
    </div>
  );
};

export default ProcessPage;