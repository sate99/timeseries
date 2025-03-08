import api from "../config/api";
import {
  INVALID_FILE_TYPE,
  NO_FILE_SELECTED,
  UPLOAD_ERROR,
  FETCH_FILTERED_DATA_ERROR,
  FETCH_CLEANED_DATA_ERROR,
  SELECT_FILE_FIRST,
} from "../constants/strings";

export const handleFileChange = (event, setFile, setUploadError, setShowCleanedData, setShowFilteredData, setUploadDisabled) => {
  const selectedFile = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];
  if (selectedFile) {
    const fileType = selectedFile.type;
    const validTypes = ["text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    if (!validTypes.includes(fileType)) {
      setUploadError(INVALID_FILE_TYPE);
      return;
    }
    setFile(selectedFile);
    setUploadError(null);
    setShowCleanedData(false);
    setShowFilteredData(false);
    setUploadDisabled(false);
  } else {
    setUploadError(NO_FILE_SELECTED);
  }
};

export const handleUpload = async (file, setUploadDisabled, fetchFilteredData, fetchCleanedData, setUploadError, setShowCleanedData, setShowFilteredData, setFile, fileInputRef) => {
  if (!file) {
    setUploadError(SELECT_FILE_FIRST);
    return false;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    setUploadDisabled(true);
    await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await fetchFilteredData();
    await fetchCleanedData();
    setUploadError(null);
    setShowCleanedData(true);
    setShowFilteredData(true);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    return true;
  } catch (error) {
    console.error("Error uploading file", error);
    const errorMessage = error.response?.data?.error || UPLOAD_ERROR;
    setUploadError(errorMessage);
    setUploadDisabled(false);
    return false;
  }
};

export const fetchFilteredData = async (filter, setLoadingFilteredData, setData, setAnalysisDataError) => {
  try {
    setLoadingFilteredData(true);
    const response = await api.get(`/filtered-data?type=${filter}`);
    setData(response.data || []);
    setAnalysisDataError(null);
  } catch (error) {
    console.error("Error fetching data", error);
    setAnalysisDataError(error.response?.data?.error || FETCH_FILTERED_DATA_ERROR);
  } finally {
    setLoadingFilteredData(false);
  }
};

export const fetchCleanedData = async (setLoadingCleanedData, setCleanedData, setCleanedDataError) => {
  try {
    setLoadingCleanedData(true);
    const response = await api.get("/cleaned-data");
    setCleanedData(response.data || []);
    setCleanedDataError(null);
  } catch (error) {
    console.error("Error fetching cleaned data", error);
    setCleanedDataError(error.response?.data?.error || FETCH_CLEANED_DATA_ERROR);
  } finally {
    setLoadingCleanedData(false);
  }
};