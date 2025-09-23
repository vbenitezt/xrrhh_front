import { Drawer } from "antd";
import { CircleButton, ImportButton } from "../Buttons/CustomButtons";
import { useState } from "react";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { DownloadOutlined } from "@ant-design/icons";
import PDFViewer from 'pdf-viewer-reactjs';
import { v4 } from "uuid";
import { downloadPDF } from "../../utils/files";



const PdfViewer = ({ url }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <ImportButton onClick={() => setIsOpen(true)} title="Ver" size="small" icon={<IoDocumentAttachOutline />} />
            <Drawer
                width="auto"
                height="auto"
                open={isOpen}
                onClose={() => setIsOpen(false)}
                extra={
                    <CircleButton
                        type="primary"
                        title="Descargar"
                        icon={<DownloadOutlined />}
                        onClick={() => downloadPDF(url)}
                    />
                }
            >
                <PDFViewer key={v4()} document={{ url }} hideNavbar />
            </Drawer>
        </>
    )
}

export default PdfViewer;
