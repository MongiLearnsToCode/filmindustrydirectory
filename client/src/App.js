import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Grid, 
  Card, 
  CardContent,
  AppBar,
  Toolbar,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';

function App() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real application, this would fetch from your API
    const industryContacts = [
      { name: 'Vishal Kanungo', email: 'vishal@aeroplaymedia.com', company: 'AEROPLAY ENTERTAINMENT' },
      { name: 'Gaouad Moktar', email: 'moktar.gaouad@gmail.com', company: 'AFRICA PRIME / AFRICA TODAY TV' },
      // ... add all other contacts here
    ];
    setContacts(industryContacts);
  }, []);

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: '#2c3e50' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Media Industry Directory
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name, company, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={3}>
          {filteredContacts.map((contact, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 3,
                }
              }}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {contact.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mb: 1 
                    }}
                  >
                    <BusinessIcon sx={{ mr: 1, fontSize: 'small' }} />
                    {contact.company}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center' 
                    }}
                  >
                    <EmailIcon sx={{ mr: 1, fontSize: 'small' }} />
                    <a 
                      href={`mailto:${contact.email}`}
                      style={{ 
                        color: 'inherit', 
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {contact.email}
                    </a>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
