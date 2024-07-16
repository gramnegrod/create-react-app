

import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [rotation, setRotation] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [humanStrength, setHumanStrength] = useState(705);
  const [humanWeightLbs, setHumanWeightLbs] = useState(154);
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
    const checkFallCondition = () => {
      const force = parseFloat(calculateCentripetalForce());
      console.log(`Current force: ${force}, Human strength: ${humanStrength}`);
      
      if (force > humanStrength) {
        console.log("Force is too high");
        if (highForceStartTimeRef.current === null) {
          console.log("Starting high force timer");
          highForceStartTimeRef.current = Date.now();
        } else {
          const elapsedTime = Date.now() - highForceStartTimeRef.current;
          console.log(`High force duration: ${elapsedTime}ms`);
          if (elapsedTime >= 4000 && flightStage === 'attached') {
            console.log("4 seconds passed, initiating fall");
            setFlightStage('falling');
            animateFall();
            highForceStartTimeRef.current = null;
          }
        }
      } else {
        if (highForceStartTimeRef.current !== null) {
          console.log("Force is no longer too high, resetting timer");
          highForceStartTimeRef.current = null;
        }
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

  const animateFall = () => {
    console.log("animateFall function called");
    const startY = 155 - Math.cos(rotation * Math.PI / 180) * 125;
    const startX = 200 + Math.sin(rotation * Math.PI / 180) * 125;
    let t = 0;
    const g = 9.81;

    const animate = () => {
      t += 0.016;
      const y = startY + 0.5 * g * t * t;

      console.log(`Falling: x=${startX}, y=${y}`);

      if (y < 390) {
        setHumanPosition({ x: startX, y });
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        console.log("Human has landed");
        setFlightStage('landed');
        setHumanPosition({ x: startX, y: 390 });
        setTimeout(() => {
          setFlightStage('attached');
        }, 3000);
      }
    };

    animate();
  };

  const handleRpmChange = (e) => {
    setRpm(Math.min(500, Math.max(0, parseInt(e.target.value) || 0)));
  };

  return (
    <div className="App">
      <h1>Wind Turbine Simulation</h1>
      <div>
        <label>
          RPM (0-500):
          <input type="number" value={rpm} onChange={handleRpmChange} min="0" max="500" />
        </label>
      </div>
      <div>
        <svg width="400" height="400">
          <circle cx="200" cy="200" r="150" fill="lightblue" />
          <g transform={`rotate(${rotation}, 200, 200)`}>
            <rect x="197" y="50" width="6" height="150" fill={parseFloat(calculateCentripetalForce()) > humanStrength ? "red" : "white"} />
          </g>
          {flightStage !== 'landed' && (
            <circle
              cx={flightStage === 'attached' ? 200 + Math.sin(rotation * Math.PI / 180) * 150 : humanPosition.x}
              cy={flightStage === 'attached' ? 200 - Math.cos(rotation * Math.PI / 180) * 150 : humanPosition.y}
              r="10"
              fill="blue"
            />
          )}
        </svg>
      </div>
      <div>
        <p>Force: {calculateCentripetalForce()} N</p>
        <p>Human Strength: {humanStrength} N</p>
        <p>Flight Stage: {flightStage}</p>
      </div>
    </div>
  );
}

export default App;