import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqs = [
  {
    question: "How do I submit a claim?",
    answer:
      "To submit a claim, log into your account and navigate to the 'Submit Claim' section. Fill out the required details, attach any necessary documents, and review your information before submitting. Once submitted, you will receive a confirmation, and you can track the progress in your dashboard.",
  },
  {
    question: "How long does claim processing take?",
    answer:
      "The processing time typically takes between 5 to 7 business days, depending on the complexity of the claim and the verification process. In some cases, additional documentation may be required, which can extend the timeline. You will receive notifications at every step to keep you updated on the progress.",
  },
  {
    question: "Can I track my claim status?",
    answer:
      "Yes, you can track your claim status in real-time by visiting the 'Dashboard' section of your account. Here, you’ll find detailed updates, including submission status, processing stages, and estimated completion time. If there are any issues, you will be notified with the necessary steps to resolve them.",
  },
  {
    question: "What documents are required for a claim?",
    answer:
      "The required documents depend on the type of claim being submitted. Typically, you will need your insurance policy details, medical bills, prescriptions, and any relevant receipts. If additional documents are needed, our system will notify you and guide you through the process.",
  },
  {
    question: "Is my personal data secure?",
    answer:
      "Yes, we take data security very seriously. All user data is encrypted and stored securely using industry-standard security measures. Our platform follows strict compliance protocols to ensure your sensitive information remains protected at all times.",
  },
  {
    question: "Can I edit or cancel a claim after submission?",
    answer:
      "Once a claim has been submitted, you may not be able to edit certain details. However, if you need to make changes or cancel the claim, you can contact our support team. They will assist you in making necessary updates or withdrawing the claim if required.",
  },
];

function FAQ() {
  const [expanded, setExpanded] = useState(null);

  const handleChange = (index) => (event, isExpanded) => {
    setExpanded(isExpanded ? index : null);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Frequently Asked Questions
      </Typography>
      <Box sx={{ mt: 3 }}>
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expanded === index}
            onChange={handleChange(index)}
            sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "white" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            >
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
}

export default FAQ;
