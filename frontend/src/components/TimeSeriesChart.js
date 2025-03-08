import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardContent, Typography, Select, MenuItem, Box, FormControl, InputLabel } from "@mui/material";

const TimeSeriesChart = ({ data, filter, setFilter, fetchFilteredData }) => {
  const formatDate = (entry) => {
    if (filter === "weekly" && entry.Week) {
      return new Date(entry.Week.split("/")[0]).getTime(); // Extract start date from range
    } else if (filter === "monthly" && entry.Month) {
      return new Date(entry.Month).getTime(); // Convert Month key to timestamp
    } else if (entry.date) {
      return new Date(entry.date).getTime(); // Default for daily data
    } else {
      return null; // Fallback in case of missing data
    }
  };

  const formattedData = data
    .map((entry) => {
      const date = formatDate(entry);
      return date ? [date, entry.number_of_sales] : null;
    })
    .filter(Boolean);

  const options = {
    title: {
      text: "Sales Trends Over Time",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Date",
      },
      labels: {
        format: "{value:%Y-%m-%d}",
      },
    },
    yAxis: {
      title: {
        text: "Number of Sales",
      },
    },
    series: [
      {
        name: "Number of Sales",
        data: formattedData,
        type: "line",
        color: "#8884d8",
      },
    ],
    tooltip: {
      xDateFormat: "%Y-%m-%d",
    },
  };

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
    fetchFilteredData(selectedFilter);
  };

  return (
    <Card sx={{ padding: 3, margin: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sales Trends
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              onChange={handleFilterChange}
              label="Filter"
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );
};

export default TimeSeriesChart;