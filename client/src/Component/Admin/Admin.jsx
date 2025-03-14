// import axios from "axios";
// import { useState, useEffect } from "react";
// import {
//     Table,
//     Button,
//     Container,
//     Spinner,
//     Alert,
//     Card,
//     Row,
//     Col,
// } from "react-bootstrap";
// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Legend,
//     ResponsiveContainer,
//     LabelList,
// } from "recharts";
// import { useNavigate } from "react-router-dom";

// const COLORS = {
//     churned: "#FF6384",
//     active: "#36A2EB",
//     state: "#FFCE56",
//     gender: ["#4BC0C8", "#FF9F40", "#9966CC", "#36A2EB"],
//     age: ["#E0F2F7", "#B3E5FC", "#4FC3F7", "#03A9F4", "#0288D1"],
// };

// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
//     const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

//     return (
//         <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
//             {`${(percent * 100).toFixed(0)}%`}
//         </text>
//     );
// };

// const AdminDashboard = () => {
//     const [customers, setCustomers] = useState([]); // Fixed: Initialized with empty array
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [churnStats, setChurnStats] = useState({ churned: 0, active: 0 });
//     const [churnByState, setChurnByState] = useState([]); // Fixed: Initialized with empty array
//     const [churnByGender, setChurnByGender] = useState([]); // Fixed: Initialized with empty array
//     const [churnByAge, setChurnByAge] = useState([]); // Fixed: Initialized with empty array
//     const navigate = useNavigate();

//     useEffect(() => {
//         const isAdmin = localStorage.getItem("isAdminAuthenticated") === "true";
//         if (!isAdmin) navigate("/admin-login");
//     }, [navigate]);

//     useEffect(() => {
//         fetchCustomerData();
//     }, []);
//     const formatChurnPercentage = (value) => {
//         return `${value.toFixed(2)}%`;
//       };


//     const fetchCustomerData = async () => {
//         setLoading(true);
//         setError(null);

//         try {
//             const adminId = localStorage.getItem("adminId");
//             if (!adminId) {
//                 setError("Admin ID missing. Please login.");
//                 navigate("/admin-login");
//                 return;
//             }

//             const { data } = await axios.get("http://localhost:8080/churned-customers", {
//                 headers: { "admin-id": adminId },
//                 withCredentials: true,
//             });

//             if (!Array.isArray(data) || data.length === 0) {
//                 throw new Error("No customer data available.");
//             }

//             setCustomers(data.map(customer => ({
//                 ...customer,
//                 churnStatus: "Churned", // Since we're fetching churned customers only
//             })));

//             setChurnStats({ churned: data.length, active: 0 });
//             fetchChurnByState();
//             fetchChurnByGender();
//             fetchChurnByAge();
//         } catch (error) {
//             setError(error.response?.data?.message || error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchChurnByState = async () => {
//         try {
//             const adminId = localStorage.getItem("adminId");
//             const { data } = await axios.get("http://localhost:8080/churned-state", {
//                 headers: { "admin-id": adminId },
//                 withCredentials: true,
//             });

//             setChurnByState(data || []);
//         } catch (error) {
//             console.error("Error fetching churn data by state:", error);
//         }
//     };

//     const fetchChurnByGender = async () => {
//         try {
//             const adminId = localStorage.getItem("adminId");
//             const { data } = await axios.get("http://localhost:8080/churned-gender", {
//                 headers: { "admin-id": adminId },
//                 withCredentials: true,
//             });

//             setChurnByGender(data.map(item => ({
//                 ...item,
//                 customer_count: parseInt(item.customer_count, 10)
//             })) || []);
//         } catch (error) {
//             console.error("Error fetching churn data by gender:", error);
//         }
//     };

//     const fetchChurnByAge = async () => {
//         try {
//             const adminId = localStorage.getItem("adminId");
//             const { data } = await axios.get("http://localhost:8080/churned-age", {
//                 headers: { "admin-id": adminId },
//                 withCredentials: true,
//             });

//             setChurnByAge(data || []);
//         } catch (error) {
//             console.error("Error fetching churn data by age:", error);
//         }
//     };

//     return (
//         <Container className="mt-4">
//             <h2 className="text-center mb-4">📊 Admin Dashboard - Customer Churn Analytics</h2>

//             {error && <Alert variant="danger">{error}</Alert>}

//             <div className="d-flex justify-content-center mb-3">
//                 <Button variant="primary" onClick={fetchCustomerData} disabled={loading}>
//                     {loading ? <Spinner size="sm" animation="border" /> : "Refresh Data"}
//                 </Button>
//             </div>

//             <Row>
//                 <Col md={6}>
//                     <Card className="shadow">
//                         <Card.Body>
//                             <Card.Title>Customer Churn Statistics</Card.Title>
//                             <ResponsiveContainer width="100%" height={360}>
//                                 <PieChart>
//                                     <Pie data={[
//                                         { name: "Churned", value: churnStats.churned },
//                                         { name: "Active", value: churnStats.active },
//                                     ]}
//                                         cx="50%" cy="50%" outerRadius={100} dataKey="value"
//                                         label={renderCustomizedLabel}
//                                     >
//                                         <Cell fill={COLORS.churned} />
//                                         <Cell fill={COLORS.active} />
//                                     </Pie>
//                                     <Tooltip />
//                                     <Legend />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>

//                 <Col md={6} >
//                     <Card className="shadow">
//                         <Card.Body>
//                             <Card.Title>Churn by State</Card.Title>
//                             <ResponsiveContainer width="100%" height={360}>
//                                 <BarChart data={churnByState}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="state" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="customer_count" fill={COLORS.state} >
//                                         <LabelList dataKey="customer_count" position="top" />
//                                     </Bar>
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>

