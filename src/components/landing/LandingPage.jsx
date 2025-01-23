import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../common/AnimatedBackground';
import { useState, useEffect } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white relative overflow-hidden">
      <AnimatedBackground />

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-[#0a0a0b]/50 backdrop-blur-lg z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0 group cursor-pointer">
              <div className="text-3xl font-bold relative overflow-hidden">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-300% bg-clip-text text-transparent animate-text-gradient inline-block transform group-hover:scale-110 transition-transform">
                  Chat-app
                </span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="relative px-6 py-2.5 rounded-lg text-white/90 hover:text-white transition-all hover:scale-105 overflow-hidden group"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </button>
              <button
                onClick={() => navigate('/login')}
                className="relative px-6 py-2.5 rounded-lg overflow-hidden group"
              >
                <span className="relative z-10 text-black font-medium">Open Chat-app</span>
                <div className="absolute inset-0 bg-white transition-transform duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Floating Elements */}
      <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-[800px] h-[800px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="relative">
            <h1 
              className={`text-7xl md:text-8xl lg:text-9xl font-bold mb-8 transition-all duration-1000 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-text-gradient inline-block">
                IMAGINE A PLACE
              </span>
            </h1>
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-float-slow"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-20 animate-float-slow delay-1000"></div>
          </div>
          
          <p 
            className={`text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto transition-all duration-1000 delay-300 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Where you can belong to a school club, a gaming group, or a worldwide art community. 
            A place that makes it easy to talk every day and hang out more often.
          </p>

          <div 
            className={`flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 transition-all duration-1000 delay-500 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <button
              onClick={() => navigate('/login')}
              className="group relative px-8 py-4 rounded-full bg-white text-[#0a0a0b] hover:bg-opacity-90 transition-all hover:scale-105 font-medium text-lg flex items-center justify-center overflow-hidden"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                Open Chat-app in your browser
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Features Section with Interactive Cards */}
      <div className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎮",
                title: "Create an invite-only place",
                description: "Chat-appservers are organized into topic-based channels where you can collaborate, share, and just talk about your day without clogging up a group chat.",
                gradient: "from-blue-400 to-purple-400"
              },
              {
                icon: "🎯",
                title: "Where hanging out is easy",
                description: "Grab a seat in a voice channel when you're free. Friends in your server can see you're around and instantly pop in to talk without having to call.",
                gradient: "from-purple-400 to-pink-400"
              },
              {
                icon: "🚀",
                title: "From few to a fandom",
                description: "Get any community running with moderation tools and custom member access. Give members special powers, set up private channels, and more.",
                gradient: "from-pink-400 to-blue-400"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 transform hover:scale-105 transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:to-purple-400/10 rounded-2xl transition-all duration-300"></div>
                <div className={`text-5xl mb-4 transform transition-transform duration-300 ${hoveredCard === index ? 'scale-110' : ''}`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                  {feature.title}
                </h3>
                <p className="text-white/70 relative z-10">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="relative py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Ready to start your journey?
          </h2>
          <button
            onClick={() => navigate('/login')}
            className="group relative px-8 py-4 rounded-full overflow-hidden"
          >
            <span className="relative z-10 text-white group-hover:text-black transition-colors duration-300">
              Get Started Now
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400"></div>
            <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>

      {/* Footer with Gradient Border */}
      <footer className="relative bg-[#0a0a0b] py-12">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 text-center text-white/50">
          <p>© 2024 Chat-app. Created for educational purposes.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 