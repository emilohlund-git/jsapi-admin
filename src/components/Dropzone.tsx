/* eslint-disable react-hooks/exhaustive-deps */
import Image from 'next/image';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { TiDelete } from 'react-icons/ti';

type Props = {
  files: DropFile[];
  setFiles: Dispatch<SetStateAction<DropFile[]>>
}

export interface DropFile extends File {
  preview: string;
}

const Dropzone: React.FC<Props> = ({ files, setFiles }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })))
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop
  });

  const removePreview = (f: DropFile) => {
    setFiles(files.filter((file) => file != f));
  }

  const thumbs = files.map(file => (
    <div className="inline-flex rounded-lg border-[1px] border-slate-500 mb-2 mr-2 w-24 h-24 p-2 box-border" key={file.name}>
      <div className="relative flex w-20 h-20">
        <TiDelete onClick={() => removePreview(file)} className="absolute right-0 top-0 z-20 text-error text-2xl" />
        <Image
          className="object-cover"
          src={file.preview}
          onLoad={() => URL.revokeObjectURL(file.preview)}
          alt={file.name}
          fill
        />
      </div>
    </div>
  ));

  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files])

  return (
    <section className="border-solid border-spacing-2 border-[1px] border-slate-500 p-4 rounded-lg w-full items-center flex justify-center flex-col">
      <div {...getRootProps({ className: '' })}>
        <input {...getInputProps()} />
        <p className="text-center">Click to select files</p>
      </div>
      <aside className="flex flex-row flex-wrap mt-4 justify-center">
        {thumbs}
      </aside>
    </section>
  )
}

export default Dropzone