// Footer Component
// Site footer with links and branding
// QuizCraft themed

import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Instagram as InstagramIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/RouteConstants";

// Logo image - will be loaded from public folder
const logoImage = "/logo.png";

/**
 * Footer Component
 * Site-wide footer with navigation links
 */
function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", path: "/#features" },
        { label: "How It Works", path: "/#how-it-works" },
        { label: "Pricing", path: "/pricing" },
        { label: "Browse Quizzes", path: ROUTES.DISCOVER },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", path: "/blog" },
        { label: "Help Center", path: "/help" },
        { label: "FAQs", path: "/faq" },
        { label: "API Documentation", path: "/api-docs" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", path: "/about" },
        { label: "Contact", path: "/contact" },
        { label: "Careers", path: "/careers" },
        { label: "Press Kit", path: "/press" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", path: "/privacy" },
        { label: "Terms of Service", path: "/terms" },
        { label: "Cookie Policy", path: "/cookies" },
        { label: "GDPR", path: "/gdpr" },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: <FacebookIcon />,
      url: "https://facebook.com",
      label: "Facebook",
    },
    {
      icon: <TwitterIcon />,
      url: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <LinkedInIcon />,
      url: "https://linkedin.com",
      label: "LinkedIn",
    },
    { icon: <GitHubIcon />, url: "https://github.com", label: "GitHub" },
    {
      icon: <InstagramIcon />,
      url: "https://instagram.com",
      label: "Instagram",
    },
  ];

  const handleLinkClick = (path) => {
    if (path.startsWith("http")) {
      window.open(path, "_blank", "noopener,noreferrer");
    } else if (path.startsWith("/#")) {
      // Handle anchor links
      const hash = path.replace("/#", "");
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#F8F9FA",
        borderTop: "1px solid #E0E0E0",
        pt: 6,
        pb: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="xl">
        {/* Main Footer Content */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box
                component="img"
                src={logoImage}
                alt="QuizCraft Logo"
                sx={{
                  height: 48,
                  width: "auto",
                  mb: 2,
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
              <Box
                sx={{
                  display: "none",
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  mb: 2,
                }}
              >
                QuizCraft
              </Box>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 300 }}
            >
              Create engaging quizzes, learn, and grow. QuizCraft is your
              ultimate platform for interactive learning and knowledge sharing.
            </Typography>

            {/* Social Links */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  onClick={() => handleLinkClick(social.url)}
                  aria-label={social.label}
                  size="small"
                  sx={{
                    color: "#636E72",
                    "&:hover": {
                      color: "#0D5C3F",
                      backgroundColor: "rgba(13, 92, 63, 0.1)",
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <Grid item xs={6} sm={6} md={2} key={section.title}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: "#2D3436",
                  fontSize: "0.875rem",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {section.title}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    onClick={() => handleLinkClick(link.path)}
                    sx={{
                      color: "#636E72",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      transition: "color 0.2s",
                      "&:hover": {
                        color: "#0D5C3F",
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} QuizCraft. All rights reserved.
          </Typography>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Link
              onClick={() => handleLinkClick("/privacy")}
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                fontSize: "0.875rem",
                cursor: "pointer",
                "&:hover": {
                  color: "#0D5C3F",
                },
              }}
            >
              Privacy
            </Link>
            <Link
              onClick={() => handleLinkClick("/terms")}
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                fontSize: "0.875rem",
                cursor: "pointer",
                "&:hover": {
                  color: "#0D5C3F",
                },
              }}
            >
              Terms
            </Link>
            <Link
              onClick={() => handleLinkClick("/cookies")}
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                fontSize: "0.875rem",
                cursor: "pointer",
                "&:hover": {
                  color: "#0D5C3F",
                },
              }}
            >
              Cookies
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
