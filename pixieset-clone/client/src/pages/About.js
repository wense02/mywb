import React from 'react';
import { Box, Container, Typography, Grid, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

const About = () => {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://source.unsplash.com/200x200/?portrait,woman',
      bio: 'Photography enthusiast turned tech entrepreneur, Sarah founded Pixieset with a vision to simplify client photo delivery.'
    },
    {
      name: 'Michael Chen',
      role: 'Chief Technology Officer',
      image: 'https://source.unsplash.com/200x200/?portrait,man',
      bio: 'With over 15 years in software development, Michael leads our technical innovation and platform development.'
    },
    {
      name: 'Emma Williams',
      role: 'Head of Design',
      image: 'https://source.unsplash.com/200x200/?portrait,woman',
      bio: 'Emma brings her background in UX design and photography to create beautiful, functional interfaces.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 12 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              component="h1"
              align="center"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Our Story
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              sx={{ maxWidth: 800, mx: 'auto', mb: 8 }}
            >
              We're building the future of photography business management,
              helping photographers focus on what they do best - creating beautiful memories.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h3" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                We believe that every photographer deserves powerful tools to showcase
                their work and grow their business. Our platform is built with the
                specific needs of photographers in mind.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                From seamless client galleries to integrated e-commerce solutions,
                we're here to help photographers succeed in the digital age.
              </Typography>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://source.unsplash.com/800x600/?photography,studio"
              alt="Our Mission"
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: 3
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Team Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            Meet Our Team
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 8 }}
          >
            The passionate people behind Pixieset
          </Typography>

          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid item xs={12} md={4} key={member.name}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 3
                    }}
                  >
                    <Avatar
                      src={member.image}
                      alt={member.name}
                      sx={{
                        width: 200,
                        height: 200,
                        mx: 'auto',
                        mb: 2,
                        boxShadow: 2
                      }}
                    />
                    <Typography variant="h5" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      {member.role}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {member.bio}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
