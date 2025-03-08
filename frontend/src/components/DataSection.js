import React from 'react';
import { Box, CircularProgress, Alert, Button } from '@mui/material';
import DataVisualization from './DataVisualization';
import DataTable from './DataTable';

const DataSection = ({ loading, error, data, fetchData, filter, setFilter }) => {
  return (
    <Box mb={4}>
      {error && (
        <Alert severity="error">
          {error}
          <Button
            onClick={() => fetchData(filter)}
            color="primary"
            size="small"
            variant="contained"
            style={{ marginLeft: "10px" }}
          >
            Retry
          </Button>
        </Alert>
      )}
      <Box position="relative">
        {loading && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex={1}
          >
            <CircularProgress />
          </Box>
        )}
        <Box opacity={loading ? 0.5 : 1}>
          {!error && data.length > 0 && (
            <>
              {filter ? (
                <DataVisualization data={data} filter={filter} setFilter={setFilter} fetchFilteredData={fetchData} />
              ) : (
                <DataTable data={data} />
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DataSection;