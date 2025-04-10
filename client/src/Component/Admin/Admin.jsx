// import { FiActivity } from "react-icons/fi";
// import axios from "axios";
// import { useState, useEffect } from "react";
// import { 
//     Table, Button, Container, Spinner, Alert, Card, 
//     Row, Col, Badge, ProgressBar 
// } from "react-bootstrap";
// import { 
//     PieChart, Pie, Cell, Tooltip, BarChart, Bar, 
//     XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, 
//     LabelList, LineChart, Line 
// } from "recharts";
// import { useNavigate } from "react-router-dom";

// const COLORS = {
//     churned: "#FF6384",
//     active: "#4CAF50",
//     state: "#FFCE56",
//     gender: ["#4BC0C8", "#FF9F40", "#9966CC", "#36A2EB"],
//     age: ["#E0F2F7", "#B3E5FC", "#4FC3F7", "#03A9F4", "#0288D1"],
//     highRisk: "#FF0000",
//     mediumRisk: "#FF8000",
//     lowRisk: "#00FF00",
//     notAssessed: "#CCCCCC"
// };

// const AdminDashboard = () => {
//     // State declarations
//     const [customers, setCustomers] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [churnByState, setChurnByState] = useState([]);
//     const [churnByGender, setChurnByGender] = useState([]);
//     const [churnByAge, setChurnByAge] = useState([]);
//     const [riskStats, setRiskStats] = useState({
//         high_risk: 0,
//         medium_risk: 0,
//         low_risk: 0,
//         not_assessed: 0,
//         total_customers: 0
//     });
//     const [totalCustomers, setTotalCustomers] = useState(0);
//     const [activeCount, setActiveCount] = useState(0);
//     const [churnTrends, setChurnTrends] = useState([]);
//     const [highRiskCustomers, setHighRiskCustomers] = useState([]);
//     const [customerSegments, setCustomerSegments] = useState([]);
//     const [retentionRate, setRetentionRate] = useState(0);

//     const navigate = useNavigate();

//     useEffect(() => {
//         if (!localStorage.getItem("isAdminAuthenticated")) {
//             navigate("/admin-login");
//         }

//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 await Promise.all([
//                     fetchCustomerData(),
//                     fetchTotalCustomers(),
//                     fetchChurnByState(),
//                     fetchChurnByGender(),
//                     fetchChurnByAge(),
//                     fetchRiskStats(),
//                     fetchChurnTrends(),
//                     fetchHighRiskCustomers(),
//                     fetchCustomerSegments(),
//                     fetchRetentionRate(),
//                 ]);
//             } catch (error) {
//                 setError("Error fetching dashboard data.");
//                 console.error("Error fetching dashboard data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [navigate]);

//     const fetchTotalCustomers = async () => {
//         try {
//             const { data } = await axios.get("http://localhost:8080/total-customers", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//             });
//             setTotalCustomers(data.totalCustomers || 0);
//             setActiveCount(data.activeCustomers || 0);
//         } catch (error) {
//             console.error("Error fetching total customers:", error);
//             setTotalCustomers(0);
//             setActiveCount(0);
//         }
//     };

//     const fetchCustomerData = async () => {
//         try {
//             const { data } = await axios.get("http://localhost:8080/churned-customers", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//             });
//             setCustomers(Array.isArray(data) ? data : []);
//         } catch (error) {
//             setError("Error fetching customer data.");
//         }
//     };

//     const fetchChurnByState = async () => {
//         try {
//             const { data } = await axios.get("http://localhost:8080/churn-state", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//             });
            
//             const formattedData = Array.isArray(data) 
//                 ? data.map(item => ({
//                     state: item.state || 'Unknown',
//                     customer_count: Number(item.customer_count) || 0,
//                     churn_probability: Number(item.churn_probability) || 0
//                 }))
//                 : [];
                
//             setChurnByState(formattedData);
//         } catch (error) {
//             console.error("Error fetching churn by state:", error);
//             setChurnByState([]);
//         }
//     };

//     const fetchChurnByGender = async () => {
//         try {
//             const { data } = await axios.get("http://localhost:8080/churn-gender", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//             });
            
//             const formattedData = Array.isArray(data)
//                 ? data.map(g => ({
//                     gender: g.gender || 'Unknown',
//                     customer_count: parseInt(g.customer_count, 10) || 0,
//                     churn_probability: parseFloat(g.churn_probability) || 0
//                 }))
//                 : [];
                
//             setChurnByGender(formattedData);
//         } catch (error) {
//             console.error("Error fetching churn by gender data:", error);
//             setChurnByGender([]);
//         }
//     };

//     const fetchChurnByAge = async () => {
//         try {
//             const { data } = await axios.get("http://localhost:8080/churn-age", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//             });

//             const formattedData = Array.isArray(data)
//                 ? data.map((entry, index) => ({
//                     ageRange: entry.ageRange || entry.age_group || "Unknown",
//                     churnPercentage: parseFloat(entry.churn_probability || entry.churnPercentage) * 100 || 0,
//                     color: COLORS.age[index % COLORS.age.length],
//                 }))
//                 : [];
                
//             setChurnByAge(formattedData);
//         } catch (error) {
//             console.error("Error fetching churn by age data:", error);
//             setChurnByAge([]);
//         }
//     };

