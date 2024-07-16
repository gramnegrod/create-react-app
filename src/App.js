import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [rotation, setRotation] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [humanStrength, setHumanStrength] = useState(705);
  const [humanWeightLbs, setHumanWeightLbs] = useState(154);
  const [gender, setGender] = useState('male');
  const [flightStage, setFlightStage] = useState('attached');
  const [humanPosition, setHumanPosition] = useState({ x: 0, y: 0 });
  const bladeLength = 65;
  const highForceStartTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prevRotation => (prevRotation + (rpm / 60)) % 360);
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [rpm]);

  useEffect(() => {
    if (gender === 'male') {
      setHumanStrength(705);
      setHumanWeightLbs(154);
    } else {
      setHumanStrength(375);
      setHumanWeightLbs(132);
    }
  }, [gender]);

  useEffect(() => {
    const checkFallCondition = () => {
      const force = parseFloat(calculateCentripetalForce());
      if (force > humanStrength) {
        if (highForceStartTimeRef.current === null) {
          highForceStartTimeRef.current = Date.now();
        } else {
          const elapsedTime = Date.now() - highForceStartTimeRef.current;
          if (elapsedTime >= 4000 && flightStage === 'attached') {
            setFlightStage('falling');
            animateFall();
            highForceStartTimeRef.current = null;
          }
        }
      } else {
        highForceStartTimeRef.current = null;
      }
      animationFrameRef.current = requestAnimationFrame(checkFallCondition);
    };

    checkFallCondition();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [rpm, humanStrength, humanWeightLbs, flightStage]);

  const calculateCentripetalForce = () => {
    const angularVelocity = (rpm * 2 * Math.PI) / 60;
    const humanWeightKg = humanWeightLbs / 2.20462;
    return (humanWeightKg * Math.pow(angularVelocity, 2) * bladeLength).toFixed(2);
  };

  const calculateTipSpeed = () => {
    const tipSpeedMps = (2 * Math.PI * bladeLength * rpm) / 60;
    return (tipSpeedMps * 2.23694).toFixed(2);
  };

  const isForceTooHigh = () => parseFloat(calculateCentripetalForce()) > humanStrength;

  const handleInputChange = (setter, min, max) => (e) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue >= min && parsedValue <= max) {
      setter(parsedValue);
    } else if (value === "") {
      setter(min);
    }
  };

  const getRpmContext = () => {
    if (rpm === 0) return "Turbine is stationary";
    if (rpm <= 20) return "Within typical operational range";
    if (rpm <= 100) return "Exceeds normal operational speeds";
    return "Extremely dangerous and unrealistic speed";
  };

  const animateFall = () => {
    const startY = 155 - Math.cos(rotation * Math.PI / 180) * 125;
    const startX = 200 + Math.sin(rotation * Math.PI / 180) * 125;
    let t = 0;
    const g = 9.81;

    const animate = () => {
      t += 0.016;
      const y = startY + 0.5 * g * t * t;

      if (y < 390) {
        setHumanPosition({ x: startX, y });
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setFlightStage('landed');
        setHumanPosition({ x: startX, y: 390 });
        setTimeout(() => setFlightStage('attached'), 3000);
      }
    };

    animate();
  };

  const humanX = flightStage === 'attached' ? 200 + Math.sin(rotation * Math.PI / 180) * 125 : humanPosition.x;
  const humanY = flightStage === 'attached' ? 155 - Math.cos(rotation * Math.PI / 180) * 125 : humanPosition.y;

  const maleBody = "M-5,15 Q0,20 5,15 L5,40 Q0,45 -5,40 Z";
  const femaleBody = "M-5,15 Q0,20 5,15 L7,40 Q0,50 -7,40 Z";
  const maleHair = "M-6,-16 Q0,-20 6,-16 L6,-10 L-6,-10 Z";
  const femaleHair = "M-8,-18 Q0,-22 8,-18 Q10,-10 8,-5 L-8,-5 Q-10,-10 -8,-18 Z";

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Wind Turbine Simulation</h1>
      
      <svg viewBox="0 0 400 400" style={{ width: '100%', maxWidth: '400px', margin: '0 auto', display: 'block' }}>
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
          <g transform={`translate(${humanX}, ${humanY}) rotate(${flightStage === 'attached' ? rotation + 180 : 0}) scale(0.5)`}>
            <path d={gender === 'male' ? maleBody : femaleBody} fill={gender === 'male' ? "#1E90FF" : "#FF69B4"} />
            <circle cx="0" cy="-10" r="8" fill="#FFE4B5" />
            <path d={gender === 'male' ? maleHair : femaleHair} fill="#8B4513" />
            <line x1="-5" y1="5" x2="-5" y2="-15" stroke="#FFE4B5" strokeWidth="3" />
            <line x1="5" y1="5" x2="5" y2="-15" stroke="#FFE4B5" strokeWidth="3" />
            <line x1="-3" y1="40" x2="-3" y2="55" stroke="#FFE4B5" strokeWidth="3" />
            <line x1="3" y1="40" x2="3" y2="55" stroke="#FFE4B5" strokeWidth="3" />
          </g>
        )}
      </svg>

      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label>RPM (0-500):</label>
          <input type="number" value={rpm} onChange={handleInputChange(setRpm, 0, 500)} min="0" max="500" style={{ width: '100%' }} />
        </div>
        <div>
          <label>Gender:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ width: '100%' }}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Human Strength (N):</label>
          <input type="number" value={humanStrength} onChange={handleInputChange(setHumanStrength, 1, 10000)} min="1" max="10000" style={{ width: '100%' }} />
        </div>
        <div>
          <label>Human Weight (lbs):</label>
          <input type="number" value={humanWeightLbs} onChange={handleInputChange(setHumanWeightLbs, 1, 1000)} min="1" max="1000" style={{ width: '100%' }} />
        </div>
      </div>

      <div style={{ marginTop: '20px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
        <h3>Wind Turbine Statistics</h3>
        <p>Blade Length: {bladeLength} meters</p>
        <p>RPM: {rpm}</p>
        <p>RPM Context: {getRpmContext()}</p>
        <p>Tip Speed: {calculateTipSpeed()} mph</p>
        <p>Centripetal Force: {calculateCentripetalForce()} N</p>
        <p>Force Status: {isForceTooHigh() ? 'Exceeds Human Strength' : 'Within Human Strength'}</p>
      </div>
    </div>
  );
}

export default App;
