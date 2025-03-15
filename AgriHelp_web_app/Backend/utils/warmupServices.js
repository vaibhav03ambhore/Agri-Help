import axios from 'axios';

// Helper function to make warmup requests
export const warmupServices = async () => {
    const services = [
      "https://agri-help-crop.onrender.com/warmup",
      "https://agri-help-fertilizer.onrender.com/warmup",
      "https://agri-help-pest.onrender.com/warmup",
      "https://agri-help-wl8j.onrender.com/warmup"
    ];
    
    try {
      const results = await Promise.allSettled(services.map(url => axios.get(url)));
      
      // Log the results of each service
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(`Warmup successful for ${services[index]}:`, result.value.status);
        } else {
          console.log(`Warmup failed for ${services[index]}:`, result.reason);
        }
      });
    } catch (error) {
      console.log("Warmup requests error:", error);
      // Continue execution even if warmup requests fail
    }
  };