//     const fetchRiskStats = async () => {
//         try {
//             const { data } = await axios.get("http://localhost:8080/churn-stats", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//             });

//             const stats = {
//                 high_risk: Number(data?.high_risk) || 0,
//                 medium_risk: Number(data?.medium_risk) || 0,
//                 low_risk: Number(data?.low_risk) || 0,
//                 not_assessed: Number(data?.not_assessed) || 0,
//                 total_customers: totalCustomers
//             };
            
//             setRiskStats(stats);
//         } catch (err) {
//             console.error("Error fetching risk stats:", err);
//             setRiskStats({
//                 high_risk: 0,
//                 medium_risk: 0,
//                 low_risk: 0,
//                 not_assessed: totalCustomers,
//                 total_customers: totalCustomers
//             });
//         }
//     };

//     const fetchChurnTrends = async () => {
//         try {
//             const { data } = await axios.get("http://localhost:8080/churn-trends", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//             });

//             // Handle different response formats
//             let formattedData = [];
            
//             if (Array.isArray(data)) {
//                 // If data is already an array of {month, churn_probability} objects
//                 formattedData = data.map(item => ({
//                     month: item.month,
//                     churned_customers: Number(item.churn_probability) * 100 || 0
//                 }));
//             } else if (typeof data === 'object' && data !== null) {
//                 // If data is an object with month keys
//                 formattedData = Object.entries(data).map(([month, value]) => ({
//                     month,
//                     churned_customers: Number(value) * 100 || 0
//                 }));
//             }

//             // Sort by month chronologically
//             formattedData.sort((a, b) => new Date(a.month) - new Date(b.month));
            
//             setChurnTrends(formattedData);
//         } catch (error) {
//             console.error("Error fetching churn trends:", error);
//             setChurnTrends([]);
//         }
//     };

//     const fetchHighRiskCustomers = async () => {
//         try {
//             const { data } = await axios.get("http://localhost:8080/high-risk-customers", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//             });
//             setHighRiskCustomers(Array.isArray(data) ? data : []);
//         } catch (error) {
//             console.error("Error fetching high-risk customers:", error);
//             setHighRiskCustomers([]);
//         }
//     };

//     const fetchCustomerSegments = async () => {
//         try {
//             const { data } = await axios.get("http://localhost:8080/customer-segments", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//             });

//             const formattedData = Array.isArray(data)
//                 ? data
//                 : Object.entries(data || {}).map(([segment, count]) => ({
//                     segment,
//                     count: Number(count) || 0
//                 }));
                
//             setCustomerSegments(formattedData);
//         } catch (error) {
//             console.error("Error fetching customer segments:", error);
//             setCustomerSegments([]);
//         }
//     };

//     const fetchRetentionRate = async () => {
//         try {
//             const { data } = await axios.get("http://localhost:8080/retention-rate", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//             });
            
//             const rate = typeof data === 'object'
//                 ? parseFloat(data?.retentionRate || 0)
//                 : parseFloat(data || 0);
                
//             setRetentionRate(rate);
//         } catch (error) {
//             console.error("Error fetching retention rate:", error);
//             setRetentionRate(0);
//         }
//     };

//     const exportData = async (format) => {
//         try {
//             if (!["csv", "json"].includes(format)) {
//                 throw new Error("Unsupported export format");
//             }

//             const response = await axios.get("http://localhost:8080/export-data", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//                 params: { format },
//                 responseType: format === "csv" ? "blob" : "json",
//             });

//             if (format === "csv") {
//                 const blob = new Blob([response.data], { type: "text/csv" });
//                 const url = window.URL.createObjectURL(blob);
//                 const a = document.createElement("a");
//                 a.href = url;
//                 a.download = "customers.csv";
//                 a.click();
//             } else if (format === "json") {
//                 const blob = new Blob([JSON.stringify(response.data)], { type: "application/json" });
//                 const url = window.URL.createObjectURL(blob);
//                 const a = document.createElement("a");
//                 a.href = url;
//                 a.download = "customers.json";
//                 a.click();
//             }
//         } catch (error) {
//             console.error("Error exporting data:", error);
//             setError("Error exporting data.");
//         }
//     };

//     // Format data for charts
//     const pieData = [
//         { name: "Churned", value: customers.length, color: COLORS.churned },
//         { name: "Active", value: activeCount, color: COLORS.active },
//     ].filter(entry => entry.value > 0);

//     const riskData = [
//         { name: "High Risk", value: riskStats.high_risk, color: COLORS.highRisk },
//         { name: "Medium Risk", value: riskStats.medium_risk, color: COLORS.mediumRisk },
//         { name: "Low Risk", value: riskStats.low_risk, color: COLORS.lowRisk },
//     ];

//     return (
//         <Container className="mt-4">
//             <h2 className="text-center mb-4">📊 Admin Dashboard - Customer Churn Analytics</h2>

//             {loading && (
//                 <div className="text-center">
//                     <Spinner animation="border" variant="primary" />
//                     <p>Loading dashboard data...</p>
//                 </div>
//             )}
            
//             {error && (
//                 <Alert variant="danger" onClose={() => setError(null)} dismissible>
//                     {error}
//                 </Alert>
//             )}

