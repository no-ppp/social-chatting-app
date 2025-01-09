import { useEffect, useState } from 'react';

const AnimatedBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const particlesCount = 50;
    const newParticles = Array.from({ length: particlesCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 1 + 0.5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animowane cząsteczki */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.speed * 10}s`,
          }}
        />
      ))}
      
      {/* Animowane gradienty */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl -top-48 -left-24 animate-pulse-slow mix-blend-screen"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl top-96 -right-24 animate-float-slow mix-blend-screen"></div>
      <div className="absolute w-[300px] h-[300px] bg-pink-500/20 rounded-full blur-3xl bottom-0 left-1/2 animate-bounce-slow mix-blend-screen"></div>
    </div>
  );
};

export default AnimatedBackground; 