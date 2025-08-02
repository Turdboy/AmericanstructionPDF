import { generatePowerWashPDF } from "../utils/generatePowerWashPDF";

const ChooseFormPage = () => {
  const location = useLocation();
  const design = location.state?.design;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({});

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Fill Out Your Power Washing Info</h1>
      <PowerWashingForm data={formData} onChange={setFormData} />

      <button
        onClick={() => generatePowerWashPDF(formData, design)}
        className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
      >
        Generate Full Proposal PDF
      </button>
    </div>
  );
};