//                 <Col md={6}>
//                     <Card>
//                         <Card.Body>
//                             <Card.Title>Churn by Gender</Card.Title>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <PieChart>
//                                     <Pie
//                                         data={churnByGender}
//                                         cx="50%"
//                                         cy="50%"
//                                         outerRadius={100}
//                                         dataKey="customer_count"
//                                         nameKey="gender"
//                                         label={renderCustomizedLabel}
//                                     >
//                                         {churnByGender.map((entry, index) => (
//                                             <Cell key={`cell-${index}`} fill={COLORS.gender[index % COLORS.gender.length]} />
//                                         ))}
//                                         <LabelList dataKey="gender" position="outside" />
//                                     </Pie>
//                                     <Tooltip />
//                                     <Legend />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>

//                 <Col md={6} >
//                     <Card className="shadow">
//                         <Card.Body>
//                             <Card.Title>Customer Churn by Age Group</Card.Title>
//                             <ResponsiveContainer width="100%" height={360}>
//                                 {churnByAge.length > 0 ? (
//                                     <BarChart data={churnByAge} barSize={40}>
//                                         <CartesianGrid strokeDasharray="3 3" />
//                                         <XAxis dataKey="ageRange" label={{ value: "Age Group", position: "insideBottom", offset: -5 }} />
//                                         <YAxis
//                                             tickFormatter={(value) => Math.ceil(value)}
//                                             domain={[0, 'auto']}
//                                             allowDecimals={false}
//                                             tickCount={10}
//                                             interval={1}
//                                             label={{ value: "Churn Percentage (%)", angle: -90, position: "insideLeft" }}
//                                         />
//                                         <Tooltip formatter={(value, name, props) => {
//                                             if (name === "churnPercentage") {
//                                                 return [`${value}%`, "Churn Percentage"];
//                                             }
//                                             return [`${value}`, name];
//                                         }} />
//                                         <Legend />
//                                         <Bar dataKey="churnPercentage" fill="#90CAF9">
//                                             <LabelList dataKey="churnPercentage" position="top" formatter={formatChurnPercentage} />
//                                         </Bar>
//                                     </BarChart>
//                                 ) : (
//                                     <div style={{ textAlign: "center", paddingTop: "50px" }}>
//                                         No age group data available.
//                                     </div>
//                                 )}
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>


//             </Row>

//             <h3 className="mt-4">Churned Customers</h3>
//             {customers.length > 0 ? (
//                 <Table striped bordered hover>
//                     <thead>
//                         <tr>
//                             <th>ID</th>
//                             <th>Name</th>
//                             <th>Email</th>
//                             <th>Churn Status</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {customers.map((customer, index) => (
//                             <tr key={index}>
//                                 <td>{customer.user_id}</td>
//                                 <td>{customer.user_name}</td>
//                                 <td>{customer.user_email}</td>
//                                 <td>{customer.churnStatus}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </Table>
//             ) : (
//                 <p className="text-center">No churned customers found.</p>
//             )}
//         </Container>
//     );
// };

// export default AdminDashboard;



// import axios from "axios";
// import { useState, useEffect } from "react";
// import { Table, Button, Container, Spinner, Alert, Card, Row, Col } from "react-bootstrap";
// import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LabelList } from "recharts";
// import { useNavigate } from "react-router-dom";
// import Chart from "chart.js/auto";

// const COLORS = {
//     churned: "#FF6384",
//     active: "#4CAF50",// Green for active customers
//     state: "#FFCE56",
//     gender: ["#4BC0C8", "#FF9F40", "#9966CC", "#36A2EB"],
//     age: ["#E0F2F7", "#B3E5FC", "#4FC3F7", "#03A9F4", "#0288D1"],
// };

// const AdminDashboard = () => {
//     const [customers, setCustomers] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [churnByState, setChurnByState] = useState([]);
//     const [churnByGender, setChurnByGender] = useState([]);
//     const [churnByAge, setChurnByAge] = useState([]);
//     const navigate = useNavigate();
//     const [churnStats, setChurnStats] = useState(null);

//     const [totalCustomers, setTotalCustomers] = useState(0);
//     const churnedCustomers = customers.length;
//     const activeCount = totalCustomers - churnedCustomers;

//     const pieData = [
//         { name: "Churned", value: churnedCustomers, color: COLORS.churned },
//         { name: "Active", value: activeCount >= 0 ? activeCount : 0, color: COLORS.active }
//     ];
//     const fetchTotalCustomers = async () => {
//         try {
//             const { data } = await axios.get("http://localhost:8080/total-customers", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//             });
//             setTotalCustomers(data.totalCustomers);
//         } catch (error) {
//             console.error("❌ Error fetching total customers:", error?.response?.data || error.message);

//         }
//     };

//     useEffect(() => {
//         const fetchChurnStats = async () => {
//             try {
//                 const response = await axios.get("http://localhost:8080/churn-stats");
//                 setChurnStats(response.data);
//             } catch (error) {
//                 console.error("Error fetching churn stats:", error);
//             }
//         };
//         fetchChurnStats();
//     }, []);
//     {churnStats && Object.keys(churnStats).length > 0 ? (
//         <Chart data={churnStats} />
//     ) : (
//         <p>Loading or No Data Available</p>
//     )}



//     useEffect(() => {
//         if (localStorage.getItem("isAdminAuthenticated") !== "true") {
//             navigate("/admin-login");
//         }
//         fetchCustomerData();
//         fetchTotalCustomers();  // Fetch total customers count
//     }, [navigate]);


//     useEffect(() => {
//         if (localStorage.getItem("isAdminAuthenticated") !== "true") {
//             navigate("/admin-login");
//         }
//         fetchCustomerData();
//         fetchTotalCustomers(); // Ensures total customers count is updated
//     }, [navigate]);
//     useEffect(() => {
//         const interval = setInterval(() => {
//             fetchCustomerData();
//         }, 30000); // Refresh every 30 seconds

