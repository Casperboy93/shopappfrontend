const About = () => {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About BeauService</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2025, BeauService connects skilled professionals with clients 
              who need quality services. We're revolutionizing the service industry 
              through technology and trust.
            </p>
            <p className="text-gray-600">
              Our platform verifies all professionals to ensure you get the best 
              service every time.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To make finding reliable service professionals as easy as a few clicks, 
              while providing workers with fair opportunities and growth.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default About;