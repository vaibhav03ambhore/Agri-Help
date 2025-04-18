import React from "react";
import { useState } from "react";
import BasicInformationStep from "../components/BasicInformationStep";
import ChallengesGoalsStep from "../components/ChallengesGoalsStep";
import TechnologyStep from "../components/TechnologyStep";
import FarmDetailsStep from "../components/FarmerDetailStep";
import { api } from '../utils/apiService';
import { Link } from "react-router-dom";

const GetStarted=()=> {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    basicInfo: {
      fullName: "",
      email: "",
      contactNumber: "",
      location: "",
    },
    farmDetails: {
      farmSize: "",
      farmSizeUnit: "acres",
      farmingType: "",
      currentCrops: [],
      plannedCrops: [],
      growingSeason: "",
    },
    challenges: [],
    challengeOther: "",
    goals: [],
    technology: [],
  });
  const updateFormData = (section, data) => {
    if (section === "technology") {
      setFormData((prev) => ({ ...prev, technology: data }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], ...data },
      }));
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const profileData = {
        basicInfo: formData.basicInfo,
        farmDetails: formData.farmDetails, 
        technology: formData.technology, 
        cropSelections: [
          ...formData.farmDetails.currentCrops.map((crop) => ({
            name: crop,
            isCurrent: true,
            isPlanned: false,
            growingSeason: formData.farmDetails.growingSeason,
          })),
          ...formData.farmDetails.plannedCrops.map((crop) => ({
            name: crop,
            isCurrent: false,
            isPlanned: true,
            growingSeason: formData.farmDetails.growingSeason,
          })),
        ],
        challenges: formData.challenges.map((challenge) => ({
          type: challenge,
          details: challenge === "Other" ? formData.challengeOther : "",
        })),
        goals: formData.goals.map((goal, index) => ({
          type: goal,
          priority: index + 1,
        })),
      };
      
      await api.createFarmerProfile(profileData);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, name: "Basic Information" },
    { number: 2, name: "Farm Details" },
    { number: 3, name: "Challenges & Goals" },
    { number: 4, name: "Technology" },
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-[#4a8b3f] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#2c5530] mb-4">
              Profile Created Successfully!
            </h2>
            <p className="text-gray-600 mb-8">
              Your farmer profile has been created. We're excited to help you
              optimize your farming operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="bg-[#4a8b3f] hover:bg-[#3a6d31] text-white font-bold py-3 px-8 rounded-lg transition duration-300">
                Return to Home
              </Link>
              
              <Link
                to="/dashboard"
                className="border-2 border-[#4a8b3f] text-[#4a8b3f] hover:bg-[#4a8b3f] hover:text-white font-bold py-3 px-8 rounded-lg transition duration-300"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="relative py-12 bg-gradient-to-r from-[#2c5530] to-[#1a331d] mb-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get Started with AgriHelp
          </h1>
          <p className="text-xl opacity-90">
            Tell us about your farm to get personalized recommendations
          </p>
        </div>
        <div className="fixed bottom-4 right-4 z-50 group">
          <Link to="/account/signin" className="block">
            <div className="bg-[#4a8b3f] p-2 rounded-full cursor-pointer hover:bg-[#3a6d31] transition-colors relative">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <div className="absolute hidden group-hover:block bg-black text-white text-sm py-1 px-2 rounded -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                Login
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= s.number
                      ? "bg-[#4a8b3f] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {s.number}
                </div>
                <div
                  className={`hidden sm:block ml-2 text-sm ${
                    step >= s.number ? "text-[#4a8b3f]" : "text-gray-600"
                  }`}
                >
                  {s.name}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block w-12 h-[2px] mx-2 bg-gray-200" />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <BasicInformationStep
              data={formData.basicInfo}
              updateData={(data) => updateFormData("basicInfo", data)}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <FarmDetailsStep
              data={formData.farmDetails}
              updateData={(data) => updateFormData("farmDetails", data)}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <ChallengesGoalsStep
              data={{
                challenges: formData.challenges,
                challengeOther: formData.challengeOther,
                goals: formData.goals,
              }}
              updateData={(data) => {
                setFormData((prev) => ({
                  ...prev,
                  challenges: data.challenges,
                  challengeOther: data.challengeOther,
                  goals: data.goals,
                }));
              }}
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
            />
          )}

          {step === 4 && (
            <TechnologyStep
              data={formData.technology}
              updateData={(data) => updateFormData("technology", data)}
              onBack={() => setStep(3)}
              onSubmit={handleSubmit}
              loading={loading}
            />
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>        
    </div>
  );
}







export default GetStarted;