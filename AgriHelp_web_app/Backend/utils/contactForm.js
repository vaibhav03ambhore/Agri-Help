import nodemailer from 'nodemailer';
import ContactForm from '../db_models/ContactForm.js';

export const contactForm = async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message ) {
    return res.status(400).json({ error: 'Please provide name, email, and message' });
  }

  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD, 
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'vaibhavambhore803@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      replyTo: email,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    const newContactForm = new ContactForm({
      name,
      email,
      message
    });
    await newContactForm.save();

    // Log the submission
    console.log('Contact Form Submitted:', { name, email, message });
    
    res.status(200).json({ 
      message: 'Form submitted and saved successfully',
      formId: newContactForm._id 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }  
};


