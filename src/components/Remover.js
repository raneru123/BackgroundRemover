import React, { useState, useEffect } from "react";
import "./Remover.css";

const Remover = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [finalUrl, setFinalUrl] = useState(null);
  const [isUpload, setIsUpload] = useState(false);

  const handleFileInputChange = (e) => {
    const image = e.target.files[0];
    setSelectedFile(image);
  };

  const handlePaste = (e) => {
    const image = e.clipboardData.files[0];
    setSelectedFile(image);
  };

  const handleFileUpload = async () => {
    setIsUpload(true);
    const formData = new FormData();
    formData.append("image_file", selectedFile);
    formData.append("size", "auto");

    const api_key = "D29hLkE8Vtt5q7D7t9HaFLDy";

    try {
      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": api_key,
        },
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setFinalUrl(url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUpload(false);
    }
  };

  useEffect(() => {
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div className="container flex justify-center items-center">
      <div className="remover_container p-8 bg-opacity-10 rounded-lg shadow">
        <form className="info_container">
          <label className="info_text text-xl">Select or Paste an Image</label>
          <input
            type="file"
            onChange={handleFileInputChange}
            required
            className="text-lg py-2 px-4"
          />
          {!isUpload ? (
            <button
              type="button"
              onClick={handleFileUpload}
              className="btn btn_upload mt-4"
            >
              Upload
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFileUpload}
              className="btn btn_upload btn_disabled"
              disabled={true}
            >
              Uploading...
            </button>
          )}
        </form>
        {finalUrl && (
          <div className="download_area mt-4">
            <a href={finalUrl} download="no-background.png">
              <button className="btn btn_download">Download</button>
            </a>
            <div className="final_img_area max-h-80 overflow-y-auto flex justify-center items-center">
              <img src={finalUrl} alt="final_img" className="final_img max-w-full max-h-full object-contain" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Remover;
