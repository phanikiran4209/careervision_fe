"use client";
import { useState, ChangeEvent } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

// Define TypeScript interfaces for the resume data
interface ResumeData {
  name: string;
  title: string;
  phone: string;
  email: string;
  location: string;
  github: string;
  linkedin: string;
  website: string;
  summary: string;
  education: string;
  workExperience: WorkExperience[];
  technicalSkills: string[];
  softSkills: string[];
  additionalSkills: string[];
  certifications: string[];
}

interface WorkExperience {
  company: string;
  role: string;
  duration: string;
  description: string[];
}

// Define template types
type TemplateType = "classic" | "two-column" | "modern" | "compact" | "creative";

// Default resume data
const defaultResumeData: ResumeData = {
  name: "Marcus Hall",
  title: "Developer",
  phone: "+1-555-0100",
  email: "beddylea@gmail.com",
  location: "San Francisco, CA",
  github: "github.com/bedivere-lea",
  linkedin: "linkedin.com/in/bedivere-lea",
  website: "bedivere-lea.github.io",
  summary:
    "Resourceful Developer with 11 years of experience in designing and developing user interfaces, testing and training employees. Skilled at utilizing a wide variety of tools and programs to provide effective applications.",
  education: "New York University\nBachelor of Computer Science\nAug, 2020 - Jul, 2024",
  workExperience: [
    {
      company: "Torph TTC",
      role: "Developer",
      duration: "Feb, 2023 - Feb, 2023",
      description: [
        "Created and maintained 10 web applications for numerous national and foreign clients.",
        "Ensured that the user interfaces and user experience of the software applications developed by the team met at least 80% of users expectations.",
        "Created and analyzed 500 unit test cases.",
        "Developed python scripts to automate image noise-reduction process which helped improve research analysis time by 40%.",
        "Established and lead a team of 10 people, covering every key role in the early stages.",
      ],
    },
    {
      company: "Reilty Group",
      role: "Front End Web Developer",
      duration: "Feb, 2023 - Mar, 2023",
      description: [
        "Increased by 35% the reach of users to the platform, over the installation of the web platform in mobile devices.",
        "Delivered 30 web solutions.",
      ],
    },
  ],
  technicalSkills: ["JavaScript", "Python", "Web Services", "C++", "HTML5", "CSS", "SQL", "User Interface", "Creativity"],
  softSkills: ["Collaboration", "Problem-solving", "Communication", "Time management", "Result-oriented"],
  additionalSkills: ["Public Speaking", "Writing", "Research", "Leadership"],
  certifications: ["Certified Web Professional", "Java Development Certified Professional"],
};

