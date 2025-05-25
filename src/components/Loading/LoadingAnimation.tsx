import { useState, useEffect } from 'react';
import { AnimateKeyframes } from 'react-simple-animate';

const LoadingAnimation = () => {
  const text = 'catchUp';
  const characters = text.split('');
  const [playKey, setPlayKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayKey((prev) => prev + 1);
    }, 1500); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        fontSize: '24px',
        fontFamily: 'monospace',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '3rem',
      }}
    >
      {characters.map((char, index) => (
        <AnimateKeyframes
          key={`${playKey}-${index}`}
          play
          duration={0.75}
          delay={index * 0.1}
          keyframes={[
            'transform: translateY(0px)',
            'transform: translateY(-15px)',
            'transform: translateY(0px)',
          ]}
          iterationCount={1}
          easeType="ease-in-out"
        >
          <span style={{ display: 'inline-block' }}>
            {char}
          </span>
        </AnimateKeyframes>
      ))}
    </div>
  );
};

export default LoadingAnimation;