//             {/* Dashboard Overview */}
//             <Row>
//                 <Col md={12}>
//                     <Card className="shadow mb-4">
//                         <Card.Body>
//                             <Card.Title>Dashboard Overview</Card.Title>
//                             <Row>
//                                 <Col md={4}>
//                                     <h5>Total Customers: {totalCustomers}</h5>
//                                     <h5>Active: {activeCount} ({totalCustomers > 0 ? ((activeCount / totalCustomers * 100).toFixed(1)) : 0}%)</h5>
//                                     <h5>Churned: {customers.length} ({totalCustomers > 0 ? ((customers.length / totalCustomers * 100).toFixed(1)) : 0}%)</h5>
//                                 </Col>
//                                 <Col md={4}>
//                                     <h5>High Risk: {riskStats.high_risk}</h5>
//                                     <h5>Medium Risk: {riskStats.medium_risk}</h5>
//                                     <h5>Low Risk: {riskStats.low_risk}</h5>
//                                 </Col>
//                                 <Col md={4}>
//                                     <h5>Retention Rate: {retentionRate.toFixed(1)}%</h5>
//                                     <ProgressBar 
//                                         now={retentionRate} 
//                                         label={`${retentionRate.toFixed(1)}%`} 
//                                         variant={retentionRate > 70 ? "success" : retentionRate > 40 ? "warning" : "danger"}
//                                     />
//                                 </Col>
//                             </Row>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* Charts Row 1 */}
//             <Row className="g-4 mb-4">
//                 <Col md={6}>
//                     <Card className="shadow h-100">
//                         <Card.Body>
//                             <Card.Title>Customer Status</Card.Title>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 {pieData.length > 0 ? (
//                                     <PieChart>
//                                         <Pie
//                                             data={pieData}
//                                             cx="50%"
//                                             cy="50%"
//                                             outerRadius={80}
//                                             innerRadius={40}
//                                             dataKey="value"
//                                             label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                                         >
//                                             {pieData.map((entry, index) => (
//                                                 <Cell key={`cell-${index}`} fill={entry.color} />
//                                             ))}
//                                         </Pie>
//                                         <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
//                                         <Legend />
//                                     </PieChart>
//                                 ) : (
//                                     <div className="text-center py-5">
//                                         No customer data available
//                                     </div>
//                                 )}
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>

//                 <Col md={6}>
//                     <Card className="shadow h-100">
//                         <Card.Body>
//                             <Card.Title>Risk Distribution</Card.Title>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 {riskData.some(item => item.value > 0) ? (
//                                     <BarChart data={riskData}>
//                                         <CartesianGrid strokeDasharray="3 3" />
//                                         <XAxis dataKey="name" />
//                                         <YAxis />
//                                         <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
//                                         <Legend />
//                                         <Bar dataKey="value" fill="#8884d8">
//                                             {riskData.map((entry, index) => (
//                                                 <Cell key={`cell-${index}`} fill={entry.color} />
//                                             ))}
//                                             <LabelList dataKey="value" position="top" />
//                                         </Bar>
//                                     </BarChart>
//                                 ) : (
//                                     <div className="text-center py-5">
//                                         No risk data available
//                                     </div>
//                                 )}
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* Charts Row 2 */}
//             <Row className="g-4 mb-4">
//                 <Col md={6}>
//                     <Card className="shadow h-100">
//                         <Card.Body>
//                             <Card.Title>Churn by State</Card.Title>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 {churnByState.length > 0 ? (
//                                     <BarChart data={churnByState}>
//                                         <CartesianGrid strokeDasharray="3 3" />
//                                         <XAxis dataKey="state" />
//                                         <YAxis />
//                                         <Tooltip 
//                                             formatter={(value) => [`${value.toFixed(1)}%`, 'Churn Probability']}
//                                             labelFormatter={(label) => `State: ${label}`}
//                                         />
//                                         <Legend />
//                                         <Bar dataKey="churn_probability" fill="#FFCE56">
//                                             <LabelList 
//                                                 dataKey="churn_probability" 
//                                                 position="top" 
//                                                 formatter={(value) => `${value.toFixed(1)}%`}
//                                             />
//                                         </Bar>
//                                     </BarChart>
//                                 ) : (
//                                     <div className="text-center py-5">
//                                         No state churn data available
//                                     </div>
//                                 )}
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>

