import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { text: 'Client Gallery', href: '/gallery' },
        { text: 'Website', href: '/website' },
        { text: 'Store', href: '/store' },
        { text: 'Mobile App', href: '/mobile' },
        { text: 'Studio Manager', href: '/studio' }
      ]
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '/about' },
        { text: 'Careers', href: '/careers' },
        { text: 'Contact Us', href: '/contact' },
        { text: 'Terms of Service', href: '/terms' },
        { text: 'Privacy Policy', href: '/privacy' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { text: 'Help Center', href: '/help' },
        { text: 'Blog', href: '/blog' },
        { text: 'Feature Updates', href: '/updates' },
        { text: 'Status', href: '/status' },
        { text: 'Compare', href: '/compare' }
      ]
    },
    {
      title: 'Connect',
      links: [
        { text: 'Twitter', href: 'https://twitter.com' },
        { text: 'Facebook', href: 'https://facebook.com' },
        { text: 'Instagram', href: 'https://instagram.com' },
        { text: 'LinkedIn', href: 'https://linkedin.com' }
      ]
    }
  ];

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'grey.200',
        pt: 8,
        pb: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {footerSections.map((section) => (
            <Grid item xs={12} sm={6} md={3} key={section.title}>
              <Typography 
                variant="h6" 
                color="primary" 
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                {section.title}
              </Typography>
              {section.links.map((link) => (
                <Box key={link.text} sx={{ mb: 1 }}>
                  <Link
                    href={link.href}
                    color="text.secondary"
                    sx={{
                      textDecoration: 'none',
                      '&:hover': { 
                        color: 'primary.main',
                        textDecoration: 'none'
                      }
                    }}
                  >
                    {link.text}
                  </Link>
                </Box>
              ))}
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="body2" color="text.secondary">
            {new Date().getFullYear()} Pixieset Clone. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              color="primary"
              size="small"
              sx={{ 
                '&:hover': { 
                  bgcolor: 'primary.light',
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              color="primary"
              size="small"
              sx={{ 
                '&:hover': { 
                  bgcolor: 'primary.light',
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              color="primary"
              size="small"
              sx={{ 
                '&:hover': { 
                  bgcolor: 'primary.light',
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              color="primary"
              size="small"
              sx={{ 
                '&:hover': { 
                  bgcolor: 'primary.light',
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              <LinkedInIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
