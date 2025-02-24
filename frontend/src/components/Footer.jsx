import { Col, Container, Row } from "react-bootstrap"



const Footer = () => {
    const year = new Date().getFullYear()
    return(
        <div className="footer">
            <Container>
                <Row>
                    <Col className="text-center py-3">
                        <p>ProShop &copy; {year}</p>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Footer