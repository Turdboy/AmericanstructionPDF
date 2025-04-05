<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { CompanyCamService } from "../services/CompanyCamService";

const ReportGenerator = () => {
    const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reportData, setReportData] = useState<any>(null);

    const companyCamService = new CompanyCamService();

    // Fetch projects when component loads
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectList = await companyCamService.getProjects();
                setProjects(projectList);
            } catch (error) {
                setError("Failed to load projects");
            }
        };
        fetchProjects();
    }, []);

    const handleGenerateReport = async () => {
        if (!selectedProject) {
            setError("Please select a project.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setReportData(null);

        try {
            const response = await companyCamService.generateReport(selectedProject);
            setReportData(response.results);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">AI-Powered Roof Analysis</h2>

            {/* Select Project Dropdown */}
            <label className="block mb-2">Select Project:</label>
            <select
                className="p-2 border rounded w-full"
                value={selectedProject || ""}
                onChange={(e) => setSelectedProject(e.target.value)}
            >
                <option value="">-- Select a Project --</option>
                {projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                ))}
            </select>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {/* Generate Report Button */}
            <button
                className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded ${isLoading ? "opacity-50" : ""}`}
                onClick={handleGenerateReport}
                disabled={isLoading}
            >
                {isLoading ? "Generating..." : "Generate Report"}
            </button>

            {/* Display AI Analysis Results */}
            {reportData && (
                <div className="mt-6 p-4 border rounded bg-gray-100">
                    <h3 className="font-bold">Report Results:</h3>
                    {reportData.map((result: any, index: number) => (
                        <p key={index}>Image: {result.image}, Damage: {result.damageDetected}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReportGenerator;
=======
import React, { useState, useEffect } from "react";
import { CompanyCamService } from "../services/CompanyCamService";

const ReportGenerator = () => {
    const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reportData, setReportData] = useState<any>(null);

    const companyCamService = new CompanyCamService();

    // Fetch projects when component loads
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectList = await companyCamService.getProjects();
                setProjects(projectList);
            } catch (error) {
                setError("Failed to load projects");
            }
        };
        fetchProjects();
    }, []);

    const handleGenerateReport = async () => {
        if (!selectedProject) {
            setError("Please select a project.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setReportData(null);

        try {
            const response = await companyCamService.generateReport(selectedProject);
            setReportData(response.results);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">AI-Powered Roof Analysis</h2>

            {/* Select Project Dropdown */}
            <label className="block mb-2">Select Project:</label>
            <select
                className="p-2 border rounded w-full"
                value={selectedProject || ""}
                onChange={(e) => setSelectedProject(e.target.value)}
            >
                <option value="">-- Select a Project --</option>
                {projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                ))}
            </select>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {/* Generate Report Button */}
            <button
                className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded ${isLoading ? "opacity-50" : ""}`}
                onClick={handleGenerateReport}
                disabled={isLoading}
            >
                {isLoading ? "Generating..." : "Generate Report"}
            </button>

            {/* Display AI Analysis Results */}
            {reportData && (
                <div className="mt-6 p-4 border rounded bg-gray-100">
                    <h3 className="font-bold">Report Results:</h3>
                    {reportData.map((result: any, index: number) => (
                        <p key={index}>Image: {result.image}, Damage: {result.damageDetected}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReportGenerator;
>>>>>>> ecb285a5 (final update)
