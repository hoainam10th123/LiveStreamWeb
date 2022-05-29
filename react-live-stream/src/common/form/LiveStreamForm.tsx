import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { Badge, Card } from "react-bootstrap";
import { useStore } from "../../stores/stores";
import { v4 as uuidv4 } from 'uuid';
import { messageService } from "../../stores/messageService";
import agent from "../../api/agent";
import { toast } from "react-toastify";


export default observer(function LiveStreamForm() {
    const { presenceHubStore, peerStore, userStore: { user }, messageHubStore } = useStore();
    const currentUserVideoRef = useRef<any>(null);
    let subscription: any;

    useEffect(() => {
        startLiveStreamFromCurrentUser().then(() => {
            messageHubStore.createHubConnection(uuidv4());

            setTimeout(() => {
                messageHubStore.startStream();
            }, 100)

            subscription = messageService.getMessage().subscribe((username: string) => {
                console.log('subscription: ' + username)
                setTimeout(() => {
                    sendStreamTUserName(username);
                }, 1000)
            });
        })

        return () => {
            recorder.stop();
            subscription.unsubscribe();
            peerStore.destroyPeer();
        }
    }, [])

    let recorder: any;

    async function recordAndSaveFile(stream: any) {
        let chunks: any[] = [];        

        try {
            recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (e: any) => {
                chunks.push(e.data);
                if (recorder.state === "inactive") {
                    const blob = new Blob(chunks, { type: "video/webm" });
                    const formData = new FormData();
                    formData.append('video-blob', blob);
                    agent.RecordFile.saveRecoredFile(formData).then(() => toast.success('Upload video success'))
                }
            };

            recorder.start(1000);
        } catch (e) {
            console.log(e);
        }
    }

    async function sendStreamTUserName(username: string) {
        try {
            const userPeer = presenceHubStore.usersOnline.find(x => x.username === username);
            const call = peerStore.currentPeer.call(userPeer?.id!, peerStore.currentStream!);
        } catch (error) {
            console.log(error);
        }
    }

    async function startLiveStreamFromCurrentUser() {
        try {
            let mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            peerStore.setStream(mediaStream);

            currentUserVideoRef.current.srcObject = mediaStream;
            currentUserVideoRef.current.load();
            currentUserVideoRef.current.play();

            setTimeout(() => {
                presenceHubStore.usersOnline.forEach(userPeer => {
                    if (user?.username !== userPeer.username) {
                        const call = peerStore.CurrentPeer.call(userPeer.id, mediaStream);
                    }
                })
            }, 50)

            recordAndSaveFile(mediaStream);

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="row justify-content-center">
            <div className="col-8">
                <Card style={{ position: 'relative' }} >
                    <video width='100%' ref={currentUserVideoRef} controls />
                    <div className="badge label" style={{ fontSize: 20 }}>
                        <Badge bg="danger">100k</Badge>
                    </div>
                </Card>
            </div>
        </div>
    );
})