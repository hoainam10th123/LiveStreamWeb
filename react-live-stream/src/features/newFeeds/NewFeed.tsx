import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useStore } from "../../stores/stores";
import Peer from 'peerjs';
import LiveStreamForm from "../../common/form/LiveStreamForm";
import { Link } from "react-router-dom";

export default observer(function NewFeed() {
    const { peerStore, presenceHubStore, modalStore } = useStore();
    const [peerId, setPeerId] = useState('');
    const userVideoRef = useRef<any>(null);

    useEffect(() => {
        const peer = new Peer();

        peer.on('open', (id) => {
            presenceHubStore.updateUserPeer(id);
            setPeerId(id);
        });

        peer.on('call', (call) => {
            call.answer(peerStore.currentStream!);
            call.on('stream', (otherUserVideoStream: MediaStream) => {
                //peerStore.setStream(otherUserVideoStream);
                userVideoRef.current.srcObject = otherUserVideoStream;
                //setTimeout to fix error: (in promise) the play() request was interrupted by a new load request
                setTimeout(() => {
                    userVideoRef.current.play();// this is asynchronous!
                }, 100)
            });

            call.on('error', (err) => {
                console.error(err);
            })
        });

        peerStore.setPeer(peer);
    }, [])

    return (
        <div className="row justify-content-center">
            <div className="col-8">
                <Button variant="success" className="w-100" onClick={() => modalStore.openModal("Live stream", <LiveStreamForm />)}>Start Live</Button>
            </div>
            <div className="col-8">
                <Card className="border-primary" style={{ marginTop: 5 }}>
                    <Card.Header className="d-flex">
                        <img height={50} src="/assets/user.png" alt="" className="rounded" />
                        <div style={{ marginLeft: 5 }}>
                            <div className="fw-bold">{peerId}</div>
                            <div className="text-muted">1 phut ago</div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {/* <video width="100%" controls>
                            <source src="./assets/GGDrive.mp4" type="video/mp4" />
                            Browser not supported
                        </video> */}
                        <video width='100%' ref={userVideoRef} controls />

                    </Card.Body>
                    <Card.Footer>
                        <Link to="/video">
                            <Button variant="primary">View</Button>
                        </Link>
                    </Card.Footer>
                </Card>
            </div>
        </div>
    );
})