//                 <Col md={6}>
//                     <Card className="shadow h-100">
//                         <Card.Body>
//                             <Card.Title>Churn by Gender</Card.Title>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 {churnByGender.length > 0 ? (
//                                     <PieChart>
//                                         <Pie
//                                             data={churnByGender}
//                                             cx="50%"
//                                             cy="50%"
//                                             outerRadius={80}
//                                             innerRadius={40}
//                                             dataKey="churn_probability"
//                                             nameKey="gender"
//                                             label={({ gender, percent }) => `${gender}: ${(percent * 100).toFixed(0)}%`}
//                                         >
//                                             {churnByGender.map((entry, index) => (
//                                                 <Cell key={`cell-${index}`} fill={COLORS.gender[index % COLORS.gender.length]} />
//                                             ))}
//                                         </Pie>
//                                         <Tooltip formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Churn Probability']} />
//                                         <Legend />
//                                     </PieChart>
//                                 ) : (
//                                     <div className="text-center py-5">
//                                         No gender churn data available
//                                     </div>
//                                 )}
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* Charts Row 3 */}
//             <Row className="g-4 mb-4">
//                 <Col md={6}>
//                     <Card className="shadow h-100">
//                         <Card.Body>
//                             <Card.Title>Churn by Age Group</Card.Title>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 {churnByAge.length > 0 ? (
//                                     <BarChart data={churnByAge}>
//                                         <CartesianGrid strokeDasharray="3 3" />
//                                         <XAxis dataKey="ageRange" />
//                                         <YAxis />
//                                         <Tooltip formatter={(value) => [`${value}%`, 'Churn Percentage']} />
//                                         <Legend />
//                                         <Bar dataKey="churnPercentage" fill="#8884d8">
//                                             {churnByAge.map((entry, index) => (
//                                                 <Cell key={`cell-${index}`} fill={entry.color} />
//                                             ))}
//                                             <LabelList 
//                                                 dataKey="churnPercentage" 
//                                                 position="top" 
//                                                 formatter={(value) => `${value.toFixed(1)}%`}
//                                             />
//                                         </Bar>
//                                     </BarChart>
//                                 ) : (
//                                     <div className="text-center py-5">
//                                         No age churn data available
//                                     </div>
//                                 )}
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>

//                 <Col md={6}>
//                     <Card className="shadow h-100">
//                         <Card.Body>
//                             <Card.Title>Churn Trends</Card.Title>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 {churnTrends.length > 0 ? (
//                                     <LineChart data={churnTrends}>
//                                         <CartesianGrid strokeDasharray="3 3" />
//                                         <XAxis dataKey="month" />
//                                         <YAxis label={{ value: 'Churn %', angle: -90, position: 'insideLeft' }} />
//                                         <Tooltip 
//                                             formatter={(value) => [`${value.toFixed(1)}%`, 'Churn Rate']}
//                                             labelFormatter={(label) => `Month: ${label}`}
//                                         />
//                                         <Legend />
//                                         <Line 
//                                             type="monotone" 
//                                             dataKey="churned_customers" 
//                                             stroke="#FF6384" 
//                                             strokeWidth={2}
//                                             dot={{ r: 4 }}
//                                             activeDot={{ r: 6 }}
//                                         />
//                                     </LineChart>
//                                 ) : (
//                                     <div className="text-center py-5">
//                                         No trend data available
//                                     </div>
//                                 )}
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* Customer Segmentation */}
//             <Row className="mb-4">
//                 <Col md={12}>
//                     <Card className="shadow h-100">
//                         <Card.Body>
//                             <Card.Title>Customer Segmentation</Card.Title>
//                             <ResponsiveContainer width="100%" height={400}>
//                                 {customerSegments.length > 0 ? (
//                                     <PieChart>
//                                         <Pie
//                                             data={customerSegments}
//                                             cx="50%"
//                                             cy="50%"
//                                             outerRadius={100}
//                                             innerRadius={60}
//                                             dataKey="count"
//                                             nameKey="segment"
//                                             label={({ segment, percent }) => `${segment}: ${(percent * 100).toFixed(0)}%`}
//                                         >
//                                             {customerSegments.map((entry, index) => (
//                                                 <Cell 
//                                                     key={`cell-${index}`} 
//                                                     fill={COLORS[entry.segment.toLowerCase().replace(/\s+/g, '_')] || '#8884d8'} 
//                                                 />
//                                             ))}
//                                         </Pie>
//                                         <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
//                                         <Legend />
//                                     </PieChart>
//                                 ) : (
//                                     <div className="text-center py-5">
//                                         No segmentation data available
//                                     </div>
//                                 )}
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* High-Risk Customers Table */}
//             <Row className="mb-4">
//                 <Col md={12}>
//                     <Card className="shadow">
//                         <Card.Body>
//                             <Card.Title className="d-flex justify-content-between align-items-center">
//                                 High-Risk Customers
//                                 <Button 
//                                     variant="primary" 
//                                     size="sm"
//                                     onClick={() => exportData("csv")}
//                                 >
//                                     Export CSV
//                                 </Button>
//                             </Card.Title>
//                             <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
//                                 <Table striped bordered hover responsive>
//                                     <thead className="table-dark">
//                                         <tr>
//                                             <th>#</th>
//                                             <th>Name</th>
//                                             <th>Email</th>
//                                             <th>State</th>
//                                             <th>Gender</th>
//                                             <th>Age</th>
//                                             <th>Risk Score</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {highRiskCustomers.length > 0 ? (
//                                             highRiskCustomers.map((customer, index) => (
//                                                 <tr key={index}>
//                                                     <td>{index + 1}</td>
//                                                     <td>{customer.name || customer.user_name || 'N/A'}</td>
//                                                     <td>{customer.email || customer.user_email || 'N/A'}</td>
//                                                     <td>{customer.state || 'N/A'}</td>
//                                                     <td>{customer.gender || 'N/A'}</td>
//                                                     <td>{customer.age || 'N/A'}</td>
//                                                     <td>
//                                                         <Badge 
//                                                             bg={customer.churn_probability >= 0.7 
//                                                                 ? 'danger' 
//                                                                 : customer.churn_probability >= 0.5 
//                                                                     ? 'warning' 
//                                                                     : 'primary'}
//                                                         >
//                                                             {(customer.churn_probability * 100).toFixed(1)}%
//                                                         </Badge>
//                                                     </td>
//                                                 </tr>
//                                             ))
//                                         ) : (
//                                             <tr>
//                                                 <td colSpan="7" className="text-center">
//                                                     No high-risk customers found
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </Table>
//                             </div>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* Churned Customers Table */}
//             <Row>
//                 <Col md={12}>
//                     <Card className="shadow">
//                         <Card.Body>
//                             <Card.Title className="d-flex justify-content-between align-items-center">
//                                 Churned Customers
//                                 <Button 
//                                     variant="secondary" 
//                                     size="sm"
//                                     onClick={() => exportData("json")}
//                                 >
//                                     Export JSON
//                                 </Button>
//                             </Card.Title>
//                             <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
//                                 <Table striped bordered hover responsive>
//                                     <thead className="table-dark">
//                                         <tr>
//                                             <th>#</th>
//                                             <th>Name</th>
//                                             <th>Email</th>
//                                             <th>State</th>
//                                             <th>Gender</th>
//                                             <th>Age</th>
//                                             <th>Last Activity</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {customers.length > 0 ? (
//                                             customers.map((customer, index) => (
//                                                 <tr key={index}>
//                                                     <td>{index + 1}</td>
//                                                     <td>{customer.name || customer.user_name || 'N/A'}</td>
//                                                     <td>{customer.email || customer.user_email || 'N/A'}</td>
//                                                     <td>{customer.state || 'N/A'}</td>
//                                                     <td>{customer.gender || 'N/A'}</td>
//                                                     <td>{customer.age || 'N/A'}</td>
//                                                     <td>{customer.last_login_date || customer.last_activity || 'N/A'}</td>
//                                                 </tr>
//                                             ))
//                                         ) : (
//                                             <tr>
//                                                 <td colSpan="7" className="text-center">
//                                                     No churned customers found
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </Table>
//                             </div>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>
//         </Container>
//     );
// };