//         return () => clearInterval(interval); // Cleanup on unmount
//     }, []);

//     const renderCharts = (data) => {
//         const ctx = document.getElementById("churnChart").getContext("2d");
//         new Chart(ctx, {
//             type: "bar",
//             data: {
//                 labels: data.map((d) => d.state),
//                 datasets: [
//                     {
//                         label: "High Risk",
//                         data: data.map((d) => d.high_risk),
//                         backgroundColor: "red",
//                     },
//                     {
//                         label: "Medium Risk",
//                         data: data.map((d) => d.medium_risk),
//                         backgroundColor: "orange",
//                     },
//                     {
//                         label: "Low Risk",
//                         data: data.map((d) => d.low_risk),
//                         backgroundColor: "green",
//                     },
//                 ],
//             },
//         });
//     };

//     const predictChurn = async (customerData) => {
//         try {
//             const response = await axios.post("http://localhost:8080/predict-churn", customerData);
//             const churnRisk = response.data.churn_probability;

//             // Update the UI with new churn risk
//             setCustomers((prevCustomers) =>
//                 prevCustomers.map((c) =>
//                     c.user_id === customerData.user_id ? { ...c, churn_risk: churnRisk } : c
//                 )
//             );

//             return churnRisk;
//         } catch (error) {
//             console.error("Error predicting churn:", error);
//             return null;
//         }
//     };


//     const fetchCustomerData = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const adminId = localStorage.getItem("adminId");
//             if (!adminId) {
//                 setError("Admin ID missing. Please login.");
//                 navigate("/admin-login");
//                 return;
//             }

//             const [customersData, stateData, genderData, ageData] = await Promise.all([
//                 axios.get("http://localhost:8080/churned-customers", { headers: { "admin-id": adminId }, withCredentials: true }),
//                 axios.get("http://localhost:8080/churned-state", { headers: { "admin-id": adminId }, withCredentials: true }),
//                 axios.get("http://localhost:8080/churned-gender", { headers: { "admin-id": adminId }, withCredentials: true }),
//                 axios.get("http://localhost:8080/churned-age", { headers: { "admin-id": adminId }, withCredentials: true }),
//             ]);

//             setCustomers(customersData.data);
//             setChurnByState(stateData.data);
//             setChurnByGender(genderData.data);
//             setChurnByAge(ageData.data);
//         } catch (error) {
//             setError(error.response?.data?.message || error.message);
//         } finally {
//             setLoading(false);
//         }
//     };


//     const fetchChurnByState = async () => {
//         try {
//             const { data } = await axios.get("http://localhost:8080/churned-state", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//             });
//             setChurnByState(data);
//         } catch (error) {
//             console.error("Error fetching churn by state:", error);
//         }
//     };

//     const fetchChurnByGender = async () => {
//         try {
//             const { data } = await axios.get("http://localhost:8080/churned-gender", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//             });
//             // Ensure no duplicate entries by using a map
//             const uniqueData = data.reduce((acc, curr) => {
//                 if (!acc.some(item => item.gender === curr.gender)) {
//                     acc.push({ ...curr, customer_count: parseInt(curr.customer_count, 10) });
//                 }
//                 return acc;
//             }, []);
//             setChurnByGender(uniqueData);
//         } catch (error) {
//             console.error("Error fetching churn by gender:", error);
//         }
//     };

//     const fetchChurnByAge = async () => {
//         try {
//             const { data } = await axios.get("http://localhost:8080/churned-age", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//             });
//             setChurnByAge(data);
//         } catch (error) {
//             console.error("Error fetching churn by age:", error);
//         }
//     };

//     return (
//         <Container className="mt-4">
//             <h2 className="text-center mb-4">📊 Admin Dashboard - Customer Churn Analytics</h2>
//             <canvas id="churnChart"></canvas>
//             {error && <Alert variant="danger">{error}</Alert>}
//             <div className="d-flex justify-content-center mb-3">
//                 <Button variant="primary" onClick={fetchCustomerData} disabled={loading}>
//                     {loading ? <Spinner size="sm" animation="border" /> : "Refresh Data"}
//                 </Button>
//             </div>
//             <Row>
//                 <Col md={6}>
//                     <Card className="shadow">
//                         <Card.Body>
//                             <Card.Title>Customer Churn Statistics</Card.Title>
//                             <ResponsiveContainer width="100%" height={360}>
//                                 <PieChart width={400} height={300}>
//                                     <Pie
//                                         data={pieData}
//                                         cx="50%"
//                                         cy="50%"
//                                         outerRadius={100}
//                                         fill="#8884d8"
//                                         dataKey="value"
//                                         label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                                     >
//                                         {pieData.map((entry, index) => (
//                                             <Cell key={`cell-${index}`} fill={entry.color} />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip />
//                                     <Legend />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>

//                 <Col md={6}>
//                     <Card className="shadow">
//                         <Card.Body>
//                             <Card.Title>Churn by State</Card.Title>
//                             <ResponsiveContainer width="100%" height={360}>
//                                 <BarChart data={churnByState} barSize={40}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="state" />
//                                     <YAxis tick={{ fontSize: 12 }} tickCount={10} />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="customer_count" fill={COLORS.state}>
//                                         <LabelList dataKey="customer_count" position="top" />
//                                     </Bar>
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>

