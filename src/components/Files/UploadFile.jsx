import React from 'react';
import { LiaCloudUploadAltSolid } from 'react-icons/lia';
import { Upload } from 'antd';
const { Dragger } = Upload;

const UploadFile = ({
  name = "files",
  multiple = true,
  className = "",
  files,
  setFiles,
  accept = '*',
  onChange = (info) => {
    const { status } = info.file;
    if (status !== 'uploading') {
      setFiles(info.fileList);
    }
  }
}) => (
  <Dragger
    name={name}
    beforeUpload={() => false}
    accept={accept}
    fileList={files}
    multiple={multiple}
    onChange={onChange}
    className={className}
  >
    <p className="flex justify-center ant-upload-drag-icon">
      <LiaCloudUploadAltSolid size="4em" className='animate-bounce' />
    </p>
    <p className="ant-upload-text">Haz click o arrastra los archivos a esta área para subirlos</p>
    <p className="ant-upload-hint">
      Por favor subir únicamente archivos {accept}
    </p>
  </Dragger>
);
export default UploadFile;