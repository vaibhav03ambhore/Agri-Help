import { useRef } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import VideoModal from "../components/VideoModal";
import { api } from '../utils/apiService';
import { Link } from "react-router-dom";

const Home = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;
  const sliderRef = useRef(null);
  // const demoVideoUrl = "https://www.youtube.com/embed/Nf8mL8vaMIY?si=CT7uG9YtKRr-flss";
  const demoVideoUrl = "https://www.youtube.com/embed/aQQs4ZY-ZVs?si=FpL4B1bnut15xkgf";

  const checkScroll = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const [isHovered, setIsHovered] = useState(false);
  const [isLogeddIn,setLogeddIn]=useState(false);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const getProfile=async()=>{
      try{
        setLoading(true);
        const data=await api.getFarmerProfile();
        if (data.success) {
            setLogeddIn(true);
          return;
        }else setLogeddIn(false)
      }catch(err){
        console.error(err);
      }finally{
        setLoading(false);
      }
      
    }
    getProfile();
  },[])

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", checkScroll);
      checkScroll();
      window.addEventListener("load", checkScroll);
  
      const cardWidth = 320;
      const gap = 32;
      let timer;
  
      if (!isHovered) {
        timer = setInterval(() => {
          if (sliderRef.current) {
            const cards = sliderRef.current.children[0].children;
            const currentScroll = sliderRef.current.scrollLeft;
            const targetScroll =
              Math.ceil(currentScroll / (cardWidth + gap)) * (cardWidth + gap);
  
            // Infinite scroll logic
            if (currentScroll >= (cards.length - 1) * (cardWidth + gap)) {
              // If at the end, instantly scroll to the start (without animation)
              sliderRef.current.scrollTo({
                left: 0,
                behavior: "auto",
              });
            } else {
              // Otherwise, scroll to the next card
              sliderRef.current.scrollTo({
                left: targetScroll + (cardWidth + gap),
                behavior: "smooth",
              });
            }
  
            // Update the current slide indicator
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
          }
        }, 3000);
      }
  
      return () => {
        slider.removeEventListener("scroll", checkScroll);
        window.removeEventListener("load", checkScroll);
        clearInterval(timer);
      };
    }
  }, [checkScroll, isHovered]);
  
  const scroll = (direction) => {
    if (sliderRef.current) {
      const cardWidth = 320;
      const gap = 32;
      const currentScroll = sliderRef.current.scrollLeft;
      const cards = sliderRef.current.children[0].children;
  
      let targetScroll;
      if (direction === "left") {
        targetScroll = currentScroll - (cardWidth + gap);
        if (targetScroll < 0) {
          // If scrolling left from the first slide, jump to the end
          targetScroll = (cards.length - 1) * (cardWidth + gap);
        }
      } else {
        targetScroll = currentScroll + (cardWidth + gap);
        if (targetScroll >= (cards.length - 1) * (cardWidth + gap)) {
          // If scrolling right from the last slide, jump to the start
          targetScroll = 0;
        }
      }
  
      sliderRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
  
      // Update the current slide indicator
      setCurrentSlide((prev) => {
        if (direction === "left") {
          return prev === 0 ? totalSlides - 1 : prev - 1;
        } else {
          return (prev + 1) % totalSlides;
        }
      });
    }
  };
  
  
  const validateForm = () => {
    const errors = {};
    if (!contactForm.name.trim()) errors.name = "Name is required";
    if (!contactForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = "Valid email is required";
    }
    if (!contactForm.message.trim()) errors.message = "Message is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        // Use the API service instead of direct import
        const result = await api.submitContactForm(contactForm);
        
        console.log(result.message);
        if (result.success|| result.message) {
          setSubmitSuccess(true);
          setContactForm({ name: "", email: "", message: "" });
          setTimeout(() => setSubmitSuccess(false), 3000);
        } else {
          throw new Error("Failed to submit form");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to send message. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterSuccess(true);
    setNewsletterEmail("");
    setTimeout(() => setNewsletterSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a8b3f] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your Homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <div className="relative h-[700px] flex items-center justify-center bg-gradient-to-r from-[#2c5530] to-[#1a331d]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3"
            alt="Advanced Agricultural Technology"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2c5530]/50"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white font-roboto mb-6 leading-tight">
            AgriHelp
          </h1>
          <p className="text-xl md:text-3xl text-white mb-12 font-light">
            Revolutionizing Agriculture with Advanced AI Solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={(isLogeddIn)?`/dashboard`:`/get-started`}
              className="bg-[#4a8b3f] hover:bg-[#3a6d31] text-white font-bold py-4 px-10 rounded-lg transition duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
             {(isLogeddIn)?`Go to Dashboard`:`Get Started`}
            </Link>
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-10 rounded-lg transition duration-300 text-lg border-2 border-white/30 backdrop-blur-sm"
            >
              Watch Demo
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white py-12 px-4 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white rounded-2xl shadow-xl p-8">
            {[
              { number: "95%", label: "Accuracy Rate" },
              { number: "2.5x", label: "Yield Increase" },
              { number: "10k+", label: "Farmers Helped" },
              { number: "24/7", label: "AI Support" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#2c5530] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative py-16 px-4">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3"
            alt="Agricultural field background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#f8f9fa]/70"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#2c5530] mb-12">
            Our Services
          </h2>
          <div className="relative">
            {canScrollLeft && (
              <button
              onClick={() => scroll("left")}
              className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-r-lg shadow-lg p-2 hover:bg-white transition-colors duration-300"
              aria-label="Scroll left"
            >
              <svg
                className="w-6 h-6 text-[#2c5530]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            )}

            {canScrollRight && (
              <button
              onClick={() => scroll("right")}
              className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-l-lg shadow-lg p-2 hover:bg-white transition-colors duration-300"
              aria-label="Scroll right"
            >
              <svg
                className="w-6 h-6 text-[#2c5530]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            )}

            <div
              ref={sliderRef}
              className="overflow-x-hidden pb-4 hide-scrollbar services-slider px-8 md:px-4 snap-x snap-mandatory"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="flex gap-8">
                {[...Array.from({ length: 8 })]
                  .map(() => [
                    {
                      title: "Plant Disease Identification",
                      description:
                        "Upload photos of your plants to instantly identify diseases affecting them. Our AI-powered system analyzes leaf patterns, discoloration, and symptoms to provide accurate disease detection and treatment recommendations.",
                      link: "https://en.wikipedia.org/wiki/Plant_pathology",
                      icon: (
                        <svg
                          className="w-12 h-12 text-[#4a8b3f]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
                          />
                        </svg>
                      ),
                    },
                    {
                      title: "Pest Identification",
                      description:
                        "Detect and identify harmful pests affecting your crops through image analysis. Get immediate insights about the pest species and receive targeted control measures to protect your harvest.",
                      link: "https://en.wikipedia.org/wiki/Pest_control",
                      icon: (
                        <svg
                          className="w-12 h-12 text-[#4a8b3f]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      ),
                    },
                    {
                      title: "Smart Fertilizer Advisory",
                      description:
                        "Get personalized fertilizer recommendations based on your crop type and soil composition. Our system analyzes your soil parameters to suggest the optimal fertilizer mix for maximum yield.",
                      link: "https://en.wikipedia.org/wiki/Fertilizer",
                      icon: (
                        <svg
                          className="w-12 h-12 text-[#4a8b3f]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                          />
                        </svg>
                      ),
                    },
                    {
                      title: "Smart Crop Selection",
                      description:
                        "Receive data-driven crop recommendations based on your soil conditions, climate, and local weather patterns. Our system helps you choose the most suitable crops for optimal yield and profitability.",
                      link: "https://en.wikipedia.org/wiki/Crop_rotation",
                      icon: (
                        <svg
                          className="w-12 h-12 text-[#4a8b3f]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ),
                    },
                  ])
                  .flat()
                  .map((service, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 w-80 flex-shrink-0 snap-center"
                    >
                      <div className="mb-4">{service.icon}</div>
                      <h3 className="text-xl font-bold text-[#2c5530] mb-3">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        {service.description}
                      </p>
                      <a
                        href={service.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4a8b3f] hover:text-[#3a6d31] font-semibold inline-flex items-center"
                      >
                        Learn More
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    </div>
                  ))}
              </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 pb-2">
              {[...Array.from({ length: 4 })].map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentSlide ? "bg-[#2c5530]" : "bg-[#2c5530]/50"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-auto bg-gradient-to-r from-[#2c5530] to-[#1a331d] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-6 md:space-y-8">
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
                  Connect With Us
                </h3>
                <div className="flex flex-wrap gap-4 mb-6">
                  {[
                    { icon: "fa-facebook-f", link: "#" },
                    { icon: "fa-twitter", link: "#" },
                    { icon: "fa-linkedin-in", link: "#" },
                    { icon: "fa-instagram", link: "#" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
                    >
                      <i
                        className={`fab ${social.icon} text-lg md:text-xl`}
                      ></i>
                    </a>
                  ))}
                </div>
                <p className="text-sm md:text-base text-white/80 mb-6 md:mb-8">
                  Stay updated with our latest agricultural insights and tips
                </p>
              </div>

              <div>
                <h4 className="text-base md:text-lg font-semibold mb-4">
                  Subscribe to Our Newsletter
                </h4>
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                    <input
                      type="email"
                      name="newsletter-email"
                      placeholder="Enter your email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg sm:rounded-l-lg sm:rounded-r-none bg-white/10 border border-white/20 placeholder-white/60 focus:outline-none focus:border-white/40"
                    />
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-[#4a8b3f] hover:bg-[#3a6d31] text-white font-bold px-6 py-2 rounded-lg sm:rounded-l-none sm:rounded-r-lg transition duration-300"
                    >
                      Subscribe
                    </button>
                  </div>
                  {newsletterSuccess && (
                    <p className="text-green-300 text-sm">
                      Thanks for subscribing!
                    </p>
                  )}
                </form>
              </div>
            </div>

            <div className="mt-8 md:mt-0">
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
                Contact Us
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-white/60 focus:outline-none focus:border-white/40"
                  />
                  {formErrors.name && (
                    <p className="text-red-300 text-sm mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-white/60 focus:outline-none focus:border-white/40"
                  />
                  {formErrors.email && (
                    <p className="text-red-300 text-sm mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-white/60 focus:outline-none focus:border-white/40"
                  ></textarea>
                  {formErrors.message && (
                    <p className="text-red-300 text-sm mt-1">
                      {formErrors.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#4a8b3f] hover:bg-[#3a6d31] text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
                {submitSuccess && (
                  <p className="text-green-300 text-sm text-center">
                    Message sent successfully!
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <p className="text-center text-white/60 text-sm">
              © 2025 AgriHelp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={demoVideoUrl}
      />
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default Home;