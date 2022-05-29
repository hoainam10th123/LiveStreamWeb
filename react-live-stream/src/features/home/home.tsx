import { Carousel } from "react-bootstrap";

export default function Home() {
    return (
        <Carousel>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="/assets/cafedev_net_core.png"
                    alt="First slide"
                />
                <Carousel.Caption>
                    <h3>Dot Net 6</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="/assets/netcore_Angular.jpg"
                    alt="Second slide"
                />

                <Carousel.Caption>
                    <h3>Dot Net Core & Angular</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="/assets/netcore-react.png"
                    alt="Third slide"
                />

                <Carousel.Caption>
                    <h3>Dot Net Core & React</h3>
                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}