import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import TimeSeriesChart from "./TimeSeriesChart";

const DataVisualization = ({ data, filter, setFilter, fetchFilteredData }) => (
  <Card sx={{ padding: 2, marginBottom: 3 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Data Visualization
      </Typography>
      <TimeSeriesChart data={data} filter={filter} setFilter={setFilter} fetchFilteredData={fetchFilteredData} />
    </CardContent>
  </Card>
);

export default DataVisualization;