import { Spinner } from "react-bootstrap";

export default function Loading() {
    return (
        <Spinner variant="primary" animation="border" role="status">
            <span className="visually-hidden">Loading app</span>
        </Spinner>
    );
}