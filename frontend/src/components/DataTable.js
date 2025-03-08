import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box } from "@mui/material";
import { CSVLink } from "react-csv";

const DataTable = ({ data }) => {
  const [visibleRows, setVisibleRows] = useState(10);

  const handleShowMore = () => {
    setVisibleRows((prevVisibleRows) => prevVisibleRows + 10);
  };

  return (
    <TableContainer component={Paper} sx={{ marginTop: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Cleaned Data
        </Typography>
        <Button variant="contained" color="primary">
          <CSVLink data={data} filename={"cleaned_data.csv"} style={{ color: "white", textDecoration: "none" }}>
            Download CSV
          </CSVLink>
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            {Object.keys(data[0]).map((key) => (
              <TableCell key={key}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.slice(0, visibleRows).map((row, index) => (
            <TableRow key={index}>
              {Object.values(row).map((value, idx) => (
                <TableCell key={idx}>{value}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {visibleRows < data.length && (
        <Button onClick={handleShowMore} variant="contained" color="primary" sx={{ margin: 2 }}>
          Show More
        </Button>
      )}
    </TableContainer>
  );
};

export default DataTable;