const Templates: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [templateType, setTemplateType] = useState<TemplateType>("classic");

  // Handle input changes for text fields
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle array field changes (e.g., skills, certifications)
  const handleArrayChange = (field: keyof ResumeData, index: number, value: string) => {
    setResumeData((prev) => {
      const updatedArray = [...(prev[field] as string[])];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
  };

  // Add a new item to an array field
  const addArrayItem = (field: keyof ResumeData) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""],
    }));
  };

  // Remove an item from an array field
  const removeArrayItem = (field: keyof ResumeData, index: number) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  // Download the resume as PDF
  const downloadPDF = () => {
    const input = document.getElementById("resume-preview");
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Handle multiple pages if the content is too long
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Add "@careervisionvvit" at the bottom of the last page
        pdf.setFontSize(10);
        pdf.text("@careervisionvvit", 105, pageHeight - 10, { align: "center" });

        pdf.save("resume.pdf");
      });
    }
  };

  // Render the resume preview based on the selected template
  const renderResumePreview = () => {
    switch (templateType) {
      case "classic":
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center text-white">{resumeData.name}</h1>
            <p className="text-center text-gray-300 mb-4">{resumeData.title}</p>
            <div className="flex justify-center gap-4 text-sm mb-4">
              <p className="flex items-center">
                <FaPhone className="text-orange-500 mr-2" />
                <span className="text-gray-300">{resumeData.phone}</span>
              </p>
              <p className="flex items-center">
                <FaEnvelope className="text-orange-500 mr-2" />
                <span className="text-gray-300">{resumeData.email}</span>
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="text-orange-500 mr-2" />
                <span className="text-gray-300">{resumeData.location}</span>
              </p>
            </div>
            <div className="flex justify-center gap-4 text-sm mb-4">
              <a href={resumeData.github} target="_blank" rel="noopener noreferrer" className="text-orange-500">
                <FaGithub className="inline mr-1" /> {resumeData.github}
              </a>
              <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer" className="text-orange-500">
                <FaLinkedin className="inline mr-1" /> {resumeData.linkedin}
              </a>
              <a href={resumeData.website} target="_blank" rel="noopener noreferrer" className="text-orange-500">
                <FaGlobe className="inline mr-1" /> {resumeData.website}
              </a>
            </div>

            <hr className="my-4 border-gray-600" />

            <h2 className="text-xl font-bold mb-2 text-white">Summary</h2>
            <p className="text-gray-300 mb-4">{resumeData.summary}</p>

            <h2 className="text-xl font-bold mb-2 text-white">Education</h2>
            <p className="text-gray-300 mb-4 whitespace-pre-line">{resumeData.education}</p>

            <h2 className="text-xl font-bold mb-2 text-white">Work Experience</h2>
            {resumeData.workExperience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold text-orange-500">{exp.company}</h3>
                  <p className="text-gray-300">{exp.duration}</p>
                </div>
                <p className="text-gray-300">{exp.role}</p>
                <ul className="list-disc list-inside">
                  {exp.description.map((desc, i) => (
                    <li key={i} className="text-gray-300">{desc}</li>
                  ))}
                </ul>
              </div>
            ))}

            <h2 className="text-xl font-bold mb-2 text-white">Technical Skills</h2>
            <p className="text-gray-300 mb-4">{resumeData.technicalSkills.join(", ")}</p>

            <h2 className="text-xl font-bold mb-2 text-white">Soft Skills</h2>
            <p className="text-gray-300 mb-4">{resumeData.softSkills.join(", ")}</p>

            <h2 className="text-xl font-bold mb-2 text-white">Additional Skills</h2>
            <p className="text-gray-300 mb-4">{resumeData.additionalSkills.join(", ")}</p>

            <h2 className="text-xl font-bold mb-2 text-white">Certifications</h2>
            <p className="text-gray-300 mb-4">{resumeData.certifications.join(", ")}</p>
          </div>
        );

      case "two-column":
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex">
            {/* Left Column */}
            <div className="w-1/3 bg-gray-700 p-4">
              <h1 className="text-2xl font-bold text-center text-white">{resumeData.name}</h1>
              <p className="text-center text-gray-300 mb-4">{resumeData.title}</p>
              <div className="text-sm mb-4">
                <p className="flex items-center mb-2">
                  <FaPhone className="text-orange-500 mr-2" />
                  <span className="text-gray-300">{resumeData.phone}</span>
                </p>
                <p className="flex items-center mb-2">
                  <FaEnvelope className="text-orange-500 mr-2" />
                  <span className="text-gray-300">{resumeData.email}</span>
                </p>
                <p className="flex items-center mb-2">
                  <FaMapMarkerAlt className="text-orange-500 mr-2" />
                  <span className="text-gray-300">{resumeData.location}</span>
                </p>
                <p className="flex items-center mb-2">
                  <FaGithub className="text-orange-500 mr-2" />
                  <a href={resumeData.github} target="_blank" rel="noopener noreferrer" className="text-orange-500">
                    {resumeData.github}
                  </a>
                </p>
                <p className="flex items-center mb-2">
                  <FaLinkedin className="text-orange-500 mr-2" />
                  <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer" className="text-orange-500">
                    {resumeData.linkedin}
                  </a>
                </p>
                <p className="flex items-center mb-2">
                  <FaGlobe className="text-orange-500 mr-2" />
                  <a href={resumeData.website} target="_blank" rel="noopener noreferrer" className="text-orange-500">
                    {resumeData.website}
                  </a>
                </p>
              </div>

              <h2 className="text-lg font-bold mb-2 text-white">Technical Skills</h2>
              <p className="text-gray-300 mb-4">{resumeData.technicalSkills.join(", ")}</p>

              <h2 className="text-lg font-bold mb-2 text-white">Soft Skills</h2>
              <p className="text-gray-300 mb-4">{resumeData.softSkills.join(", ")}</p>

              <h2 className="text-lg font-bold mb-2 text-white">Additional Skills</h2>
              <p className="text-gray-300 mb-4">{resumeData.additionalSkills.join(", ")}</p>

              <h2 className="text-lg font-bold mb-2 text-white">Certifications</h2>
              <p className="text-gray-300 mb-4">{resumeData.certifications.join(", ")}</p>
            </div>

            {/* Right Column */}
            <div className="w-2/3 p-4">
              <h2 className="text-xl font-bold mb-2 text-white">Summary</h2>
              <p className="text-gray-300 mb-4">{resumeData.summary}</p>

              <h2 className="text-xl font-bold mb-2 text-white">Education</h2>
              <p className="text-gray-300 mb-4 whitespace-pre-line">{resumeData.education}</p>

              <h2 className="text-xl font-bold mb-2 text-white">Work Experience</h2>
              {resumeData.workExperience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold text-orange-500">{exp.company}</h3>
                    <p className="text-gray-300">{exp.duration}</p>
                  </div>
                  <p className="text-gray-300">{exp.role}</p>
                  <ul className="list-disc list-inside">
                    {exp.description.map((desc, i) => (
                      <li key={i} className="text-gray-300">{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case "modern":
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
            <h1 className="text-3xl font-bold text-center text-white">{resumeData.name}</h1>
            <p className="text-center text-gray-300 mb-4">{resumeData.title}</p>
            <div className="flex justify-center gap-4 text-sm mb-4">
              <p className="flex items-center">
                <FaPhone className="text-orange-500 mr-2" />
                <span className="text-gray-300">{resumeData.phone}</span>
              </p>
              <p className="flex items-center">
                <FaEnvelope className="text-orange-500 mr-2" />
                <span className="text-gray-300">{resumeData.email}</span>
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="text-orange-500 mr-2" />
                <span className="text-gray-300">{resumeData.location}</span>
              </p>
            </div>
            <div className="flex justify-center gap-4 text-sm mb-4">
              <a href={resumeData.github} target="_blank" rel="noopener noreferrer" className="text-orange-500">
                <FaGithub className="inline mr-1" /> {resumeData.github}
              </a>
              <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer" className="text-orange-500">
                <FaLinkedin className="inline mr-1" /> {resumeData.linkedin}
              </a>
              <a href={resumeData.website} target="_blank" rel="noopener noreferrer" className="text-orange-500">
                <FaGlobe className="inline mr-1" /> {resumeData.website}
              </a>
            </div>

            <hr className="my-4 border-gray-600" />

            <h2 className="text-xl font-semibold mb-2 text-white border-b-2 border-orange-500 pb-1">Summary</h2>
            <p className="text-gray-300 mb-4">{resumeData.summary}</p>

            <h2 className="text-xl font-semibold mb-2 text-white border-b-2 border-orange-500 pb-1">Education</h2>
            <p className="text-gray-300 mb-4 whitespace-pre-line">{resumeData.education}</p>

            <h2 className="text-xl font-semibold mb-2 text-white border-b-2 border-orange-500 pb-1">Work Experience</h2>
            {resumeData.workExperience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold text-orange-500">{exp.company}</h3>
                  <p className="text-gray-300">{exp.duration}</p>
                </div>
                <p className="text-gray-300">{exp.role}</p>
                <ul className="list-disc list-inside">
                  {exp.description.map((desc, i) => (
                    <li key={i} className="text-gray-300">{desc}</li>
                  ))}
                </ul>
              </div>
            ))}

            <h2 className="text-xl font-semibold mb-2 text-white border-b-2 border-orange-500 pb-1">Technical Skills</h2>
            <p className="text-gray-300 mb-4">{resumeData.technicalSkills.join(", ")}</p>

            <h2 className="text-xl font-semibold mb-2 text-white border-b-2 border-orange-500 pb-1">Soft Skills</h2>
            <p className="text-gray-300 mb-4">{resumeData.softSkills.join(", ")}</p>

            <h2 className="text-xl font-semibold mb-2 text-white border-b-2 border-orange-500 pb-1">Additional Skills</h2>
            <p className="text-gray-300 mb-4">{resumeData.additionalSkills.join(", ")}</p>

            <h2 className="text-xl font-semibold mb-2 text-white border-b-2 border-orange-500 pb-1">Certifications</h2>
            <p className="text-gray-300 mb-4">{resumeData.certifications.join(", ")}</p>
          </div>
        );

      case "compact":
        return (
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center text-white">{resumeData.name}</h1>
            <p className="text-center text-gray-300 mb-2">{resumeData.title}</p>
            <div className="flex justify-center gap-2 text-xs mb-2">
              <p className="flex items-center">
                <FaPhone className="text-orange-500 mr-1" />
                <span className="text-gray-300">{resumeData.phone}</span>
              </p>
              <p className="flex items-center">
                <FaEnvelope className="text-orange-500 mr-1" />
                <span className="text-gray-300">{resumeData.email}</span>
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="text-orange-500 mr-1" />
                <span className="text-gray-300">{resumeData.location}</span>
              </p>
            </div>
            <div className="flex justify-center gap-2 text-xs mb-2">
              <a href={resumeData.github} target="_blank" rel="noopener noreferrer" className="text-orange-500">
                <FaGithub className="inline mr-1" /> {resumeData.github}
              </a>
              <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer" className="text-orange-500">
                <FaLinkedin className="inline mr-1" /> {resumeData.linkedin}
              </a>
              <a href={resumeData.website} target="_blank" rel="noopener noreferrer" className="text-orange-500">
                <FaGlobe className="inline mr-1" /> {resumeData.website}
              </a>
            </div>

            <hr className="my-2 border-gray-600" />

            <h2 className="text-lg font-bold mb-1 text-white">Summary</h2>
            <p className="text-gray-300 mb-2 text-sm">{resumeData.summary}</p>

            <h2 className="text-lg font-bold mb-1 text-white">Education</h2>
            <p className="text-gray-300 mb-2 text-sm whitespace-pre-line">{resumeData.education}</p>

            <h2 className="text-lg font-bold mb-1 text-white">Work Experience</h2>
            {resumeData.workExperience.map((exp, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between">
                  <h3 className="text-sm font-semibold text-orange-500">{exp.company}</h3>
                  <p className="text-gray-300 text-xs">{exp.duration}</p>
                </div>
                <p className="text-gray-300 text-xs">{exp.role}</p>
                <ul className="list-disc list-inside text-xs">
                  {exp.description.map((desc, i) => (
                    <li key={i} className="text-gray-300">{desc}</li>
                  ))}
                </ul>
              </div>
            ))}

            <h2 className="text-lg font-bold mb-1 text-white">Technical Skills</h2>
            <p className="text-gray-300 mb-2 text-sm">{resumeData.technicalSkills.join(", ")}</p>

            <h2 className="text-lg font-bold mb-1 text-white">Soft Skills</h2>
            <p className="text-gray-300 mb-2 text-sm">{resumeData.softSkills.join(", ")}</p>

            <h2 className="text-lg font-bold mb-1 text-white">Additional Skills</h2>
            <p className="text-gray-300 mb-2 text-sm">{resumeData.additionalSkills.join(", ")}</p>

            <h2 className="text-lg font-bold mb-1 text-white">Certifications</h2>
            <p className="text-gray-300 mb-2 text-sm">{resumeData.certifications.join(", ")}</p>
          </div>
        );

      case "creative":
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex">
            {/* Left Column */}
            <div className="w-1/3 bg-gray-700 p-4">
              <h1 className="text-2xl font-bold text-center text-white">{resumeData.name}</h1>
              <p className="text-center text-gray-300 mb-4">{resumeData.title}</p>
              <div className="text-sm mb-4">
                <p className="flex items-center mb-2">
                  <FaPhone className="text-orange-500 mr-2" />
                  <span className="text-gray-300">{resumeData.phone}</span>
                </p>
                <p className="flex items-center mb-2">
                  <FaEnvelope className="text-orange-500 mr-2" />
                  <span className="text-gray-300">{resumeData.email}</span>
                </p>
                <p className="flex items-center mb-2">
                  <FaMapMarkerAlt className="text-orange-500 mr-2" />
                  <span className="text-gray-300">{resumeData.location}</span>
                </p>
                <p className="flex items-center mb-2">
                  <FaGithub className="text-orange-500 mr-2" />
                  <a href={resumeData.github} target="_blank" rel="noopener noreferrer" className="text-orange-500">
                    {resumeData.github}
                  </a>
                </p>
                <p className="flex items-center mb-2">
                  <FaLinkedin className="text-orange-500 mr-2" />
                  <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer" className="text-orange-500">
                    {resumeData.linkedin}
                  </a>
                </p>
                <p className="flex items-center mb-2">
                  <FaGlobe className="text-orange-500 mr-2" />
                  <a href={resumeData.website} target="_blank" rel="noopener noreferrer" className="text-orange-500">
                    {resumeData.website}
                  </a>
                </p>
              </div>

              <h2 className="text-lg font-bold mb-2 text-white">Technical Skills</h2>
              <p className="text-gray-300 mb-4">{resumeData.technicalSkills.join(", ")}</p>

              <h2 className="text-lg font-bold mb-2 text-white">Soft Skills</h2>
              <p className="text-gray-300 mb-4">{resumeData.softSkills.join(", ")}</p>

              <h2 className="text-lg font-bold mb-2 text-white">Additional Skills</h2>
              <p className="text-gray-300 mb-4">{resumeData.additionalSkills.join(", ")}</p>

              <h2 className="text-lg font-bold mb-2 text-white">Certifications</h2>
              <p className="text-gray-300 mb-4">{resumeData.certifications.join(", ")}</p>
            </div>

            {/* Right Column */}
            <div className="w-2/3 p-4">
              <h2 className="text-xl font-bold mb-2 text-white">Summary</h2>
              <p className="text-gray-300 mb-4">{resumeData.summary}</p>

              <h2 className="text-xl font-bold mb-2 text-white">Education</h2>
              <p className="text-gray-300 mb-4 whitespace-pre-line">{resumeData.education}</p>

              <h2 className="text-xl font-bold mb-2 text-white">Work Experience</h2>
              {resumeData.workExperience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold text-orange-500">{exp.company}</h3>
                    <p className="text-gray-300">{exp.duration}</p>
                  </div>
                  <p className="text-gray-300">{exp.role}</p>
                  <ul className="list-disc list-inside">
                    {exp.description.map((desc, i) => (
                      <li key={i} className="text-gray-300">{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="bg-[#1A2526] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Resume Template Preview</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Side: Input Form */}
          <div className="w-full md:w-1/2 bg-gray-800 text-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between mb-4">
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all">Load Data</button>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all">Save Data</button>
            </div>

            <h2 className="text-xl font-bold mb-4 text-white">Personal Information</h2>
            <input
              type="text"
              name="name"
              value={resumeData.name}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Name"
            />
            <input
              type="text"
              name="title"
              value={resumeData.title}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Title"
            />
            <input
              type="text"
              name="phone"
              value={resumeData.phone}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Phone"
            />
            <input
              type="email"
              name="email"
              value={resumeData.email}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Email"
            />
            <input
              type="text"
              name="location"
              value={resumeData.location}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Location"
            />

            <h2 className="text-xl font-bold mb-4 text-white">Social Media</h2>
            <input
              type="text"
              name="github"
              value={resumeData.github}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="GitHub"
            />
            <input
              type="text"
              name="linkedin"
              value={resumeData.linkedin}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="LinkedIn"
            />
            <input
              type="text"
              name="website"
              value={resumeData.website}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Website"
            />

            <h2 className="text-xl font-bold mb-4 text-white">Summary</h2>
            <textarea
              name="summary"
              value={resumeData.summary}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Summary"
              rows={4}
            />

            <h2 className="text-xl font-bold mb-4 text-white">Education</h2>
            <textarea
              name="education"
              value={resumeData.education}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Education"
              rows={3}
            />

            <h2 className="text-xl font-bold mb-4 text-white">Work Experience</h2>
            {resumeData.workExperience.map((exp, index) => (
              <div key={index} className="mb-4">
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) =>
                    setResumeData((prev) => {
                      const updated = [...prev.workExperience];
                      updated[index].company = e.target.value;
                      return { ...prev, workExperience: updated };
                    })
                  }
                  className="w-full p-2 mb-2 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Company"
                />
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) =>
                    setResumeData((prev) => {
                      const updated = [...prev.workExperience];
                      updated[index].role = e.target.value;
                      return { ...prev, workExperience: updated };
                    })
                  }
                  className="w-full p-2 mb-2 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Role"
                />
                <input
                  type="text"
                  value={exp.duration}
                  onChange={(e) =>
                    setResumeData((prev) => {
                      const updated = [...prev.workExperience];
                      updated[index].duration = e.target.value;
                      return { ...prev, workExperience: updated };
                    })
                  }
                  className="w-full p-2 mb-2 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Duration"
                />
                {exp.description.map((desc, descIndex) => (
                  <textarea
                    key={descIndex}
                    value={desc}
                    onChange={(e) =>
                      setResumeData((prev) => {
                        const updated = [...prev.workExperience];
                        updated[index].description[descIndex] = e.target.value;
                        return { ...prev, workExperience: updated };
                      })
                    }
                    className="w-full p-2 mb-2 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={`Description ${descIndex + 1}`}
                    rows={2}
                  />
                ))}
                <button
                  onClick={() =>
                    setResumeData((prev) => {
                      const updated = [...prev.workExperience];
                      updated[index].description.push("");
                      return { ...prev, workExperience: updated };
                    })
                  }
                  className="text-sm text-orange-500 underline mb-2"
                >
                  Add Description
                </button>
                <button
                  onClick={() =>
                    setResumeData((prev) => ({
                      ...prev,
                      workExperience: prev.workExperience.filter((_, i) => i !== index),
                    }))
                  }
                  className="text-sm text-red-400 underline ml-4"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setResumeData((prev) => ({
                  ...prev,
                  workExperience: [
                    ...prev.workExperience,
                    { company: "", role: "", duration: "", description: [""] },
                  ],
                }))
              }
              className="text-sm text-orange-500 underline mb-4"
            >
              Add Work Experience
            </button>

            <h2 className="text-xl font-bold mb-4 text-white">Technical Skills</h2>
            {resumeData.technicalSkills.map((skill, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleArrayChange("technicalSkills", index, e.target.value)}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder={`Technical Skill ${index + 1}`}
                />
                <button
                  onClick={() => removeArrayItem("technicalSkills", index)}
                  className="ml-2 text-red-400"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem("technicalSkills")}
              className="text-sm text-orange-500 underline mb-4"
            >
              Add Technical Skill
            </button>

            <h2 className="text-xl font-bold mb-4 text-white">Soft Skills</h2>
            {resumeData.softSkills.map((skill, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleArrayChange("softSkills", index, e.target.value)}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder={`Soft Skill ${index + 1}`}
                />
                <button
                  onClick={() => removeArrayItem("softSkills", index)}
                  className="ml-2 text-red-400"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem("softSkills")}
              className="text-sm text-orange-500 underline mb-4"
            >
              Add Soft Skill
            </button>

            <h2 className="text-xl font-bold mb-4 text-white">Additional Skills</h2>
            {resumeData.additionalSkills.map((skill, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleArrayChange("additionalSkills", index, e.target.value)}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder={`Additional Skill ${index + 1}`}
                />
                <button
                  onClick={() => removeArrayItem("additionalSkills", index)}
                  className="ml-2 text-red-400"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem("additionalSkills")}
              className="text-sm text-orange-500 underline mb-4"
            >
              Add Additional Skill
            </button>

            <h2 className="text-xl font-bold mb-4 text-white">Certifications</h2>
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={cert}
                  onChange={(e) => handleArrayChange("certifications", index, e.target.value)}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder={`Certification ${index + 1}`}
                />
                <button
                  onClick={() => removeArrayItem("certifications", index)}
                  className="ml-2 text-red-400"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem("certifications")}
              className="text-sm text-orange-500 underline mb-4"
            >
              Add Certification
            </button>
          </div>

          {/* Right Side: Resume Preview */}
          <div className="w-full md:w-1/2">
            <div className="mb-4">
              <label className="block text-white mb-2">Select Template:</label>
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value as TemplateType)}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="classic">Classic (Single-Column)</option>
                <option value="two-column">Two-Column</option>
                <option value="modern">Modern (Single-Column)</option>
                <option value="compact">Compact (Single-Column)</option>
                <option value="creative">Creative (Two-Column)</option>
              </select>
            </div>
            <div id="resume-preview">
              {renderResumePreview()}
            </div>
            <button
              onClick={downloadPDF}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg w-full text-center hover:bg-orange-600 transition-all"
            >
              Download as PDF
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Templates;