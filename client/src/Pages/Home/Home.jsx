  import React from 'react';
  import MyNavbar from '../../Component/Navbar/myNavbar';
  import { Container, Row, Col } from 'react-bootstrap';
  import './Home.css'; // Keep your CSS file
  import { useNavigate } from 'react-router-dom';

  const Home = () => {
    const navigate=useNavigate()
    const navigates=(route)=>{
      navigate(route)
    }
    
    return (
      <>
        {/* <MyNavbar /> */}
        <Container fluid> {/* Use fluid container for full width */}
          <Row>
            <Col lg={6}  className="main-image-col"> {/* Added a class */}
              <div className="main-image me-1">

                <h1 className='font bg_1_text '>Women's fashion</h1>
                <p className='bg_1_text2  '>Sitamet, consectetur adipiscing elit, sed do eiusmod tempor incidid-unt labore edolore magna aliquapendisse ultrices gravida.
                </p>
                <a href="" onClick={()=>navigate('/womens')} className=' text-underline text-decoration-none ' style={{ paddingLeft: "80px" }}>SHOP NOW</a>
                <hr className='line' />
              </div> {/* Empty div for background image */}
            </Col>
            <Col lg={6} className="side-images-col"> {/* Added a class */}
              <Row>
                <Col xs={6} className="side-image ms-4">
                  <div>
                    <h1 className='font bg_2_text ps-3 mt-5 pt-5'>Men's fashion</h1>
                    <p className='bg_2_text2 ps-3'>40 items</p>
                    <a href="" onClick={()=>navigate('/mens')} className=' text-underline text-decoration-none  ps-3 '>SHOP NOW</a>
                    <hr className='line2' />
                  </div>
                </Col>
                <Col xs={6} className="side-image " >
                  <div>
                    <h1 className='font bg_2_text ps-3 mt-5 pt-5'>Kid's fashion</h1>
                    <p className='bg_2_text2 ps-3'>40 items</p>
                    <a href=""  onClick={()=>navigate('/kids')}className=' text-underline  ps-3 text-decoration-none '>SHOP NOW</a>
                    <hr className='line2' />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={6} className="side-image-1 ms-4 mt-2">
                  <div>
                    <h1 className='font bg_2_text ps-3  mt-5 pt-5'>Cosmetics</h1>
                    <p className='bg_2_text2 ps-3'>40 items</p>
                    <a href="" onClick={()=>navigate('/cosmetics')} className=' text-underline  ps-3  text-decoration-none'>SHOP NOW</a>
                    <hr className='line2' />
                  </div>
                </Col>
                <Col xs={6} className="side-image-1 mt-2">
                  <div>
                    <h1 className='font bg_2_text ps-3 mt-5 pt-5'>Accessories</h1>
                    <p className='bg_2_text2 ps-3'>40 items</p>
                    <a href="" onClick={()=>navigate('/accessories')} className=' text-underline  ps-3  text-decoration-none'>SHOP NOW</a>
                    <hr className='line2' />
                  </div></Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </>
    );
  };

  export default Home;