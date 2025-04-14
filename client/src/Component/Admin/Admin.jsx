import { FiActivity, FiDownload, FiRefreshCw, FiInfo } from "react-icons/fi";
import axios from "axios";
import { useState, useEffect } from "react";
import {
    Table, Button, Container, Spinner, Alert,
    Row, Col, Badge, ProgressBar, ButtonGroup, OverlayTrigger, Tooltip as BootstrapTooltip
} from "react-bootstrap";
import {
    PieChart, Pie, Cell, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LabelList, LineChart, Line
} from "recharts";
import { useNavigate, useParams } from "react-router-dom";
import Card from 'react-bootstrap/Card';

// Color scheme for charts
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

// Custom tooltip components
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="custom-tooltip p-2" style={{
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <p className="label mb-1"><strong>{label}</strong></p>
            {payload.map((entry, index) => (
                <p key={`tooltip-${index}`} style={{ color: entry.color }}>
                    {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
                </p>
            ))}
        </div>
    );
};

const StateChurnTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="custom-tooltip p-2" style={{
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <p className="label mb-1"><strong>State: {label}</strong></p>
            <p>Churn Probability: {payload[0].value.toFixed(2)}%</p>
            <p>Customer Count: {payload[0].payload.customer_count}</p>
        </div>
    );
};

const AgeChurnTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="custom-tooltip p-2" style={{
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <p className="label mb-1"><strong>Age Range: {label}</strong></p>
            <p>Churn Percentage: {payload[0].value.toFixed(2)}%</p>
        </div>
    );
};

// const TrendTooltip = ({ active, payload, label }) => {
//     if (!active || !payload || !payload.length) return null;

//     return (
//         <div className="custom-tooltip p-2" style={{
//             backgroundColor: '#fff',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//         }}>
//             <p className="label mb-1"><strong>Month: {label}</strong></p>
//             <p>Churn Rate: {payload[0].value.toFixed(2)}%</p>
//         </div>
//     );
// };
const TrendTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="custom-tooltip p-2" style={{
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <p className="label mb-1"><strong>Month: {label}</strong></p>
            <p>Actual Churn: {payload[0].value.toFixed(2)}%</p>
            <p>High Risk Customers: {payload[0].payload.absoluteValues.high}</p>
            <p>Medium Risk Customers: {payload[0].payload.absoluteValues.medium}</p>
            <p>Low Risk Customers: {payload[0].payload.absoluteValues.low}</p>
            <p>Total Customers: {payload[0].payload.absoluteValues.total}</p>
        </div>
    );
};

const FeatureImportanceTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="custom-tooltip p-2" style={{
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <p className="label mb-1"><strong>Feature: {label}</strong></p>
            <p>Importance: {payload[0].value.toFixed(4)}</p>
        </div>
    );
};
const apiBaseUrl = "http://localhost:8080";

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        customers: [],
        churnByState: [],
        churnByGender: [],
        churnByAge: [],
        riskStats: {
            high_risk: 0,
            medium_risk: 0,
            low_risk: 0,
            not_assessed: 0,
            total_customers: 0
        },
        totalCustomers: 0,
        activeCount: 0,
        churnTrends: [],
        highRiskCustomers: [],
        customerSegments: [],
        retentionRate: 0,
        featureImportance: [],
        churnExplanation: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastRefreshed, setLastRefreshed] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    const axiosConfig = {
        headers: {
            "admin-id": localStorage.getItem("adminId"),
            "Content-Type": "application/json"
        },
        withCredentials: true
    };

    // Data formatting functions
    const formatStateData = (data) => {
        if (!data) return [];
        try {
            return Array.isArray(data)
                ? data.map(item => ({
                    state: item.state || item.name || 'Unknown',
                    customer_count: Number(item.customer_count || item.count || 0),
                    churn_probability: Number(item.churn_probability || item.value || 0)
                }))
                : [];
        } catch (e) {
            console.error("Error formatting state data:", e);
            return [];
        }
    };
    const [churnByStateData, setChurnByStateData] = useState([]);
    const [churnByGenderData, setChurnByGenderData] = useState([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/churn-state`)
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Server responded with ${res.status}: ${text}`);
                }
                return res.json();
            })
            .then((data) => {
                const cleaned = data.map(item => ({
                    ...item,
                    churn_probability_mean: parseFloat(item.churn_probability_mean || 0),
                }));
                setChurnByStateData(cleaned);
            })
            .catch((err) => console.error("Error loading churn by state:", err));
    }, []);
    useEffect(() => {
        fetch(`${apiBaseUrl}/churn-gender`)
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Server responded with ${res.status}: ${text}`);
                }
                return res.json();
            })
            .then((data) => {
                const cleaned = data.map(item => ({
                    ...item,
                    churn_probability_mean: parseFloat(item.churn_probability_mean || 0),
                }));
                setChurnByGenderData(cleaned);
            })
            .catch((err) => console.error("Error loading churn by gender:", err));
    }, []);




    const formatGenderData = (data) => {
        if (!data) return [];
        try {
            return Array.isArray(data)
                ? data.map(g => ({
                    gender: g.gender || 'Unknown',
                    customer_count: parseInt(g.customer_count || g.count || 0, 10),
                    churn_probability: parseFloat(g.churn_probability || g.value || 0)
                }))
                : [];
        } catch (e) {
            console.error("Error formatting gender data:", e);
            return [];
        }
    };

    const formatAgeData = (data) => {
        if (!data) return [];
        try {
            return Array.isArray(data)
                ? data.map((entry, index) => {
                    const ageRange = entry.age_group || entry.ageRange || entry.name || "Unknown";
                    const churnRaw = entry.churn_mean ?? entry.churn_probability ?? entry.value ?? 0;
                    const churnPercentage = parseFloat(churnRaw) * 100;

                    return {
                        ageRange,
                        churnPercentage: isNaN(churnPercentage) ? 0 : parseFloat(churnPercentage.toFixed(2)),
                        color: COLORS.age[index % COLORS.age.length],
                    };
                })
                : [];
        } catch (e) {
            console.error("Error formatting age data:", e);
            return [];
        }
    };


    const formatDate = (dateString) => {
        const [year, month] = dateString.split("-");
        return new Date(year, month - 1).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });
    };


    const formatTrendData = (data) => {
        if (!data || !data.labels || !data.risk_breakdown || !data.total_customers) return [];

        const { labels, risk_breakdown, total_customers } = data;

        return labels.map((month, idx) => {
            const high = risk_breakdown["High Risk"]?.[idx] || 0;
            const med = risk_breakdown["Medium Risk"]?.[idx] || 0;
            const low = risk_breakdown["Low Risk"]?.[idx] || 0;
            const total = total_customers?.[idx] || 1;

            // Calculate percentages (making sure we don't divide by zero)
            const safeTotal = total > 0 ? total : 1;

            return {
                month: formatDate(month),
                // Only show actual churn percentage (not all risk-assessed customers)
                churnedPercentage: ((high * 0.7 + med * 0.4 + low * 0.1) / safeTotal * 100),
                highRiskPercentage: (high / safeTotal) * 100,
                mediumRiskPercentage: (med / safeTotal) * 100,
                lowRiskPercentage: (low / safeTotal) * 100,
                absoluteValues: {
                    high,
                    medium: med,
                    low,
                    total
                }
            };
        });
    };


    // const formatSegmentData = (data) => {
    //     if (!data) return [];
    //     try {
    //         return Array.isArray(data)
    //             ? data
    //             : Object.entries(data).map(([segment, count]) => ({
    //                 segment,
    //                 count: Number(count) || 0
    //             }));
    //     } catch (e) {
    //         console.error("Error formatting segment data:", e);
    //         return [];
    //     }
    // };
    const formatSegmentData = (data) => {
        if (!data) return [];

        // Case 1: If 'segment_counts' exists (ideal)
        if (data.segment_counts && typeof data.segment_counts === 'object') {
            return Object.entries(data.segment_counts).map(([segment, count]) => ({
                segment,
                count: Number(count) || 0
            }));
        }

        // Case 2: If only 'segments' array exists — group by segment
        if (Array.isArray(data.segments)) {
            const grouped = {};
            data.segments.forEach(({ segment, user_id_count }) => {
                if (!segment) return;
                grouped[segment] = (grouped[segment] || 0) + (user_id_count || 0);
            });

            return Object.entries(grouped).map(([segment, count]) => ({
                segment,
                count
            }));
        }

        return [];
    };

    const formatRetentionRate = (data) => {
        if (!data) return 0;
        try {
            return typeof data === 'object'
                ? parseFloat(data?.retention_rate || data?.retentionRate || 0)
                : parseFloat(data || 0);
        } catch (e) {
            console.error("Error formatting retention rate:", e);
            return 0;
        }
    };

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            const endpoints = [
                `${apiBaseUrl}/total-customers`,
                `${apiBaseUrl}/churned-customers`,
                `${apiBaseUrl}/churn-state`,
                `${apiBaseUrl}/churn-gender`,
                `${apiBaseUrl}/churn-age`,
                `${apiBaseUrl}/churn-stats`,
                `${apiBaseUrl}/churn-trends`,
                `${apiBaseUrl}/high-risk-customers`,
                `${apiBaseUrl}/customer-segments`,
                `${apiBaseUrl}/retention-rate`,
            ];

            if (id) {
                endpoints.push(`${apiBaseUrl}/churn-explanation/${id}`);
            }

            const responses = await Promise.all(
                endpoints.map(endpoint => axios.get(endpoint, axiosConfig))
            );

            const formattedData = {
                totalCustomers: responses[0]?.data?.total_customers || 0,
                activeCount: responses[0]?.data?.active_customers || 0,
                customers: responses[1]?.data?.customers || [],
                churnByState: formatStateData(responses[2]?.data),
                churnByGender: formatGenderData(responses[3]?.data),
                churnByAge: formatAgeData(responses[4]?.data),
                riskStats: {
                    high_risk: responses[5]?.data?.risk_distribution?.high_risk || 0,
                    medium_risk: responses[5]?.data?.risk_distribution?.medium_risk || 0,
                    low_risk: responses[5]?.data?.risk_distribution?.low_risk || 0,
                    not_assessed: responses[5]?.data?.risk_distribution?.not_assessed || 0,
                    total_customers: responses[0]?.data?.total_customers || 0
                },
                churnTrends: formatTrendData(responses[6]?.data),
                highRiskCustomers: responses[7]?.data?.customers || [],
                customerSegments: formatSegmentData(responses[8]?.data),
                retentionRate: formatRetentionRate(responses[9]?.data),
                churnExplanation: id ? responses[10]?.data?.explanation || [] : []
            };

            setDashboardData(formattedData);
            setLastRefreshed(new Date());
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError("Failed to load dashboard data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const exportData = async (format) => {
        try {
            if (!["csv", "json"].includes(format)) {
                throw new Error("Unsupported export format");
            }

            const response = await axios.get(`${apiBaseUrl}/export`, {
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
            a.download = `customer_churn_data.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error exporting data:", error);
            setError("Failed to export data. Please try again.");
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("isAdminAuthenticated")) {
            navigate("/admin-login");
            return;
        }
        fetchAllData();
    }, [navigate, id]);

    // Chart data preparation
    const pieData = [
        { name: "Churned", value: dashboardData.customers.length || 0, color: COLORS.churned },
        { name: "Active", value: dashboardData.activeCount || 0, color: COLORS.active },
    ].filter(entry => entry.value > 0);

    const riskData = [
        { name: "High Risk", value: dashboardData.riskStats.high_risk || 0, color: COLORS.highRisk },
        { name: "Medium Risk", value: dashboardData.riskStats.medium_risk || 0, color: COLORS.mediumRisk },
        { name: "Low Risk", value: dashboardData.riskStats.low_risk || 0, color: COLORS.lowRisk },
    ].filter(item => item.value > 0);

    return (
        <Container fluid className="py-4">
            {/* Header Section */}
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="mb-0">
                            <FiActivity className="me-2" />
                            Customer Churn Analytics Dashboard
                        </h2>
                        <div className="d-flex align-items-center">
                            <Button
                                variant="outline-primary"
                                onClick={fetchAllData}
                                disabled={loading}
                                className="me-2"
                            >
                                <FiRefreshCw className={loading ? "spin" : ""} />
                                {loading ? " Refreshing..." : " Refresh Data"}
                            </Button>
                            {lastRefreshed && (
                                <small className="text-muted">
                                    Last updated: {lastRefreshed.toLocaleString()}
                                </small>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Loading and Error States */}
            {loading && (
                <Row className="mb-4">
                    <Col>
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" size="lg" />
                            <h5 className="mt-3">Loading Dashboard Data...</h5>
                        </div>
                    </Col>
                </Row>
            )}

            {error && (
                <Row className="mb-4">
                    <Col>
                        <Alert variant="danger" onClose={() => setError(null)} dismissible>
                            {error}
                        </Alert>
                    </Col>
                </Row>
            )}

            {/* Dashboard Overview Cards */}
            {!loading && (
                <>
                    <Row className="g-4 mb-4">
                        <Col md={3}>
                            <Card className="h-100 shadow-sm border-primary">
                                <Card.Body>
                                    <Card.Title className="d-flex justify-content-between align-items-center">
                                        <span>Total Customers</span>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<BootstrapTooltip>Total number of customers in the system</BootstrapTooltip>}
                                        >
                                            <span><FiInfo className="text-muted" /></span>
                                        </OverlayTrigger>
                                    </Card.Title>
                                    <h2 className="display-6">{dashboardData.totalCustomers.toLocaleString()}</h2>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3}>
                            <Card className="h-100 shadow-sm border-success">
                                <Card.Body>
                                    <Card.Title className="d-flex justify-content-between align-items-center">
                                        <span>Active Customers</span>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<BootstrapTooltip>Customers active in the last 30 days</BootstrapTooltip>}
                                        >
                                            <span><FiInfo className="text-muted" /></span>
                                        </OverlayTrigger>
                                    </Card.Title>
                                    <h2 className="display-6">{dashboardData.activeCount.toLocaleString()}</h2>
                                    <small className="text-muted">
                                        {dashboardData.totalCustomers > 0
                                            ? `${((dashboardData.activeCount / dashboardData.totalCustomers) * 100).toFixed(1)}% of total`
                                            : 'No customers'}
                                    </small>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3}>
                            <Card className="h-100 shadow-sm border-warning">
                                <Card.Body>
                                    <Card.Title className="d-flex justify-content-between align-items-center">
                                        <span>Churned Customers</span>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<BootstrapTooltip>Customers who have churned</BootstrapTooltip>}
                                        >
                                            <span><FiInfo className="text-muted" /></span>
                                        </OverlayTrigger>
                                    </Card.Title>
                                    <h2 className="display-6">{dashboardData.customers.length.toLocaleString()}</h2>
                                    <small className="text-muted">
                                        {dashboardData.totalCustomers > 0
                                            ? `${((dashboardData.customers.length / dashboardData.totalCustomers) * 100).toFixed(1)}% of total`
                                            : 'No customers'}
                                    </small>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3}>
                            <Card className="h-100 shadow-sm border-info">
                                <Card.Body>
                                    <Card.Title className="d-flex justify-content-between align-items-center">
                                        <span>Retention Rate</span>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<BootstrapTooltip>Percentage of customers retained</BootstrapTooltip>}
                                        >
                                            <span><FiInfo className="text-muted" /></span>
                                        </OverlayTrigger>
                                    </Card.Title>
                                    <h2 className="display-6">{dashboardData.retentionRate.toFixed(1)}%</h2>
                                    <ProgressBar
                                        now={dashboardData.retentionRate}
                                        variant={
                                            dashboardData.retentionRate > 70 ? "success" :
                                                dashboardData.retentionRate > 40 ? "warning" : "danger"
                                        }
                                        className="mt-2"
                                    />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Churn Explanation Section (if user ID is provided) */}
                    {id && dashboardData.churnExplanation.length > 0 && (
                        <Row className="mb-4">
                            <Col md={12}>
                                <Card className="shadow">
                                    <Card.Body>
                                        <Card.Title className="d-flex justify-content-between align-items-center">
                                            <span>Churn Explanation for User ID: {id}</span>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<BootstrapTooltip>Reasons why this customer is likely to churn</BootstrapTooltip>}
                                            >
                                                <span><FiInfo className="text-muted" /></span>
                                            </OverlayTrigger>
                                        </Card.Title>
                                        <ul className="list-group">
                                            {dashboardData.churnExplanation.map((reason, index) => (
                                                <li key={index} className="list-group-item">
                                                    {reason}
                                                </li>
                                            ))}
                                        </ul>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}

                    {/* Risk Distribution Section */}
                    <Row className="g-4 mb-4">
                        <Col md={6}>
                            <Card className="h-100 shadow">
                                <Card.Body>
                                    <Card.Title className="d-flex justify-content-between align-items-center">
                                        <span>Customer Risk Distribution</span>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<BootstrapTooltip>Breakdown of customers by churn risk level</BootstrapTooltip>}
                                        >
                                            <span><FiInfo className="text-muted" /></span>
                                        </OverlayTrigger>
                                    </Card.Title>
                                    <ResponsiveContainer width="100%" height={300}>
                                        {riskData.length > 0 ? (
                                            <BarChart data={riskData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend />
                                                <Bar dataKey="value" name="Customers">
                                                    {riskData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                    <LabelList
                                                        dataKey="value"
                                                        position="top"
                                                        formatter={(value) => value.toLocaleString()}
                                                    />
                                                </Bar>
                                            </BarChart>
                                        ) : (
                                            <div className="text-center py-5">
                                                <p>No risk distribution data available</p>
                                                <Button size="sm" onClick={fetchAllData}>
                                                    Retry
                                                </Button>
                                            </div>
                                        )}
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Card className="h-100 shadow">
                                <Card.Body>
                                    <Card.Title className="d-flex justify-content-between align-items-center">
                                        <span>Customer Status</span>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<BootstrapTooltip>Active vs Churned customer distribution</BootstrapTooltip>}
                                        >
                                            <span><FiInfo className="text-muted" /></span>
                                        </OverlayTrigger>
                                    </Card.Title>
                                    <ResponsiveContainer width="100%" height={300}>
                                        {pieData.length > 0 ? (
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    innerRadius={60}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend />
                                            </PieChart>
                                        ) : (
                                            <div className="text-center py-5">
                                                <p>No customer status data available</p>
                                                <Button size="sm" onClick={fetchAllData}>
                                                    Retry
                                                </Button>
                                            </div>
                                        )}
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Churn Analysis Section */}
                    <Row className="g-4 mb-4">
                        <Col md={6}>
                            {/* <Card className="h-100 shadow">
                                <Card.Body>
                                    <Card.Title className="d-flex justify-content-between align-items-center">
                                        <span>Churn by State</span>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<BootstrapTooltip>Churn probability by customer state</BootstrapTooltip>}
                                        >
                                            <span><FiInfo className="text-muted" /></span>
                                        </OverlayTrigger>
                                    </Card.Title>
                                    <ResponsiveContainer width="100%" height={300}>
                                        {dashboardData.churnByState.length > 0 ? (
                                            <BarChart data={dashboardData.churnByState}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="state" />
                                                <YAxis />
                                                <Tooltip content={<StateChurnTooltip />} />
                                                <Legend />
                                                <Bar dataKey="churn_probability" name="Churn Probability" fill="#FFCE56">
                                                    <LabelList
                                                        dataKey="churn_probability"
                                                        position="top"
                                                        formatter={(value) => `${value.toFixed(1)}%`}
                                                    />
                                                </Bar>
                                            </BarChart>
                                        ) : (
                                            <div className="text-center py-5">
                                                <p>No state churn data available</p>
                                                <Button size="sm" onClick={fetchAllData}>
                                                    Retry
                                                </Button>
                                            </div>
                                        )}
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card> */}
                            {/* Churn by State Chart */}
                            <Card className="mb-3 shadow">
                                <Card.Header className="bg-primary text-white">
                                    Churn Breakdown by State
                                </Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        Visual representation of churn statistics across Indian states.
                                    </Card.Text>

                                    {/* Example chart or table goes here */}
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={churnByStateData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="state_" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="churn_probability_mean" fill="#8884d8">
                                                <LabelList dataKey="churn_probability_mean" position="top" />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>

                        </Col>
                        <Col md={6}>
                            <Card className="shadow-sm mb-4">
                                <Card.Header>
                                    <span className="fw-semibold">Churn by Gender</span>
                                    <OverlayTrigger overlay={<Tooltip>Churn rate based on gender.</Tooltip>}>
                                        <i className="bi bi-info-circle ms-2" />
                                    </OverlayTrigger>
                                </Card.Header>
                                <Card.Body>
                                    {churnByGenderData.length === 0 ? (
                                        <p>Loading...</p>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    dataKey="user_id_count"
                                                    data={churnByGenderData}
                                                    nameKey="gender_" // 🔥 FIXED: Matches your backend data
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    label
                                                >
                                                    {churnByGenderData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS.gender[index % COLORS.gender.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                    </Row>

                    {/* Additional Analysis Section */}
                    <Row className="g-4 mb-4">
                        <Col md={6}>
                            <Card className="h-100 shadow">
                                <Card.Body>
                                    <Card.Title className="d-flex justify-content-between align-items-center">
                                        <span>Churn by Age Group</span>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<BootstrapTooltip>Churn percentage by customer age groups</BootstrapTooltip>}
                                        >
                                            <span><FiInfo className="text-muted" /></span>
                                        </OverlayTrigger>
                                    </Card.Title>
                                    <ResponsiveContainer width="100%" height={300}>
                                        {dashboardData.churnByAge.length > 0 ? (
                                            <BarChart data={dashboardData.churnByAge}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="ageRange" />
                                                <YAxis />
                                                <Tooltip content={<AgeChurnTooltip />} />
                                                <Legend />
                                                <Bar dataKey="churnPercentage" name="Churn Percentage">
                                                    {dashboardData.churnByAge.map((entry, index) => (
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
                                                <p>No age churn data available</p>
                                                <Button size="sm" onClick={fetchAllData}>
                                                    Retry
                                                </Button>
                                            </div>
                                        )}
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>


                        <Col md={6}>

                            <Card className="h-100 shadow">
                                <Card.Body>
                                    <Card.Title className="d-flex justify-content-between align-items-center">
                                        <span>Churn Trends Over Time</span>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<BootstrapTooltip>Monthly churn rate trends</BootstrapTooltip>}
                                        >
                                            <span><FiInfo className="text-muted" /></span>
                                        </OverlayTrigger>
                                    </Card.Title>
                                    <ResponsiveContainer width="100%" height={300}>
                                        {dashboardData.churnTrends.length > 0 ? (
                                            <LineChart
                                                data={dashboardData.churnTrends}
                                                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                <XAxis
                                                    dataKey="month"
                                                    tick={{ fill: '#666' }}
                                                    tickMargin={10}
                                                />
                                                <YAxis
                                                    domain={[0, 100]}
                                                    tick={{ fill: '#666' }}
                                                    tickFormatter={(value) => `${value}%`}
                                                    label={{
                                                        value: 'Churn %',
                                                        angle: -90,
                                                        position: 'insideLeft',
                                                        style: { textAnchor: 'middle', fill: '#666' }
                                                    }}
                                                />
                                                <Tooltip
                                                    content={<TrendTooltip />}
                                                    wrapperStyle={{
                                                        backgroundColor: '#fff',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                        padding: '10px'
                                                    }}
                                                />
                                                <Legend
                                                    wrapperStyle={{
                                                        paddingTop: '20px',
                                                        paddingBottom: '10px'
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="churnedPercentage"
                                                    name="Actual Churn"
                                                    stroke="#FF6384"
                                                    strokeWidth={2}
                                                    activeDot={{ r: 8 }}
                                                    dot={{ r: 4 }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="highRiskPercentage"
                                                    name="High Risk %"
                                                    stroke="#DC2626"
                                                    strokeWidth={2}
                                                    dot={{ r: 4 }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="mediumRiskPercentage"
                                                    name="Medium Risk %"
                                                    stroke="#F59E0B"
                                                    strokeWidth={2}
                                                    dot={{ r: 4 }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="lowRiskPercentage"
                                                    name="Low Risk %"
                                                    stroke="#16A34A"
                                                    strokeWidth={2}
                                                    dot={{ r: 4 }}
                                                />
                                            </LineChart>
                                        ) : (
                                            <div className="text-center py-5">
                                                <p>No trend data available</p>
                                                <Button size="sm" onClick={fetchAllData}>
                                                    Retry
                                                </Button>
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
                            <Card className="shadow">
                                <Card.Body>
                                    <Card.Title className="d-flex justify-content-between align-items-center">
                                        <span>Customer Segmentation</span>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<BootstrapTooltip>Distribution of customers by segments</BootstrapTooltip>}
                                        >
                                            <span><FiInfo className="text-muted" /></span>
                                        </OverlayTrigger>
                                    </Card.Title>
                                    <ResponsiveContainer width="100%" height={400}>
                                        {dashboardData.customerSegments.length > 0 ? (
                                            <PieChart>
                                                <Pie
                                                    data={dashboardData.customerSegments}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={120}
                                                    innerRadius={70}
                                                    paddingAngle={5}
                                                    dataKey="count"
                                                    nameKey="segment"
                                                    label={({ segment, percent }) => `${segment}: ${(percent * 100).toFixed(1)}%`}
                                                >
                                                    {dashboardData.customerSegments.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={COLORS[entry.segment?.toLowerCase().replace(/\s+/g, '_')] || `hsl(${index * 72}, 70%, 50%)`}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend />
                                            </PieChart>
                                        ) : (
                                            <div className="text-center py-5">
                                                <p>No segmentation data available</p>
                                                <Button size="sm" onClick={fetchAllData}>
                                                    Retry
                                                </Button>
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
                                        <span>High-Risk Customers ({dashboardData.highRiskCustomers.length})</span>
                                        <ButtonGroup>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => exportData("csv")}
                                                disabled={dashboardData.highRiskCustomers.length === 0}
                                            >
                                                <FiDownload className="me-1" /> Export CSV
                                            </Button>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => exportData("json")}
                                                disabled={dashboardData.highRiskCustomers.length === 0}
                                            >
                                                <FiDownload className="me-1" /> Export JSON
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
                                                {dashboardData.highRiskCustomers.length > 0 ? (
                                                    dashboardData.highRiskCustomers.map((customer, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{customer.name || customer.user_name || 'N/A'}</td>
                                                            <td>{customer.email || customer.user_email || 'N/A'}</td>
                                                            <td>{customer.state || 'N/A'}</td>
                                                            <td>{customer.gender || 'N/A'}</td>
                                                            <td>{customer.age || 'N/A'}</td>
                                                            <td>
                                                                <Badge
                                                                    bg={
                                                                        customer.churn_probability >= 0.7 ? 'danger' :
                                                                            customer.churn_probability >= 0.5 ? 'warning' : 'primary'
                                                                    }
                                                                >
                                                                    {customer.churn_probability ?
                                                                        `${(customer.churn_probability * 100).toFixed(1)}%` :
                                                                        'N/A'}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7" className="text-center py-4">
                                                            <p>No high-risk customers found</p>
                                                            <Button size="sm" onClick={fetchAllData}>
                                                                Refresh Data
                                                            </Button>
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
                                        <span>Churned Customers ({dashboardData.customers.length})</span>
                                        <ButtonGroup>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => exportData("csv")}
                                                disabled={dashboardData.customers.length === 0}
                                            >
                                                <FiDownload className="me-1" /> Export CSV
                                            </Button>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => exportData("json")}
                                                disabled={dashboardData.customers.length === 0}
                                            >
                                                <FiDownload className="me-1" /> Export JSON
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
                                                {dashboardData.customers.length > 0 ? (
                                                    dashboardData.customers.map((customer, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{customer.name || customer.user_name || 'N/A'}</td>
                                                            <td>{customer.email || customer.user_email || 'N/A'}</td>
                                                            <td>{customer.state || 'N/A'}</td>
                                                            <td>{customer.gender || 'N/A'}</td>
                                                            <td>{customer.age || 'N/A'}</td>
                                                            <td>
                                                                {customer.last_login_date ?
                                                                    new Date(customer.last_login_date).toLocaleDateString() :
                                                                    customer.last_activity || 'N/A'}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7" className="text-center py-4">
                                                            <p>No churned customers found</p>
                                                            <Button size="sm" onClick={fetchAllData}>
                                                                Refresh Data
                                                            </Button>
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
                </>
            )}
        </Container>
    );
};

export default AdminDashboard;