import { Modal } from "react-native";
import LogoutScreen from "./LogoutScreen";

interface VentanaModalProps {
    showLogout: boolean;
    setShowLogout: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    clearPersistentData: () => void;
}

const VentanaModal = ({ showLogout, setShowLogout, setIsAuthenticated, clearPersistentData }: VentanaModalProps) => {

    const closeModal = () => {
        setShowLogout(false);
    }

    return (
        <Modal
            visible={showLogout}
            animationType='slide'
            transparent={true}
            onRequestClose={closeModal}
        >
            <LogoutScreen
                setIsAuthenticated={setIsAuthenticated}
                closeModal={closeModal}
                clearPersistentData={clearPersistentData}
            />
        </Modal>
    )
}

export default VentanaModal;