//                 <Col md={6}>
//                     <Card>
//                         <Card.Body>
//                             <Card.Title>Churn by Gender</Card.Title>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <PieChart>
//                                     <Pie data={churnByGender} cx="50%" cy="50%" outerRadius={100} dataKey="customer_count" nameKey="gender">
//                                         {churnByGender.map((entry, index) => (
//                                             <Cell key={`cell-${index}`} fill={COLORS.gender[index % COLORS.gender.length]} />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip />
//                                     <Legend />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col md={6}>
//                     <Card>
//                         <Card.Body>
//                             <Card.Title>Churn by Age</Card.Title>
//                             <ResponsiveContainer width="100%" height={360}>
//                                 <BarChart data={churnByAge} barSize={40}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="ageRange" />
//                                     <YAxis tickCount={10} />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="churnPercentage" fill={COLORS.age[2]}>
//                                         <LabelList dataKey="churnPercentage" position="top" />
//                                     </Bar>
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>
//             <h3 className="mt-4">Churned Customers</h3>
//             {churnStats && churnStats.length > 0 ? (
//     <table border="1">
//         <thead>
//             <tr>
//                 <th>State</th>
//                 <th>Gender</th>
//                 <th>Age</th>
//                 <th>High Risk</th>
//                 <th>Medium Risk</th>
//                 <th>Low Risk</th>
//             </tr>
//         </thead>
//         <tbody>
//             {churnStats.map((row, index) => (
//                 <tr key={index}>
//                     <td>{row.state}</td>
//                     <td>{row.gender}</td>
//                     <td>{row.age}</td>
//                     <td>{row.high_risk}</td>
//                     <td>{row.medium_risk}</td>
//                     <td>{row.low_risk}</td>
//                 </tr>
//             ))}
//         </tbody>
//     </table>
// ) : (
//     <p className="text-center">No churn data available.</p>
// )}
//         </Container>
//     );
// };

// // export default AdminDashboard;
// import axios from "axios";
// import { useState, useEffect } from "react";
// import { Table, Button, Container, Spinner, Alert, Card, Row, Col } from "react-bootstrap";
// import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LabelList } from "recharts";
// import { useNavigate } from "react-router-dom";
// import Chart from "chart.js/auto";

// // Define colors for different categories
// const COLORS = {
//     churned: "#FF6384",
//     active: "#4CAF50",
//     state: "#FFCE56",
//     gender: ["#4BC0C8", "#FF9F40", "#9966CC", "#36A2EB"],
//     age: ["#E0F2F7", "#B3E5FC", "#4FC3F7", "#03A9F4", "#0288D1"],
// };

// const AdminDashboard = () => {
//     const [customers, setCustomers] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [churnByState, setChurnByState] = useState([]);
//     const [churnByGender, setChurnByGender] = useState([]);
//     const [churnByAge, setChurnByAge] = useState([]);
//     const [churnStats, setChurnStats] = useState(null);
//     const [totalCustomers, setTotalCustomers] = useState(0);

//     const navigate = useNavigate();
//     const churnedCustomers = customers.length;
//     const activeCount = totalCustomers - churnedCustomers;

//     const pieData = [
//         { name: "Churned", value: churnedCustomers, color: COLORS.churned },
//         { name: "Active", value: activeCount >= 0 ? activeCount : 0, color: COLORS.active }
//     ];

//     useEffect(() => {
//         if (localStorage.getItem("isAdminAuthenticated") !== "true") {
//             navigate("/admin-login");
//         }
//         fetchCustomerData();
//         fetchTotalCustomers();
//     }, []);
//     useEffect(() => {
//         fetchChurnByAge();
//     }, []);

//     const fetchChurnByAge = async () => {
//         try {
//             const response = await axios.get("http://localhost:8080/churned-age", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//             });

//             // Check if data is valid
//             if (!response.data || !Array.isArray(response.data)) {
//                 console.error("Invalid churn by age data:", response.data);
//                 return;
//             }

//             // Ensure values are numbers and remove NaN values
//             const formattedData = response.data.map((entry) => ({
//                 ageRange: entry.ageRange || "Unknown",
//                 churnPercentage: isNaN(parseFloat(entry.churnPercentage)) ? 0 : parseFloat(entry.churnPercentage),
//             }));

//             console.log("Churn by Age Data:", formattedData); // Debugging

//             setChurnByAge(formattedData);
//         } catch (error) {
//             console.error("Error fetching churn by age data:", error);
//         }
//     };

//     // Fetch total customers
//     const fetchTotalCustomers = async () => {
//         try {
//             const { data } = await axios.get("http://localhost:8080/total-customers", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//             });
//             setTotalCustomers(data.totalCustomers);
//         } catch (error) {
//             console.error("Error fetching total customers:", error);
//         }
//     };

//     // Fetch customer data including churn analytics
//     const fetchCustomerData = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const adminId = localStorage.getItem("adminId");
//             if (!adminId) {
//                 setError("Admin ID missing. Please login.");
//                 navigate("/admin-login");
//                 return;
//             }

//             const [customersData, stateData, genderData, ageData, statsData] = await Promise.all([
//                 axios.get("http://localhost:8080/churned-customers", { headers: { "admin-id": adminId }, withCredentials: true }),
//                 axios.get("http://localhost:8080/churned-state", { headers: { "admin-id": adminId }, withCredentials: true }),
//                 axios.get("http://localhost:8080/churned-gender", { headers: { "admin-id": adminId }, withCredentials: true }),
//                 axios.get("http://localhost:8080/churned-age", { headers: { "admin-id": adminId }, withCredentials: true }),
//                 axios.get("http://localhost:8080/churn-stats")
//             ]);

//             setCustomers(customersData.data);
//             setChurnByState(stateData.data);
//             setChurnByGender(genderData.data.map(g => ({ gender: g.gender, customer_count: parseInt(g.customer_count, 10) })));
//             setChurnByAge(ageData.data.map(a => ({ ageRange: a.ageRange, churnPercentage: parseFloat(a.churnPercentage) })));
//             setChurnStats(statsData.data);
//         } catch (error) {
//             setError(error.response?.data?.message || error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Container className="mt-4">
//             <h2 className="text-center mb-4">📊 Admin Dashboard - Customer Churn Analytics</h2>

