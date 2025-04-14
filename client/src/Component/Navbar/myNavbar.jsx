// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import logo from "../../assets/logo.jpg";
// import { Navbar, Nav, Container, Button } from 'react-bootstrap';
// import './Navbar.css'; // Import a custom CSS file for better styling

// const MyNavbar = ({ handleLogout, userId }) => {
//   const [showNav, setShowNav] = useState(false);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const [navbarVisible, setNavbarVisible] = useState(true);

//   // Handle navbar visibility based on scroll
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 80) {
//         setShowNav(true);
//         if (window.scrollY > lastScrollY) {
//           setNavbarVisible(false);
//         } else {
//           setNavbarVisible(true);
//         }
//       } else {
//         setShowNav(false);
//       }           
//       setLastScrollY(window.scrollY);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [lastScrollY]);

//   return (
//     <Navbar expand="lg" className={`custom-navbar ${showNav ? 'nav-popup' : ''} ${navbarVisible ? 'visible' : 'hidden'}`}>
//       <Container fluid>
//         <Navbar.Brand as={Link} to="/" className="fs-2 fw-bold ms-auto navbar-color">
//           <img src={logo} alt="Company Logo" className="rounded-5" width={135} height={50} />
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="navbarScroll" />
//         <Navbar.Collapse id="navbarScroll">
//           <Nav className="ms-auto my-2 my-lg-0 nav-links" navbarScroll>
//             <Nav.Link as={Link} to="/home">Home</Nav.Link>
//             <Nav.Link as={Link} to="/mens">MEN's</Nav.Link>
//             <Nav.Link as={Link} to="/womens">WOMEN's</Nav.Link>
//             <Nav.Link as={Link} to="/kids">KID's</Nav.Link>
//             <Nav.Link as={Link} to="/cosmetics">COSMETICS</Nav.Link>
//             <Nav.Link as={Link} to="/accessories">ACCESSORIES</Nav.Link>
//             <Nav.Link as={Link} to="/cart"><i className="fa-solid fa-cart-shopping"></i></Nav.Link>
//             {/* <Nav.Link as={Link} to="/profile"><i className="fa-regular fa-user"></i></Nav.Link> */}

//             {userId ? (
//               <>
//                 {/* <Nav.Link as={Link} to="/cart" className="custom-button">Cart</Nav.Link> */}
//                 <Button onClick={handleLogout} className="logout-btn">Logout</Button>
//               </>
//             ) : (
//               <>
//                 <Nav.Link as={Link} to="/login" className="custom-buttn">Login</Nav.Link>
//                 <Nav.Link as={Link} to="/" className="custom-utton">Register</Nav.Link>
//               </>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default MyNavbar;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from "../../assets/logo.jpg";
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import './Navbar.css';
import axios from 'axios';

const MyNavbar = ({ handleLogout }) => {
  const [showNav, setShowNav] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [profile, setProfile] = useState(null);

  const userId = localStorage.getItem('userId');
  const adminId = localStorage.getItem('adminId');

  const baseURL = "http://localhost:8080";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowNav(true);
        setNavbarVisible(window.scrollY <= lastScrollY);
      } else {
        setShowNav(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId && !adminId) return;

        const type = userId ? 'user' : 'admin';
        const id = userId || adminId;

        const res = await axios.get(`${baseURL}/profile/${type}/${id}`);
        if (res.data && res.data.username) {
          setProfile(res.data);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [userId, adminId]);

  return (
    <Navbar expand="lg" className={`custom-navbar ${showNav ? 'nav-popup' : ''} ${navbarVisible ? 'visible' : 'hidden'}`}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fs-2 fw-bold ms-auto navbar-color">
          <img src={logo} alt="Company Logo" className="rounded-5" width={135} height={50} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto my-2 my-lg-0 nav-links d-flex align-items-center" navbarScroll>
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/mens">MEN's</Nav.Link>
            <Nav.Link as={Link} to="/womens">WOMEN's</Nav.Link>
            <Nav.Link as={Link} to="/kids">KID's</Nav.Link>
            <Nav.Link as={Link} to="/cosmetics">COSMETICS</Nav.Link>
            <Nav.Link as={Link} to="/accessories">ACCESSORIES</Nav.Link>
            <Nav.Link as={Link} to="/cart"><i className="fa-solid fa-cart-shopping"></i></Nav.Link>

            {/* Profile info on top-right */}
            {profile && (
              <div className="profile-info mx-3">
                <span className="username">{profile.username}</span>
                <span className="email">{profile.email}</span>
              </div>
            )}
            {/* Auth buttons */}
            {(userId || adminId) ? (
              <Button onClick={handleLogout} className="logout-btn">Logout</Button>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="custom-button">Login</Nav.Link>
                <Nav.Link as={Link} to="/" className="custom-button">Register</Nav.Link>
              </>

            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
