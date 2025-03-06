import { useState } from "react";

const ChallengesGoalsStep=({ data, updateData, onBack, onNext })=> {
    const [errors, setErrors] = useState({});
  
    const challengeOptions = [
      "Pest Management",
      "Disease Control",
      "Soil Health",
      "Water Management",
      "Yield Optimization",
      "Weather Related",
      "Market Access",
      "Other",
    ];
  
    const goalOptions = [
      "Increase Yield",
      "Reduce Costs",
      "Improve Soil Health",
      "Better Pest Management",
      "Access Market Intelligence",
      "Sustainable Farming Practices",
      "Water Conservation",
    ];
  
    const validate = () => {
      const newErrors = {};
      if (data.challenges.length === 0)
        newErrors.challenges = "Select at least one challenge";
      if (data.goals.length !== 3) newErrors.goals = "Select exactly 3 goals";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleNext = () => {
      if (validate()) onNext();
    };
  
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Challenges
          </label>
          <div className="grid grid-cols-2 gap-2">
            {challengeOptions.map((challenge) => (
              <label key={challenge} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={data.challenges.includes(challenge)}
                  onChange={(e) => {
                    let newChallenges;
                    if (challenge === "Other" && e.target.checked) {
                      newChallenges = ["Other"];
                    } else if (challenge === "Other" && !e.target.checked) {
                      newChallenges = data.challenges.filter(
                        (c) => c !== "Other"
                      );
                    } else if (data.challenges.includes("Other")) {
                      newChallenges = data.challenges;
                    } else {
                      newChallenges = e.target.checked
                        ? [...data.challenges, challenge]
                        : data.challenges.filter((c) => c !== challenge);
                    }
                    updateData({
                      ...data,
                      challenges: newChallenges,
                      challengeOther:
                        challenge === "Other" && !e.target.checked
                          ? ""
                          : data.challengeOther,
                    });
                  }}
                  disabled={
                    challenge !== "Other" && data.challenges.includes("Other")
                  }
                  className="rounded text-[#4a8b3f] focus:ring-[#4a8b3f]"
                />
                <span>{challenge}</span>
              </label>
            ))}
          </div>
          {errors.challenges && (
            <p className="mt-1 text-sm text-red-600">{errors.challenges}</p>
          )}
        </div>
  
        {data.challenges.includes("Other") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Other Challenge Details
            </label>
            <input
              type="text"
              value={data.challengeOther || ""}
              onChange={(e) =>
                updateData({
                  ...data,
                  challengeOther: e.target.value,
                })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-[#4a8b3f] focus:border-[#4a8b3f]"
            />
          </div>
        )}
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Top 3 Goals (in order of priority)
          </label>
          <div className="space-y-2">
            {goalOptions.map((goal) => (
              <label key={goal} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={data.goals.includes(goal)}
                  onChange={(e) => {
                    let newGoals = [...data.goals];
                    if (e.target.checked && newGoals.length < 3) {
                      newGoals.push(goal);
                    } else if (!e.target.checked) {
                      newGoals = newGoals.filter((g) => g !== goal);
                    }
                    updateData({
                      ...data,
                      goals: newGoals,
                    });
                  }}
                  disabled={!data.goals.includes(goal) && data.goals.length >= 3}
                  className="rounded text-[#4a8b3f] focus:ring-[#4a8b3f]"
                />
                <span>{goal}</span>
                {data.goals.includes(goal) && (
                  <span className="text-sm text-gray-500">
                    (Priority {data.goals.indexOf(goal) + 1})
                  </span>
                )}
              </label>
            ))}
          </div>
          {errors.goals && (
            <p className="mt-1 text-sm text-red-600">{errors.goals}</p>
          )}
        </div>
  
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="border-2 border-[#4a8b3f] text-[#4a8b3f] hover:bg-[#4a8b3f] hover:text-white font-bold py-2 px-6 rounded-lg transition duration-300"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-[#4a8b3f] hover:bg-[#3a6d31] text-white font-bold py-2 px-6 rounded-lg transition duration-300"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

export default ChallengesGoalsStep;