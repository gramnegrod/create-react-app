

  const humanX = flightStage === 'attached' ? 200 + Math.sin(rotation * Math.PI / 180) * 125 : humanPosition.x;
  const humanY = flightStage === 'attached' ? 155 - Math.cos(rotation * Math.PI / 180) * 125 : humanPosition.y;

  const maleBody = "M-5,15 Q0,20 5,15 L5,40 Q0,45 -5,40 Z";
  const femaleBody = "M-5,15 Q0,20 5,15 L7,40 Q0,50 -7,40 Z";
  const maleHair = "M-6,-16 Q0,-20 6,-16 L6,-10 L-6,-10 Z";
  const femaleHair = "M-8,-18 Q0,-22 8,-18 Q10,-10 8,-5 L-8,-5 Q-10,-10 -8,-18 Z";

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <svg viewBox="0 0 400 400" className="w-full h-full max-w-md">
        <rect x="0" y="0" width="400" height="300" fill="#87CEEB" />
        <rect x="0" y="300" width="400" height="100" fill="#8B4513" />
        <rect x="190" y="150" width="20" height="200" fill="#A9A9A9" />
        <g transform={`rotate(${rotation}, 200, 155)`}>
          {[0, 120, 240].map((angle) => (
            <rect
              key={angle}
              x="197"
              y="30"
              width="6"
              height="125"
              fill={isForceTooHigh() ? "#FF0000" : "#F8F8FF"}
              transform={`rotate(${angle}, 200, 155)`}
            />
          ))}
        </g>
        {flightStage !== 'landed' && (
          <g transform={`translate(${humanX}, ${humanY}) rotate(${flightStage === 'attached' ? rotation + 180 : 0})`}>
            <path d={gender === 'male' ? maleBody : femaleBody} fill={gender === 'male' ? "#1E90FF" : "#FF69B4"} />
            <circle cx="0" cy="-10" r="8" fill="#FFE4B5" />
            <path d={gender === 'male' ? maleHair : femaleHair} fill="#8B4513" />
            <line x1="-5" y1="5" x2="-5" y2="-15" stroke="#FFE4B5" strokeWidth="3" />
            <line x1="5" y1="5" x2="5" y2="-15" stroke="#FFE4B5" strokeWidth="3" />
            <line x1="-3" y1="40" x2="-3" y2="55" stroke="#FFE4B5" strokeWidth="3" />
            <line x1="3" y1="40" x2="3" y2="55" stroke="#FFE4B5" strokeWidth="3" />
          </g>
        )}
        {flightStage === 'landed' && (
          <circle cx={humanX} cy={humanY} r={dustCloudSize} fill="#CCCCCC" opacity="0.7" />
        )}
      </svg>

      <div className="w-full max-w-md grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="rpm-input" className="block text-sm font-medium text-gray-700 mb-1">
            RPM (0-500):
          </label>
          <input
            id="rpm-input"
            type="number"
            value={rpm}
            onChange={handleInputChange(setRpm, 0, 500)}
            min="0"
            max="500"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="gender-select" className="block text-sm font-medium text-gray-700 mb-1">
            Gender:
          </label>
          <select
            id="gender-select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="strength-input" className="block text-sm font-medium text-gray-700 mb-1">
            Human Strength (N):
          </label>
          <input
            id="strength-input"
            type="number"
            value={humanStrength}
            onChange={handleInputChange(setHumanStrength, 1, 10000)}
            min="1"
            max="10000"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="weight-input" className="block text-sm font-medium text-gray-700 mb-1">
            Human Weight (lbs):
          </label>
          <input
            id="weight-input"
            type="number"
            value={humanWeightLbs}
            onChange={handleInputChange(setHumanWeightLbs, 1, 1000)}
            min="1"
            max="1000"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      <div className="w-full max-w-md bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Wind Turbine Statistics</h3>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Blade Length</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bladeLength} meters</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">RPM</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rpm}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">RPM Context</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getRpmContext()}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Tip Speed</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateTipSpeed()} mph</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Centripetal Force</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateCentripetalForce()} N</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Force Status</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isForceTooHigh() ? 'text-red-500 font-bold' : 'text-green-500'}`}>
                  {isForceTooHigh() ? 'Exceeds Human Strength' : 'Within Human Strength'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WindTurbine;