//             {error && <Alert variant="danger">{error}</Alert>}

//             <div className="d-flex justify-content-center mb-3">
//                 <Button variant="primary" onClick={fetchCustomerData} disabled={loading}>
//                     {loading ? <Spinner size="sm" animation="border" /> : "Refresh Data"}
//                 </Button>
//             </div>

//             <Row>
//                 <Col md={6}>
//                     <Card className="shadow">
//                         <Card.Body>
//                             <Card.Title>Customer Churn Statistics</Card.Title>
//                             <ResponsiveContainer width="100%" height={360}>
//                                 <PieChart>
//                                     <Pie
//                                         data={pieData}
//                                         cx="50%"
//                                         cy="50%"
//                                         outerRadius={100}
//                                         dataKey="value"
//                                         label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                                     >
//                                         {pieData.map((entry, index) => (
//                                             <Cell key={`cell-${index}`} fill={entry.color} />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip />
//                                     <Legend />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>

//                 <Col md={6}>
//                     <Card className="shadow">
//                         <Card.Body>
//                             <Card.Title>Churn by State</Card.Title>
//                             <ResponsiveContainer width="100%" height={360}>
//                                 <BarChart data={churnByState}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="state" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="customer_count" fill={COLORS.state}>
//                                         <LabelList dataKey="customer_count" position="top" />
//                                     </Bar>
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>

//                 <Col md={6}>
//                     <Card>
//                         <Card.Body>
//                             <Card.Title>Churn by Gender</Card.Title>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <PieChart>
//                                     <Pie data={churnByGender} cx="50%" cy="50%" outerRadius={100} dataKey="customer_count" nameKey="gender">
//                                         {churnByGender.map((entry, index) => (
//                                             <Cell key={`cell-${index}`} fill={COLORS.gender[index % COLORS.gender.length]} />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip />
//                                     <Legend />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>

//                 <Col md={6}>
//                     <Card>
//                         <Card.Body>
//                             <Card.Title>Churn by Age</Card.Title>
//                             {churnByAge.length > 0 ? (
//                                 <ResponsiveContainer width="100%" height={360}>
//                                     <BarChart data={churnByAge}>
//                                         <CartesianGrid strokeDasharray="3 3" />
//                                         <XAxis dataKey="ageRange" />
//                                         <YAxis />
//                                         <Tooltip />
//                                         <Legend />
//                                         <Bar dataKey="churnPercentage" fill={COLORS[2]}>
//                                             <LabelList dataKey="churnPercentage" position="top" />
//                                         </Bar>
//                                     </BarChart>
//                                 </ResponsiveContainer>
//                             ) : (
//                                 <p>No data available</p>
//                             )}
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <h3 className="mt-4">Churned Customers</h3>
//                 {churnStats && churnStats.length > 0 ? (
//                     <table border="1">
//                         <thead>
//                             <tr>
//                                 <th>State</th>
//                                 <th>Gender</th>
//                                 <th>Age</th>
//                                 <th>High Risk</th>
//                                 <th>Medium Risk</th>
//                                 <th>Low Risk</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {churnStats.map((row, index) => (
//                                 <tr key={index}>
//                                     <td>{row.state}</td>
//                                     <td>{row.gender}</td>
//                                     <td>{row.age}</td>
//                                     <td>{row.high_risk}</td>
//                                     <td>{row.medium_risk}</td>
//                                     <td>{row.low_risk}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 ) : (
//                     <p className="text-center">No churn data available.</p>
//                 )}
//             </Row>
//         </Container>
//     );
// };

// export default AdminDashboard;


// import axios from "axios";
// import { useState, useEffect } from "react";
// import { Table, Button, Container, Spinner, Alert, Card, Row, Col } from "react-bootstrap";
// import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LabelList } from "recharts";
// import { useNavigate } from "react-router-dom";

// // Define colors for different categories
// const COLORS = {
//     churned: "#FF6384",
//     active: "#4CAF50",
//     state: "#FFCE56",
//     gender: ["#4BC0C8", "#FF9F40", "#9966CC", "#36A2EB"],
//     age: ["#E0F2F7", "#B3E5FC", "#4FC3F7", "#03A9F4", "#0288D1"],
// };

// const AdminDashboard = () => {
//     const [customers, setCustomers] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [churnByState, setChurnByState] = useState([]);
//     const [churnByGender, setChurnByGender] = useState([]);
//     const [churnByAge, setChurnByAge] = useState([]);
//     const [churnStats, setChurnStats] = useState(null);
//     const [totalCustomers, setTotalCustomers] = useState(0);
//     const [pagination, setPagination] = useState({ page: 1, perPage: 10 });

//     const navigate = useNavigate();
//     const churnedCustomers = customers.length;
//     const activeCount = totalCustomers - churnedCustomers;

//     const pieData = [
//         { name: "Churned", value: churnedCustomers, color: COLORS.churned },
//         { name: "Active", value: activeCount > 0 ? activeCount : 0, color: COLORS.active }  // Ensure activeCount is always non-negative
//     ];


//     useEffect(() => {
//         if (localStorage.getItem("isAdminAuthenticated") !== "true") {
//             navigate("/admin-login");
//         }
//         fetchCustomerData();
//         fetchTotalCustomers();
//     }, []);

//     useEffect(() => {
//         fetchChurnByAge();
//     }, []);

//     // Fetch churn by age data with dynamic color rendering
//     const fetchChurnByAge = async () => {
//         try {
//             const response = await axios.get("http://localhost:8080/churned-age", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//             });

