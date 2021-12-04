import { Chart } from "react-google-charts";

const ComboChart = () => {
  return (
    <div>
      <Chart
        width={"900px"}
        height={"500px"}
        chartType="ComboChart"
        loader={<div>Loading Chart</div>}
        data={[
          ["Year", "Nonfood", "Food", "Pharma"],
          ["2018", 4757.03, 23750.28, 667.55],
          ["2019", 12165.59, 61774.39, 1844.11],
          ["2020", 7586.89, 39134.08, 1248.04],
        ]}
        options={{
          title: "Yearly Expenditure on Various Categories",
          vAxis: { title: "Dollars" },
          hAxis: { title: "Year" },
          seriesType: "bars",
          series: { 3: { type: "line" } },
        }}
      />
    </div>
  );
};

export default ComboChart;
