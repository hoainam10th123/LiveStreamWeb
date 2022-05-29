import { observer } from "mobx-react-lite";
import { Modal } from "react-bootstrap";
import { useStore } from "../../stores/stores";

export default observer(function ModalContainer() {
    const { modalStore } = useStore();

    return (
        <Modal 
            show={modalStore.modal.open} 
            onHide={modalStore.closeModal}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>{modalStore.modal.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalStore.modal.body}</Modal.Body>
        </Modal>
    );
})