//             if (!response.data || !Array.isArray(response.data)) {
//                 console.error("Invalid churn by age data:", response.data);
//                 return;
//             }

//             const formattedData = response.data.map((entry, index) => ({
//                 ageRange: entry.ageRange || "Unknown",
//                 churnPercentage: isNaN(parseFloat(entry.churnPercentage)) ? 0 : parseFloat(entry.churnPercentage),
//                 color: COLORS.age[index % COLORS.age.length]  // Dynamic color based on index
//             }));

//             console.log("Churn by Age Data:", formattedData);
//             setChurnByAge(formattedData);
//         } catch (error) {
//             console.error("Error fetching churn by age data:", error);
//         }
//     };

//     // Fetch total customers count
//     const fetchTotalCustomers = async () => {
//         try {
//             const { data } = await axios.get("http://localhost:8080/total-customers", {
//                 headers: { "admin-id": localStorage.getItem("adminId") },
//                 withCredentials: true,
//             });
//             setTotalCustomers(data.totalCustomers);
//         } catch (error) {
//             console.error("Error fetching total customers:", error);
//         }
//     };

//     // Fetch customer data with churn analytics
//     // const fetchCustomerData = async () => {
//     //     setLoading(true);
//     //     setError(null);
//     //     try {
//     //         const adminId = localStorage.getItem("adminId");
//     //         if (!adminId) {
//     //             setError("Admin ID missing. Please login.");
//     //             navigate("/admin-login");
//     //             return;
//     //         }

//     //         const [customersData, stateData, genderData, ageData, statsData] = await Promise.all([
//     //             axios.get("http://localhost:8080/churned-customers", { headers: { "admin-id": adminId }, withCredentials: true }),
//     //             axios.get("http://localhost:8080/churned-state", { headers: { "admin-id": adminId }, withCredentials: true }),
//     //             axios.get("http://localhost:8080/churned-gender", { headers: { "admin-id": adminId }, withCredentials: true }),
//     //             axios.get("http://localhost:8080/churned-age", { headers: { "admin-id": adminId }, withCredentials: true }),
//     //             axios.get("http://localhost:8080/churn-stats")
//     //         ]);

//     //         setCustomers(customersData.data);
//     //         setChurnByState(stateData.data);
//     //         setChurnByGender(genderData.data.map(g => ({ gender: g.gender, customer_count: parseInt(g.customer_count, 10) })));
//     //         setChurnByAge(ageData.data.map(a => ({ ageRange: a.ageRange, churnPercentage: parseFloat(a.churnPercentage) })));
//     //         setChurnStats(statsData.data);
//     //     } catch (error) {
//     //         setError("Error fetching data. Please try again later.");
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };

//     const fetchCustomerData = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const adminId = localStorage.getItem("adminId");
//             if (!adminId) {
//                 setError("Admin ID missing. Please login.");
//                 navigate("/admin-login");
//                 return;
//             }

//             const [customersData, stateData, genderData, ageData, statsData] = await Promise.all([
//                 axios.get("http://localhost:8080/churned-customers", { headers: { "admin-id": adminId }, withCredentials: true }),
//                 axios.get("http://localhost:8080/churned-state", { headers: { "admin-id": adminId }, withCredentials: true }),
//                 axios.get("http://localhost:8080/churned-gender", { headers: { "admin-id": adminId }, withCredentials: true }),
//                 axios.get("http://localhost:8080/churned-age", { headers: { "admin-id": adminId }, withCredentials: true }),
//                 axios.get("http://localhost:8080/churn-stats")
//             ]);

//             console.log("Churn Stats Data:", statsData.data); // Log this data to verify the structure
//             setCustomers(customersData.data);
//             setChurnByState(stateData.data);
//             setChurnByGender(genderData.data.map(g => ({ gender: g.gender, customer_count: parseInt(g.customer_count, 10) })));
//             setChurnByAge(ageData.data.map(a => ({ ageRange: a.ageRange, churnPercentage: parseFloat(a.churnPercentage) })));
//             setChurnStats(statsData.data);
//         } catch (error) {
//             setError("Error fetching data. Please try again later.");
//         } finally {
//             setLoading(false);
//         }
//     };
//     const aggregatedData = data.reduce((acc, item) => {
//         // Check if the state already exists
//         if (!acc[item.state]) {
//             acc[item.state] = {
//                 totalPurchases: 0,
//                 count: 0,
//                 customers: [],
//             };
//         }

//         // Aggregate the data
//         acc[item.state].totalPurchases += item.total;
//         acc[item.state].count += 1;
//         acc[item.state].customers.push(item);

//         return acc;
//     }, {});

//     console.log(aggregatedData);

//     const highRiskCustomers = data.filter(item => item.high_risk === 1);
//     console.log(highRiskCustomers);

//     // Pagination handling for churned customers
//     const handlePageChange = (newPage) => {
//         setPagination({ ...pagination, page: newPage });
//     };

//     return (
//         <Container className="mt-4">
//             <h2 className="text-center mb-4">📊 Admin Dashboard - Customer Churn Analytics</h2>

//             {error && <Alert variant="danger">{error}</Alert>}

//             <div className="d-flex justify-content-center mb-3">
//                 <Button variant="primary" onClick={fetchCustomerData} disabled={loading}>
//                     {loading ? <Spinner size="sm" animation="border" /> : "Refresh Data"}
//                 </Button>
//             </div>

