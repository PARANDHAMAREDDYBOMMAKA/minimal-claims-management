import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

function Footer() {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");

  // Function to open dialog with dynamic content
  const handleOpenDialog = (title, content) => {
    setDialogTitle(title);
    setDialogContent(content);
    setOpenDialog(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Function for smooth scrolling to FAQ
  const handleScrollToFAQ = (e) => {
    e.preventDefault();
    const faqSection = document.getElementById("faq-section");
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      sx={{
        mt: 8,
        background: "linear-gradient(135deg, #0F2027, #203A43, #2C5364)",
        color: "#fff",
        py: 6,
        borderTopLeftRadius: "50px",
        borderTopRightRadius: "50px",
        boxShadow: "0 -5px 15px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
              We simplify healthcare claims for both patients and insurers with
              a seamless, AI-driven platform ensuring security and efficiency.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                { text: "Home", link: "#" },
                {
                  text: "FAQ",
                  link: "#faq-section",
                  onClick: handleScrollToFAQ,
                },
                { text: "Submit a Claim", link: "#" },
                { text: "Track Claim", link: "#" },
                {
                  text: "Contact Us",
                  link: "#",
                  onClick: () =>
                    handleOpenDialog(
                      "Contact Us",
                      "📞 Phone: +1 (123) 456-7890\n📧 Email: support@claimsmgmt.com\n📍 Address: 123 Claims St, Suite 456, City, Country"
                    ),
                },
                {
                  text: "Privacy Policy",
                  link: "#",
                  onClick: () =>
                    handleOpenDialog(
                      "Privacy Policy",
                      "We respect your privacy. Our system securely stores your data and never shares it without consent. Read more on our website."
                    ),
                },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  underline="none"
                  sx={{
                    color: "#81C784",
                    fontWeight: "500",
                    transition: "color 0.3s, transform 0.3s",
                    cursor: "pointer",
                    "&:hover": {
                      color: "#4CAF50",
                      transform: "translateX(5px)",
                    },
                  }}
                  onClick={item.onClick}
                >
                  {item.text}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Social Media & Contact */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Follow Us
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { icon: <FacebookIcon />, link: "#" },
                { icon: <TwitterIcon />, link: "#" },
                { icon: <LinkedInIcon />, link: "#" },
              ].map((social, index) => (
                <IconButton
                  key={index}
                  sx={{
                    color: "#fff",
                    background: "rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                      background: "#4CAF50",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.3s ease-in-out",
                  }}
                  href={social.link}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 4, backgroundColor: "rgba(255, 255, 255, 0.3)" }} />

        {/* Bottom Section */}
        <Box sx={{ textAlign: "center", opacity: 0.7 }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Claims Management. All rights reserved.
          </Typography>
        </Box>
      </Container>

      {/* Dialog (Popup) for Contact Us & Privacy Policy */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {dialogContent}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Footer;
