import { Button, Card } from "react-bootstrap";

export default function NotLoginPage() {
    return (
        <Card className="text-center">
            <Card.Header> <h2 className="text-danger">Please login app</h2> </Card.Header>
            <Card.Body>
                <Card.Title>Please login now!</Card.Title>
                <Card.Text>
                    With supporting text below as a natural lead-in to additional content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
            </Card.Body>
            <Card.Footer className="text-muted">2 days ago</Card.Footer>
        </Card>
    );
}