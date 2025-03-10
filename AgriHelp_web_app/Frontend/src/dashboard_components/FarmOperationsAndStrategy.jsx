//FarmOperationsAndStrategy.jsx
const FarmOperationsAndStrategy=({ challenges, goals, technology })=> {
  const getPriorityText = (index) => {
    const priorities = ["High", "Medium", "Low"];
    return priorities[index] || "";
  };

  console.log(challenges);
  console.log(goals);
  console.log(technology);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Farm Operations & Strategy
      </h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-3">
            <i className="fas fa-exclamation-triangle text-orange-500"></i>
            <h3 className="text-lg font-medium text-gray-800">
              Current Challenges
            </h3>
          </div>
          {challenges && challenges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {challenges.map((challenge, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700"
                >
                  {challenge.type}
                  {challenge.details && (
                    <span className="ml-1 text-orange-600">
                      : {challenge.details}
                    </span>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No current challenges reported</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-3">
            <i className="fas fa-bullseye text-blue-500"></i>
            <h3 className="text-lg font-medium text-gray-800">Top 3 Goals</h3>
          </div>
          {goals && goals.length > 0 ? (
            <div className="space-y-2">
              {goals.map((goal, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-blue-50"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-600 font-medium">
                      #{index + 1}
                    </span>
                    <span className="text-gray-800">{goal.type}</span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {getPriorityText(index)} Priority
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No goals set</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-3">
            <i className="fas fa-microchip text-purple-500"></i>
            <h3 className="text-lg font-medium text-gray-800">
              Current Technology Usage
            </h3>
          </div>
          {technology && technology.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {technology.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700"
                >
                  <i className="fas fa-check-circle mr-1 text-purple-500"></i>
                  {tech}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No technology usage reported</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FarmOperationsAndStrategy;
  