//             {/* Dashboard Overview */}
//             <Row>
//                 <Col md={12}>
//                     <Card className="shadow mb-4">
//                         <Card.Body>
//                             <Card.Title>Dashboard Overview</Card.Title>
//                             <div className="d-flex justify-content-between">
//                                 <div>
//                                     <h5>Total Customers: {totalCustomers}</h5>
//                                     <h5>Churned Customers: {churnedCustomers}</h5>
//                                     <h5>Active Customers: {activeCount >= 0 ? activeCount : 0}</h5>
//                                 </div>
//                                 <div>
//                                     <h5>High Risk Churn: {churnStats?.high_risk || "N/A"}</h5>
//                                     <h5>Medium Risk Churn: {churnStats?.medium_risk || "N/A"}</h5>
//                                     <h5>Low Risk Churn: {churnStats?.low_risk || "N/A"}</h5>
//                                 </div>
//                             </div>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* Churn Analytics Charts */}
//             <Row>
//                 <Col md={6}>
//                     <Card className="shadow">
//                         <Card.Body>
//                             <Card.Title>Customer Churn Statistics</Card.Title>
//                             <ResponsiveContainer width="100%" height={360}>
//                                 <PieChart>
//                                     <Pie
//                                         data={pieData}
//                                         cx="50%"
//                                         cy="50%"
//                                         outerRadius={100}
//                                         dataKey="value"
//                                         label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                                     >
//                                         {pieData.map((entry, index) => (
//                                             <Cell key={`cell-${index}`} fill={entry.color} />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip />
//                                     <Legend />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>

//                 <Col md={6}>
//                     <Card className="shadow">
//                         <Card.Body>
//                             <Card.Title>Churn by State</Card.Title>
//                             <ResponsiveContainer width="100%" height={360}>
//                                 <BarChart data={churnByState}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="state" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="customer_count" fill={COLORS.state}>
//                                         <LabelList dataKey="customer_count" position="top" />
//                                     </Bar>
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>

//                 <Col md={6}>
//                     <Card>
//                         <Card.Body>
//                             <Card.Title>Churn by Gender</Card.Title>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <PieChart>
//                                     <Pie data={churnByGender} cx="50%" cy="50%" outerRadius={100} dataKey="customer_count" nameKey="gender">
//                                         {churnByGender.map((entry, index) => (
//                                             <Cell key={`cell-${index}`} fill={COLORS.gender[index % COLORS.gender.length]} />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip />
//                                     <Legend />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>

//                 <Col md={6}>
//                     <Card>
//                         <Card.Body>
//                             <Card.Title>Churn by Age</Card.Title>
//                             {churnByAge.length > 0 ? (
//                                 <ResponsiveContainer width="100%" height={360}>
//                                     <BarChart data={churnByAge}>
//                                         <CartesianGrid strokeDasharray="3 3" />
//                                         <XAxis dataKey="ageRange" />
//                                         <YAxis />
//                                         <Tooltip />
//                                         <Legend />
//                                         <Bar dataKey="churnPercentage" fill="#FFCE56">
//                                             <LabelList dataKey="churnPercentage" position="top" />
//                                         </Bar>
//                                     </BarChart>
//                                 </ResponsiveContainer>
//                             ) : (
//                                 <p>No data available</p>
//                             )}
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* Churned Customers Table */}
//             <h3 className="mt-4">Churned Customers</h3>
//             {churnStats && churnStats.length > 0 ? (
//                 <Table striped bordered hover>
//                     <thead>
//                         <tr>
                                
//                             <th>State</th>
//                             <th>Gender</th>
//                             <th>Age</th>
//                             <th>Total Purchases</th>
//                             <th>High Risk</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {churnStats ? churnStats.map((row, index) => (
//                             <tr>
//                                 <td>Delhi</td>
//                                 <td>Male</td>
//                                 <td>27</td>
//                                 <td>43</td>
//                                 <td>0</td>
//                             </tr>
//                         )) : (
//                             <tr>
//                                 <td colSpan="6" className="text-center">No churn data available.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </Table>

//             ) : (
//                 <p className="text-center">No churn data available.</p>
//             )}
//         </Container>
//     );
// };

// export default AdminDashboard;


import axios from "axios";
import { useState, useEffect } from "react";
import { Table, Button, Container, Spinner, Alert, Card, Row, Col } from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LabelList } from "recharts";
import { useNavigate } from "react-router-dom";

// Define colors for different categories
const COLORS = {
    churned: "#FF6384",
    active: "#4CAF50",
    state: "#FFCE56",
    gender: ["#4BC0C8", "#FF9F40", "#9966CC", "#36A2EB"],
    age: ["#E0F2F7", "#B3E5FC", "#4FC3F7", "#03A9F4", "#0288D1"],
};

const AdminDashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [churnByState, setChurnByState] = useState([]);
    const [churnByGender, setChurnByGender] = useState([]);
    const [churnByAge, setChurnByAge] = useState([]);
    const [churnStats, setChurnStats] = useState(null);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [pagination, setPagination] = useState({ page: 1, perPage: 10 });

    const navigate = useNavigate();
    const churnedCustomers = customers.length;
    const activeCount = totalCustomers - churnedCustomers;

    const pieData = [
        { name: "Churned", value: churnedCustomers, color: COLORS.churned },
        { name: "Active", value: activeCount > 0 ? activeCount : 0, color: COLORS.active }  // Ensure activeCount is always non-negative
    ];

    useEffect(() => {
        if (localStorage.getItem("isAdminAuthenticated") !== "true") {
            navigate("/admin-login");
        }
        fetchCustomerData();
        fetchTotalCustomers();
    }, []);

    useEffect(() => {
        fetchChurnByAge();
    }, []);

    // Fetch churn by age data with dynamic color rendering
    const fetchChurnByAge = async () => {
        try {
            const response = await axios.get("http://localhost:8080/churned-age", {
                headers: { "admin-id": localStorage.getItem("adminId") },
                withCredentials: true,
            });

            if (!response.data || !Array.isArray(response.data)) {
                console.error("Invalid churn by age data:", response.data);
                return;
            }

            const formattedData = response.data.map((entry, index) => ({
                ageRange: entry.ageRange || "Unknown",
                churnPercentage: isNaN(parseFloat(entry.churnPercentage)) ? 0 : parseFloat(entry.churnPercentage),
                color: COLORS.age[index % COLORS.age.length]  // Dynamic color based on index
            }));

            console.log("Churn by Age Data:", formattedData);
            setChurnByAge(formattedData);
        } catch (error) {
            console.error("Error fetching churn by age data:", error);
        }
    };

    // Fetch total customers count
    const fetchTotalCustomers = async () => {
        try {
            const { data } = await axios.get("http://localhost:8080/total-customers", {
                headers: { "admin-id": localStorage.getItem("adminId") },
                withCredentials: true,
            });
            setTotalCustomers(data.totalCustomers);
        } catch (error) {
            console.error("Error fetching total customers:", error);
        }
    };

    // Fetch customer data with churn analytics
    const fetchCustomerData = async () => {
        setLoading(true);
        setError(null);
        try {
            const adminId = localStorage.getItem("adminId");
            if (!adminId) {
                setError("Admin ID missing. Please login.");
                navigate("/admin-login");
                return;
            }

            const [customersData, stateData, genderData, ageData, statsData] = await Promise.all([
                axios.get("http://localhost:8080/churned-customers", { headers: { "admin-id": adminId }, withCredentials: true }),
                axios.get("http://localhost:8080/churned-state", { headers: { "admin-id": adminId }, withCredentials: true }),
                axios.get("http://localhost:8080/churned-gender", { headers: { "admin-id": adminId }, withCredentials: true }),
                axios.get("http://localhost:8080/churned-age", { headers: { "admin-id": adminId }, withCredentials: true }),
                axios.get("http://localhost:8080/churn-stats")
            ]);

            console.log("Churn Stats Data:", statsData.data); // Log this data to verify the structure
            setCustomers(customersData.data);
            setChurnByState(stateData.data);
            setChurnByGender(genderData.data.map(g => ({ gender: g.gender, customer_count: parseInt(g.customer_count, 10) })));
            setChurnByAge(ageData.data.map(a => ({ ageRange: a.ageRange, churnPercentage: parseFloat(a.churnPercentage) })));
            setChurnStats(statsData.data);
        } catch (error) {
            setError("Error fetching data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const aggregatedData = customers.reduce((acc, item) => {
        if (!acc[item.state]) {
            acc[item.state] = {
                totalPurchases: 0,
                count: 0,
                customers: [],
            };
        }
        acc[item.state].totalPurchases += item.total;
        acc[item.state].count += 1;
        acc[item.state].customers.push(item);

        return acc;
    }, {});

    console.log(aggregatedData);

    const highRiskCustomers = customers.filter(item => item.high_risk === 1);
    console.log(highRiskCustomers);

    // Pagination handling for churned customers
    const handlePageChange = (newPage) => {
        setPagination({ ...pagination, page: newPage });
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">📊 Admin Dashboard - Customer Churn Analytics</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="d-flex justify-content-center mb-3">
                <Button variant="primary" onClick={fetchCustomerData} disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : "Refresh Data"}
                </Button>
            </div>

            {/* Dashboard Overview */}
            <Row>
                <Col md={12}>
                    <Card className="shadow mb-4">
                        <Card.Body>
                            <Card.Title>Dashboard Overview</Card.Title>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h5>Total Customers: {totalCustomers}</h5>
                                    <h5>Churned Customers: {churnedCustomers}</h5>
                                    <h5>Active Customers: {activeCount >= 0 ? activeCount : 0}</h5>
                                </div>
                                <div>
                                    <h5>High Risk Churn: {churnStats?.high_risk || "N/A"}</h5>
                                    <h5>Medium Risk Churn: {churnStats?.medium_risk || "N/A"}</h5>
                                    <h5>Low Risk Churn: {churnStats?.low_risk || "N/A"}</h5>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Churn Analytics Charts */}
            <Row>
                <Col md={6}>
                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title>Customer Churn Statistics</Card.Title>
                            <ResponsiveContainer width="100%" height={360}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title>Churn by State</Card.Title>
                            <ResponsiveContainer width="100%" height={360}>
                                <BarChart data={churnByState}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="state" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="customer_count" fill={COLORS.state}>
                                        <LabelList dataKey="customer_count" position="top" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Churn by Gender</Card.Title>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={churnByGender} cx="50%" cy="50%" outerRadius={100} dataKey="customer_count" nameKey="gender">
                                        {churnByGender.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS.gender[index % COLORS.gender.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Churn by Age</Card.Title>
                            {churnByAge.length > 0 ? (
                                <ResponsiveContainer width="100%" height={360}>
                                    <BarChart data={churnByAge}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="ageRange" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="churnPercentage" fill="#FFCE56">
                                            <LabelList dataKey="churnPercentage" position="top" />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p>No data available</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Churned Customers Table */}
            <h3 className="mt-4">Churned Customers</h3>
            {churnStats && churnStats.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>State</th>
                            <th>Gender</th>
                            <th>Age</th>
                            <th>Total Purchases</th>
                            <th>High Risk</th>
                        </tr>
                    </thead>
                    <tbody>
                        {churnStats ? churnStats.map((row, index) => (
                            <tr key={index}>
                                <td>Delhi</td>
                                <td>Male</td>
                                <td>27</td>
                                <td>43</td>
                                <td>0</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center">No
                                churn data available.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>

            ) : (
                <p className="text-center">No churn data available.</p>
            )}
        </Container>
    );
};

export default AdminDashboard;