import { useState, useRef } from "react";
import { Typography, Container, Box } from "@mui/material";
import FileUpload from "./components/FileUpload";
import DataSection from "./components/DataSection";
import {
  handleFileChange,
  handleUpload,
  fetchFilteredData,
  fetchCleanedData,
} from "./handlers/dataHandlers";

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [uploadError, setUploadError] = useState(null);
  const [cleanedDataError, setCleanedDataError] = useState(null);
  const [analysisDataError, setAnalysisDataError] = useState(null);
  const [filter, setFilter] = useState("daily");
  const [cleanedData, setCleanedData] = useState([]);
  const [showCleanedData, setShowCleanedData] = useState(false);
  const [showFilteredData, setShowFilteredData] = useState(false);
  const [loadingFilteredData, setLoadingFilteredData] = useState(false);
  const [loadingCleanedData, setLoadingCleanedData] = useState(false);
  const [uploadDisabled, setUploadDisabled] = useState(false);
  const fileInputRef = useRef(null);

  const fetchFilteredDataWithFilter = async (filterType) => {
    await fetchFilteredData(filterType, setLoadingFilteredData, setData, setAnalysisDataError);
  };

  const handleFileUpload = async () => {
    await handleUpload(
      file,
      setUploadDisabled,
      async () => {
        const filteredDataSuccess = await fetchFilteredDataWithFilter(filter);
        if (filteredDataSuccess) {
          setShowFilteredData(true);
        }
      },
      async () => {
        const cleanedDataSuccess = await fetchCleanedData(setLoadingCleanedData, setCleanedData, setCleanedDataError);
        if (cleanedDataSuccess) {
          setShowCleanedData(true);
        }
      },
      setUploadError,
      setShowCleanedData,
      setShowFilteredData,
      setFile,
      fileInputRef
    );
  };

  const handleFileDelete = () => {
    setFile(null);
    setUploadDisabled(false);
    setShowCleanedData(false);
    setShowFilteredData(false);
    setUploadError(null);
    setCleanedDataError(null);
    setAnalysisDataError(null);
    fileInputRef.current.value = null;
  };

  return (
    <Container style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        Time Series Data Upload & Visualization
      </Typography>

      <Box mb={4}>
        <FileUpload
          handleFileChange={(event) =>
            handleFileChange(
              event,
              setFile,
              setUploadError,
              setShowCleanedData,
              setShowFilteredData,
              setUploadDisabled
            )
          }
          handleUpload={handleFileUpload}
          handleFileDelete={handleFileDelete}
          fileInputRef={fileInputRef}
          error={uploadError}
          setError={setUploadError}
          disabled={uploadDisabled}
        />
      </Box>

      {showFilteredData && (
        <DataSection
          title="Filtered Data"
          loading={loadingFilteredData}
          error={analysisDataError}
          data={data}
          fetchData={fetchFilteredDataWithFilter}
          filter={filter}
          setFilter={setFilter}
        />
      )}

      {showCleanedData && (
        <Box mb={4}>
          <DataSection
            title="Cleaned Data"
            loading={loadingCleanedData}
            error={cleanedDataError}
            data={cleanedData}
            fetchData={() =>
              fetchCleanedData(setLoadingCleanedData, setCleanedData, setCleanedDataError)
            }
          />
        </Box>
      )}
    </Container>
  );
}

export default App;