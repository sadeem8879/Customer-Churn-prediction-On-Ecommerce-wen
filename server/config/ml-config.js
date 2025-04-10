const ML_API = {
  BASE_URL: process.env.ML_API_URL || "http://127.0.0.1:5000",
  ENDPOINTS: {
    // Customer Analysis Endpoints
    CHURN_TRENDS: "/churn-trends",
    HIGH_RISK: "/high-risk-customers",
    CUSTOMER_SEGMENTS: "/customer-segments",
    RETENTION_RATE: "/retention-rate",
    EXPORT_DATA: "/export",
    CUSTOMER_DETAILS: "/customer",
    CHURNED_CUSTOMERS: "/churned-customers",
    
    // Demographic Analysis Endpoints
    CHURN_STATE: "/churn-state",
    CHURN_AGE: "/churn-age", 
    CHURN_GENDER: "/churn-gender",
    
    // Statistical Endpoints
    TOTAL_CUSTOMERS: "/total-customers",
    CHURN_STATS: "/churn-stats",
    
    // Predictive Endpoint
    PREDICT_CHURN: "/predict-churn",
    
    // Engagement Endpoints
    ENGAGEMENT_ANALYSIS: "/engagement-analysis",
    
    // System Endpoints
    HEALTH_CHECK: "/health",
    REFRESH_DATA: "/refresh-data"
  },
  TIMEOUT: 5000, // 5 seconds
  RETRIES: 2, // Number of retry attempts
  RETRY_DELAY: 1000 // 1 second between retries
};

export default ML_API;