
export const contactForm = async (req,res) => {
  const { name, email, message } = req.body;

  try {
    // Simulate saving to a database or sending an email
    console.log('Contact Form Submitted:', { name, email, message });
    
    // Send success response
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }  
};