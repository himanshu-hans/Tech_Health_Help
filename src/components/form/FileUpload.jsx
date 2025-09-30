import React, { useState } from "react";
import { Controller } from "react-hook-form";

const FileUpload = ({ label = "Upload File", name, control, src }) => {
  const [filePreview, setFilePreview] = useState(null);
  if (!control) {
    console.error(
      "⚠️ FileUpload: 'control' is missing! Make sure to pass it from useForm()."
    );
    return null; // Prevent rendering without control
  }

  return (
    <div className="file-upload-container">
      {!filePreview && (
        <label htmlFor={name} className="file-upload-label">
          <img src={src ? src : "../images/sample.png"} alt="upload" />
        </label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <input
            id={name}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              field.onChange(file); // Store file in react-hook-form
              if (file) {
                setFilePreview(URL.createObjectURL(file)); // Show preview
              }
              else {
                setFilePreview(null); // reset if no file selected
              }
            }}
            ref={field.ref}
          />
        )}
      />

      {/* Image Preview */}
      {filePreview && (
        <div className="file-preview">
          <img src={filePreview} alt="Preview" className="preview-image" />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
