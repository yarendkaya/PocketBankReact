export const mainPageStyles = {
  // Root container
  root: {
    minHeight: '100vh',
    bgcolor: 'background.default'
  },

  // Header styles
  header: {
    bgcolor: 'white',
    borderBottom: '1px solid #e0e0e0',
    py: 1
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1
  },
  headerIcon: {
    color: 'primary.main',
    fontSize: 36,
    mr: 2
  },
  headerTitle: {
    color: 'primary.main',
    fontWeight: 700,
    letterSpacing: -0.5
  },
  headerRight: {
    display: 'flex',
    gap: 3,
    alignItems: 'center'
  },
  headerButton: {
    color: 'text.secondary',
    fontWeight: 500,
    '&:hover': { color: 'primary.main' }
  },

  // Hero section styles
  hero: {
    background: 'linear-gradient(135deg, #e3068b 0%, #c70577 100%)',
    color: 'white',
    py: 6,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="rgba(255,255,255,0.05)" fill-rule="evenodd"%3E%3Cpath d="m0 40l40-40h-40z"/%3E%3C/g%3E%3C/svg%3E")',
      opacity: 0.1
    }
  },
  heroContent: {
    position: 'relative',
    zIndex: 1
  },
  heroTitle: {
    fontWeight: 700,
    mb: 2,
    color: 'white'
  },
  heroDescription: {
    fontSize: '1.1rem',
    opacity: 0.9,
    maxWidth: 600
  },

  // Breadcrumb styles
  breadcrumbLink: {
    '&:hover': { color: 'primary.main' }
  },

  // Main content styles
  sectionTitle: {
    mb: 4,
    fontWeight: 600
  },
  sectionDescription: {
    color: 'text.secondary',
    mb: 4,
    fontSize: '1rem',
    lineHeight: 1.7
  },

  // Security card styles
  securityCard: {
    mb: 4,
    p: 3,
    border: '1px solid #e8e8e8',
    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
  },
  securityHeader: {
    display: 'flex',
    alignItems: 'center',
    mb: 3
  },
  securityIcon: {
    color: 'primary.main',
    mr: 2,
    fontSize: 28
  },
  securityTitle: {
    color: 'primary.main',
    fontWeight: 600
  },
  securityDescription: {
    color: 'text.secondary',
    mb: 3
  },
  securityFeature: {
    display: 'flex',
    alignItems: 'center',
    mb: 1
  },
  securityFeatureIcon: {
    fontSize: 16,
    color: '#4caf50',
    mr: 1
  },
  securityFeatureText: {
    fontWeight: 500
  },

  // Services styles
  servicesTitle: {
    mb: 3,
    fontWeight: 600
  },
  serviceCard: {
    p: 1.5,
    height: '80px',
    border: '1px solid #f0f0f0',
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: 'primary.main',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(227, 6, 139, 0.15)'
    }
  },
  serviceTitle: {
    fontWeight: 600,
    mb: 0.5,
    fontSize: '0.8rem',
    lineHeight: 1.2
  },
  serviceDescription: {
    color: 'text.secondary',
    fontSize: '0.7rem',
    lineHeight: 1.2
  },

  // Form selector styles
  formSelector: {
    p: 2,
    borderRadius: 2,
    background: 'white',
    height: '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    '&:hover': {
      opacity: 1,
      transform: 'scale(1.01)'
    }
  },
  formSelectorActive: {
    border: '2px solid',
    borderColor: 'primary.main',
    opacity: 1,
    transform: 'scale(1.02)'
  },
  formSelectorInactive: {
    border: '1px solid #e8e8e8',
    opacity: 0.7,
    transform: 'scale(1)'
  },
  formSelectorTitle: {
    fontWeight: 600,
    fontSize: '1rem',
    mb: 1
  },
  formSelectorDescription: {
    color: 'text.secondary',
    textAlign: 'center',
    fontSize: '0.75rem'
  },
  activeIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: '50%',
    bgcolor: 'primary.main'
  },

  // Form container styles
  formContainer: {
    p: 3,
    border: '2px solid',
    borderColor: 'primary.main',
    borderRadius: 3,
    background: 'white'
  },
  formTitle: {
    mb: 1,
    color: 'primary.main',
    fontWeight: 600,
    textAlign: 'center'
  },
  formSubtitle: {
    mb: 3,
    color: 'text.secondary',
    textAlign: 'center'
  },
  forgotPassword: {
    color: 'primary.main',
    fontWeight: 500,
    textDecoration: 'none',
    fontSize: '0.875rem',
    '&:hover': { textDecoration: 'underline' }
  }
}