// export default AdminDashboard;
import { FiActivity, FiDownload, FiRefreshCw } from "react-icons/fi";
import axios from "axios";
import { useState, useEffect } from "react";
import { 
    Table, Button, Container, Spinner, Alert, Card, 
    Row, Col, Badge, ProgressBar, ButtonGroup
} from "react-bootstrap";
import { 
    PieChart, Pie, Cell, Tooltip, BarChart, Bar, 
    XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, 
    LabelList, LineChart, Line 
} from "recharts";
import { useNavigate } from "react-router-dom";

const COLORS = {
    churned: "#FF6384",
    active: "#4CAF50",
    state: "#FFCE56",
    gender: ["#4BC0C8", "#FF9F40", "#9966CC", "#36A2EB"],
    age: ["#E0F2F7", "#B3E5FC", "#4FC3F7", "#03A9F4", "#0288D1"],
    highRisk: "#FF0000",
    mediumRisk: "#FF8000",
    lowRisk: "#00FF00",
    notAssessed: "#CCCCCC"
};

const AdminDashboard = () => {
    // State declarations
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [churnByState, setChurnByState] = useState([]);
    const [churnByGender, setChurnByGender] = useState([]);
    const [churnByAge, setChurnByAge] = useState([]);
    const [riskStats, setRiskStats] = useState({
        high_risk: 0,
        medium_risk: 0,
        low_risk: 0,
        not_assessed: 0,
        total_customers: 0
    });
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [activeCount, setActiveCount] = useState(0);
    const [churnTrends, setChurnTrends] = useState([]);
    const [highRiskCustomers, setHighRiskCustomers] = useState([]);
    const [customerSegments, setCustomerSegments] = useState([]);
    const [retentionRate, setRetentionRate] = useState(0);
    const [lastRefreshed, setLastRefreshed] = useState(null);

    const navigate = useNavigate();

    // API configuration
    const API_BASE_URL = "http://localhost:8080";
    const axiosConfig = {
        headers: { "admin-id": localStorage.getItem("adminId") },
        withCredentials: true
    };

    useEffect(() => {
        if (!localStorage.getItem("isAdminAuthenticated")) {
            navigate("/admin-login");
        }
        fetchAllData();
    }, [navigate]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);
            await Promise.all([
                fetchCustomerData(),
                fetchTotalCustomers(),
                fetchChurnByState(),
                fetchChurnByGender(),
                fetchChurnByAge(),
                fetchRiskStats(),
                fetchChurnTrends(),
                fetchHighRiskCustomers(),
                fetchCustomerSegments(),
                fetchRetentionRate(),
            ]);
            setLastRefreshed(new Date());
        } catch (error) {
            setError("Error fetching dashboard data.");
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTotalCustomers = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/total-customers`, axiosConfig);
            setTotalCustomers(data.totalCustomers || 0);
            setActiveCount(data.activeCustomers || 0);
        } catch (error) {
            console.error("Error fetching total customers:", error);
            setTotalCustomers(0);
            setActiveCount(0);
        }
    };

    const fetchCustomerData = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/churned-customers`, axiosConfig);
            setCustomers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching customer data:", error);
            setCustomers([]);
        }
    };

    const fetchChurnByState = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/churn-state`, axiosConfig);
            if (!data || data.error) {
                throw new Error(data?.error || "Invalid data received");
            }
            setChurnByState(formatStateData(data));
        } catch (error) {
            console.error("Error fetching churn by state:", error);
            setError(`Failed to load churn by state data: ${error.message}`);
            setChurnByState([]);
        }
    };
    const formatStateData = (data) => {
        return Array.isArray(data) 
            ? data.map(item => ({
                state: item.state || 'Unknown',
                customer_count: Number(item.customer_count) || 0,
                churn_probability: Number(item.churn_probability) || 0
            }))
            : [];
    };

    const fetchChurnByGender = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/churn-gender`, axiosConfig);
            setChurnByGender(formatGenderData(data));
        } catch (error) {
            console.error("Error fetching churn by gender data:", error);
            setChurnByGender([]);
        }
    };

    const formatGenderData = (data) => {
        return Array.isArray(data)
            ? data.map(g => ({
                gender: g.gender || 'Unknown',
                customer_count: parseInt(g.customer_count, 10) || 0,
                churn_probability: parseFloat(g.churn_probability) || 0
            }))
            : [];
    };

    const fetchChurnByAge = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/churn-age`, axiosConfig);
            setChurnByAge(formatAgeData(data));
        } catch (error) {
            console.error("Error fetching churn by age data:", error);
            setChurnByAge([]);
        }
    };

    const formatAgeData = (data) => {
        return Array.isArray(data)
            ? data.map((entry, index) => ({
                ageRange: entry.ageRange || entry.age_group || "Unknown",
                churnPercentage: parseFloat(entry.churn_probability || entry.churnPercentage) * 100 || 0,
                color: COLORS.age[index % COLORS.age.length],
            }))
            : [];
    };

    const fetchRiskStats = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/churn-stats`, axiosConfig);
            setRiskStats({
                high_risk: Number(data?.high_risk) || 0,
                medium_risk: Number(data?.medium_risk) || 0,
                low_risk: Number(data?.low_risk) || 0,
                not_assessed: Number(data?.not_assessed) || 0,
                total_customers: totalCustomers
            });
        } catch (err) {
            console.error("Error fetching risk stats:", err);
            setRiskStats({
                high_risk: 0,
                medium_risk: 0,
                low_risk: 0,
                not_assessed: totalCustomers,
                total_customers: totalCustomers
            });
        }
    };

    const fetchChurnTrends = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/churn-trends`, axiosConfig);
            setChurnTrends(formatTrendData(data));
        } catch (error) {
            console.error("Error fetching churn trends:", error);
            setChurnTrends([]);
        }
    };

    const formatTrendData = (data) => {
        let formattedData = [];
        
        if (Array.isArray(data)) {
            formattedData = data.map(item => ({
                month: item.month,
                churned_customers: Number(item.churn_probability) * 100 || 0
            }));
        } else if (typeof data === 'object' && data !== null) {
            formattedData = Object.entries(data).map(([month, value]) => ({
                month,
                churned_customers: Number(value) * 100 || 0
            }));
        }

        formattedData.sort((a, b) => new Date(a.month) - new Date(b.month));
        return formattedData;
    };

    const fetchHighRiskCustomers = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/high-risk-customers`, axiosConfig);
            setHighRiskCustomers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching high-risk customers:", error);
            setHighRiskCustomers([]);
        }
    };

    const fetchCustomerSegments = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/customer-segments`, axiosConfig);
            setCustomerSegments(formatSegmentData(data));
        } catch (error) {
            console.error("Error fetching customer segments:", error);
            setCustomerSegments([]);
        }
    };

    const formatSegmentData = (data) => {
        return Array.isArray(data)
            ? data
            : Object.entries(data || {}).map(([segment, count]) => ({
                segment,
                count: Number(count) || 0
            }));
    };

    const fetchRetentionRate = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/retention-rate`, axiosConfig);
            setRetentionRate(formatRetentionRate(data));
        } catch (error) {
            console.error("Error fetching retention rate:", error);
            setRetentionRate(0);
        }
    };

    const formatRetentionRate = (data) => {
        return typeof data === 'object'
            ? parseFloat(data?.retentionRate || 0)
            : parseFloat(data || 0);
    };

    const exportData = async (format) => {
        try {
            if (!["csv", "json"].includes(format)) {
                throw new Error("Unsupported export format");
            }

            const response = await axios.get(`${API_BASE_URL}/export`, {
                ...axiosConfig,
                params: { format },
                responseType: format === "csv" ? "blob" : "json",
            });

            const blob = format === "csv" 
                ? new Blob([response.data], { type: "text/csv" })
                : new Blob([JSON.stringify(response.data)], { type: "application/json" });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `customers.${format}`;
            a.click();
        } catch (error) {
            console.error("Error exporting data:", error);
            setError("Error exporting data.");
        }
    };

    // Format data for charts
    const pieData = [
        { name: "Churned", value: customers.length, color: COLORS.churned },
        { name: "Active", value: activeCount, color: COLORS.active },
    ].filter(entry => entry.value > 0);

    const riskData = [
        { name: "High Risk", value: riskStats.high_risk, color: COLORS.highRisk },
        { name: "Medium Risk", value: riskStats.medium_risk, color: COLORS.mediumRisk },
        { name: "Low Risk", value: riskStats.low_risk, color: COLORS.lowRisk },
    ];

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>📊 Admin Dashboard - Customer Churn Analytics</h2>
                <div>
                    <Button 
                        variant="primary" 
                        onClick={fetchAllData}
                        disabled={loading}
                    >
                        <FiRefreshCw className={loading ? "spin" : ""} /> 
                        {loading ? " Refreshing..." : " Refresh Data"}
                    </Button>
                    {lastRefreshed && (
                        <small className="text-muted ms-2">
                            Last refreshed: {lastRefreshed.toLocaleTimeString()}
                        </small>
                    )}
                </div>
            </div>

            {loading && (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p>Loading dashboard data...</p>
                </div>
            )}
            
            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            {/* Dashboard Overview */}
            <Row>
                <Col md={12}>
                    <Card className="shadow mb-4">
                        <Card.Body>
                            <Card.Title>Dashboard Overview</Card.Title>
                            <Row>
                                <Col md={4}>
                                    <h5>Total Customers: {totalCustomers}</h5>
                                    <h5>Active: {activeCount} ({totalCustomers > 0 ? ((activeCount / totalCustomers * 100).toFixed(1)) : 0}%)</h5>
                                    <h5>Churned: {customers.length} ({totalCustomers > 0 ? ((customers.length / totalCustomers * 100).toFixed(1)) : 0}%)</h5>
                                </Col>
                                <Col md={4}>
                                    <h5>High Risk: {riskStats.high_risk}</h5>
                                    <h5>Medium Risk: {riskStats.medium_risk}</h5>
                                    <h5>Low Risk: {riskStats.low_risk}</h5>
                                </Col>
                                <Col md={4}>
                                    <h5>Retention Rate: {retentionRate.toFixed(1)}%</h5>
                                    <ProgressBar 
                                        now={retentionRate} 
                                        label={`${retentionRate.toFixed(1)}%`} 
                                        variant={retentionRate > 70 ? "success" : retentionRate > 40 ? "warning" : "danger"}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Charts Row 1 - Customer Status and Risk Distribution */}
            <Row className="g-4 mb-4">
                <Col md={6}>
                    <Card className="shadow h-100">
                        <Card.Body>
                            <Card.Title>Customer Status</Card.Title>
                            <ResponsiveContainer width="100%" height={300}>
                                {pieData.length > 0 ? (
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            innerRadius={40}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
                                        <Legend />
                                    </PieChart>
                                ) : (
                                    <div className="text-center py-5">
                                        No customer data available
                                    </div>
                                )}
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="shadow h-100">
                        <Card.Body>
                            <Card.Title>Risk Distribution</Card.Title>
                            <ResponsiveContainer width="100%" height={300}>
                                {riskData.some(item => item.value > 0) ? (
                                    <BarChart data={riskData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
                                        <Legend />
                                        <Bar dataKey="value" fill="#8884d8">
                                            {riskData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                            <LabelList dataKey="value" position="top" />
                                        </Bar>
                                    </BarChart>
                                ) : (
                                    <div className="text-center py-5">
                                        No risk data available
                                    </div>
                                )}
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Charts Row 2 - Churn by State and Gender */}
            <Row className="g-4 mb-4">
                <Col md={6}>
                    <Card className="shadow h-100">
                        <Card.Body>
                            <Card.Title>Churn by State</Card.Title>
                            <ResponsiveContainer width="100%" height={300}>
                                {churnByState.length > 0 ? (
                                    <BarChart data={churnByState}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="state" />
                                        <YAxis />
                                        <Tooltip 
                                            formatter={(value) => [`${value.toFixed(1)}%`, 'Churn Probability']}
                                            labelFormatter={(label) => `State: ${label}`}
                                        />
                                        <Legend />
                                        <Bar dataKey="churn_probability" fill="#FFCE56">
                                            <LabelList 
                                                dataKey="churn_probability" 
                                                position="top" 
                                                formatter={(value) => `${value.toFixed(1)}%`}
                                            />
                                        </Bar>
                                    </BarChart>
                                ) : (
                                    <div className="text-center py-5">
                                        No state churn data available
                                    </div>
                                )}
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="shadow h-100">
                        <Card.Body>
                            <Card.Title>Churn by Gender</Card.Title>
                            <ResponsiveContainer width="100%" height={300}>
                                {churnByGender.length > 0 ? (
                                    <PieChart>
                                        <Pie
                                            data={churnByGender}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            innerRadius={40}
                                            dataKey="churn_probability"
                                            nameKey="gender"
                                            label={({ gender, percent }) => `${gender}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {churnByGender.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS.gender[index % COLORS.gender.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Churn Probability']} />
                                        <Legend />
                                    </PieChart>
                                ) : (
                                    <div className="text-center py-5">
                                        No gender churn data available
                                    </div>
                                )}
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Charts Row 3 - Churn by Age and Trends */}
            <Row className="g-4 mb-4">
                <Col md={6}>
                    <Card className="shadow h-100">
                        <Card.Body>
                            <Card.Title>Churn by Age Group</Card.Title>
                            <ResponsiveContainer width="100%" height={300}>
                                {churnByAge.length > 0 ? (
                                    <BarChart data={churnByAge}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="ageRange" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => [`${value}%`, 'Churn Percentage']} />
                                        <Legend />
                                        <Bar dataKey="churnPercentage" fill="#8884d8">
                                            {churnByAge.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                            <LabelList 
                                                dataKey="churnPercentage" 
                                                position="top" 
                                                formatter={(value) => `${value.toFixed(1)}%`}
                                            />
                                        </Bar>
                                    </BarChart>
                                ) : (
                                    <div className="text-center py-5">
                                        No age churn data available
                                    </div>
                                )}
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="shadow h-100">
                        <Card.Body>
                            <Card.Title>Churn Trends</Card.Title>
                            <ResponsiveContainer width="100%" height={300}>
                                {churnTrends.length > 0 ? (
                                    <LineChart data={churnTrends}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis label={{ value: 'Churn %', angle: -90, position: 'insideLeft' }} />
                                        <Tooltip 
                                            formatter={(value) => [`${value.toFixed(1)}%`, 'Churn Rate']}
                                            labelFormatter={(label) => `Month: ${label}`}
                                        />
                                        <Legend />
                                        <Line 
                                            type="monotone" 
                                            dataKey="churned_customers" 
                                            stroke="#FF6384" 
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                ) : (
                                    <div className="text-center py-5">
                                        No trend data available
                                    </div>
                                )}
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Customer Segmentation */}
            <Row className="mb-4">
                <Col md={12}>
                    <Card className="shadow h-100">
                        <Card.Body>
                            <Card.Title>Customer Segmentation</Card.Title>
                            <ResponsiveContainer width="100%" height={400}>
                                {customerSegments.length > 0 ? (
                                    <PieChart>
                                        <Pie
                                            data={customerSegments}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            innerRadius={60}
                                            dataKey="count"
                                            nameKey="segment"
                                            label={({ segment, percent }) => `${segment}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {customerSegments.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={COLORS[entry.segment.toLowerCase().replace(/\s+/g, '_')] || '#8884d8'} 
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
                                        <Legend />
                                    </PieChart>
                                ) : (
                                    <div className="text-center py-5">
                                        No segmentation data available
                                    </div>
                                )}
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* High-Risk Customers Table */}
            <Row className="mb-4">
                <Col md={12}>
                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title className="d-flex justify-content-between align-items-center">
                                High-Risk Customers ({highRiskCustomers.length})
                                <ButtonGroup>
                                    <Button 
                                        variant="primary" 
                                        size="sm"
                                        onClick={() => exportData("csv")}
                                    >
                                        <FiDownload /> Export CSV
                                    </Button>
                                    <Button 
                                        variant="secondary" 
                                        size="sm"
                                        onClick={() => exportData("json")}
                                    >
                                        <FiDownload /> Export JSON
                                    </Button>
                                </ButtonGroup>
                            </Card.Title>
                            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                <Table striped bordered hover responsive>
                                    <thead className="table-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>State</th>
                                            <th>Gender</th>
                                            <th>Age</th>
                                            <th>Risk Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {highRiskCustomers.length > 0 ? (
                                            highRiskCustomers.map((customer, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{customer.name || customer.user_name || 'N/A'}</td>
                                                    <td>{customer.email || customer.user_email || 'N/A'}</td>
                                                    <td>{customer.state || 'N/A'}</td>
                                                    <td>{customer.gender || 'N/A'}</td>
                                                    <td>{customer.age || 'N/A'}</td>
                                                    <td>
                                                        <Badge 
                                                            bg={customer.churn_probability >= 0.7 
                                                                ? 'danger' 
                                                                : customer.churn_probability >= 0.5 
                                                                    ? 'warning' 
                                                                    : 'primary'}
                                                        >
                                                            {(customer.churn_probability * 100).toFixed(1)}%
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center">
                                                    No high-risk customers found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Churned Customers Table */}
            <Row>
                <Col md={12}>
                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title className="d-flex justify-content-between align-items-center">
                                Churned Customers ({customers.length})
                                <ButtonGroup>
                                    <Button 
                                        variant="primary" 
                                        size="sm"
                                        onClick={() => exportData("csv")}
                                    >
                                        <FiDownload /> Export CSV
                                    </Button>
                                    <Button 
                                        variant="secondary" 
                                        size="sm"
                                        onClick={() => exportData("json")}
                                    >
                                        <FiDownload /> Export JSON
                                    </Button>
                                </ButtonGroup>
                            </Card.Title>
                            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                <Table striped bordered hover responsive>
                                    <thead className="table-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>State</th>
                                            <th>Gender</th>
                                            <th>Age</th>
                                            <th>Last Activity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers.length > 0 ? (
                                            customers.map((customer, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{customer.name || customer.user_name || 'N/A'}</td>
                                                    <td>{customer.email || customer.user_email || 'N/A'}</td>
                                                    <td>{customer.state || 'N/A'}</td>
                                                    <td>{customer.gender || 'N/A'}</td>
                                                    <td>{customer.age || 'N/A'}</td>
                                                    <td>{customer.last_login_date || customer.last_activity || 'N/A'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center">
                                                    No churned customers found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;