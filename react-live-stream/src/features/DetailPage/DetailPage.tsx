import { Button, Card } from "react-bootstrap";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faComment, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useStore } from "../../stores/stores";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from 'yup';
import Peer from 'peerjs';
import { observer } from "mobx-react-lite";

library.add(faComment, faThumbsUp)

export default observer(function DetailPage() {
    const [isHide, setHide] = useState(false);
    const [peerId, setPeerId] = useState('');
    const { messageHubStore, presenceHubStore, peerStore } = useStore();
    const userVideoRef = useRef<any>(null);

    useEffect(() => {
        if (presenceHubStore.group) {
            messageHubStore.createHubConnection(presenceHubStore.group.name);
            setTimeout(()=>{
                messageHubStore.sendStream();
            }, 1000)
        }

        const peer = new Peer();
        peer.on('open', (id) => {
            setPeerId(id);
            //update lai peerId vi da tao peer moi
            presenceHubStore.updateUserPeer(id);
        });

        peer.on('call', (call) => {
            call.answer(peerStore.currentStream!);
            call.on('stream', (otherUserVideoStream: MediaStream) => {                
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
    }, [])

    return (
        <div className="row justify-content-center">
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
                        <video width='100%' ref={userVideoRef} controls />
                    </Card.Body>
                    <Card.Footer>
                        <Button className="margin" onClick={() => setHide(!isHide)}>
                            <FontAwesomeIcon icon={faComment} /> 100k
                        </Button>
                        <Button className="margin"><FontAwesomeIcon icon={faThumbsUp} /> 20k</Button>
                    </Card.Footer>
                </Card>
            </div>
            {
                isHide ? (
                    <div className="col-4">
                        <Formik
                            onSubmit={(values, { resetForm }) => messageHubStore.addComment(values).then(() => resetForm())}
                            initialValues={{ noiDung: '', roomId: presenceHubStore.group!.name }}
                            validationSchema={Yup.object().shape({
                                noiDung: Yup.string().required()
                            })}
                        >
                            {({ isValid, handleSubmit }) => (
                                <Form>
                                    <Field name='noiDung'>
                                        {(props: FieldProps) => (
                                            <div style={{ position: 'relative' }}>
                                                <textarea className="form-control"
                                                    placeholder='Enter your comment (Enter to submit, SHIFT + enter for new line)'
                                                    rows={2}
                                                    {...props.field}
                                                    onKeyPress={e => {
                                                        if (e.key === 'Enter' && e.shiftKey) {
                                                            return;
                                                        }
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            isValid && handleSubmit();
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </Field>
                                </Form>
                            )}
                        </Formik>
                        <ul style={{ listStyle: 'none', marginTop: 5, overflow: 'auto', maxHeight: 500 }}>
                            {messageHubStore.comments.map(comment => (
                                <li>
                                    <div className="d-flex margin">
                                        <img style={{ marginRight: 6 }} height={50} src="/assets/user.png" alt="" className="rounded" />
                                        <div style={{ backgroundColor: 'wheat', padding: 6, borderRadius: 10 }}>
                                            <div className="fw-bold">{comment.displayName}</div>
                                            <div>{comment.noiDung}</div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null
            }
        </div>
    );
})