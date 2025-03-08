import React, { useState } from "react";
import { Button, Card, CardContent, Typography, Box, Alert, IconButton, CircularProgress } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const FileUpload = ({ handleFileChange, handleUpload, handleFileDelete, fileInputRef, error, setError, disabled }) => {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile) {
      validateFile(selectedFile);
      handleFileChange(e);
    }
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateFile(selectedFile);
      handleFileChange(e);
    }
  };

  const validateFile = (file) => {
    const validTypes = ["text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    setFileName(file.name);
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Please select a CSV or Excel file.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleUploadClick = async () => {
    if (!fileName) {
      setError("Please select a file first");
      return;
    }
    setError(null);
    setLoading(true);
    await handleUpload();
    setLoading(false);
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation(); // Prevent the click event from bubbling up
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError(null);
    handleFileDelete(); // Call the handleFileDelete function
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upload File
        </Typography>
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            border: "2px dashed grey",
            padding: "20px",
            textAlign: "center",
            backgroundColor: dragOver ? "#f0f0f0" : "white",
            cursor: "pointer"
          }}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <CloudUploadIcon sx={{ fontSize: 50, color: "grey" }} />
          <Typography variant="body1" gutterBottom>
            Drag and drop a file here, or click to select a file
          </Typography>
          <input
            type="file"
            onChange={handleChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          {fileName && (
            <Typography variant="body2" gutterBottom>
              Selected file: {fileName}
              <IconButton onClick={handleRemoveFile} size="small">
                <DeleteIcon sx={{ color: "#ff6666" }} />
              </IconButton>
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUploadClick}
          style={{ marginTop: "10px" }}
          startIcon={loading ? <CircularProgress size={24} /> : <CloudUploadIcon />}
          disabled={!!error || loading || disabled} // Disable the upload button if there is an error, loading, or disabled
        >
          {loading ? "Uploading..." : "Upload"}
        </Button>
        {error && <Alert severity="error" style={{ marginTop: "10px" }}>{error}</Alert>}
      </CardContent>
    </Card>
  );
};

export default FileUpload;