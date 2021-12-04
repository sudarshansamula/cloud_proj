import { Chart } from "react-google-charts";
const PieChart = () => {
  return (
    <div>
      <Chart
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={[
          ["Commodities", "Expenditure"],
          ["PET", 1207.47],
          ["DAIRY", 5622.79],
          ["ALCOHOL", 3269.31],
          ["PRODUCE", 6039.84],
          ["SEAFOOD", 1348.32],
          ["HOUSEHOLD", 4809.53],
          ["MEDICATION", 1796.14],
          ["PERSONAL CARE", 2661.55],
          ["GROCERY STAPLE", 15377.71],
          ["SPECIALTY FOOD", 428.22],
          ["BEVERAGE - WATER", 1182.38],
          ["TOBACCO PRODUCTS", 806.83],
          ["INTERNATIONAL FOOD", 1025.55],
          ["BEVERAGE - NON WATER", 4051.68],
          ["BABY", 818.63],
          ["FROZEN FOOD", 5254.52],
          ["IN STORE FOOD SERVICE", 1464.17],
          ["BAKERY", 2912.02],
          ["FLORAL", 740.66],
          ["DRY GOODS", 1081.04],
          ["CANNED GOODS", 1134.58],
          ["DELI", 1904.34],
          ["MEAT - PORK", 910.96],
          ["GIFT", 385.68],
          ["HOLIDAY", 91.25],
          ["MEAT - OTHER", 1485.02],
          ["MEAT - BEEF", 3275.4],
          ["MEAT - CHICKEN", 2320.26],
          ["CLOTHING", 309.13],
          ["MISC", 187.95],
          ["MEAT - SAUSAGE", 624.91],
          ["OUTDOOR", 223.41],
          ["BULK PRODUCTS", 241.72],
          ["COSMETICS", 172.81],
          ["MEAT - POULTRY", 101.26],
          ["TOYS", 46.12],
          ["SEASONAL PRODUCTS", 68.74],
          ["AUTO", 30.64],
          ["MEAT - TURKEY", 260.14],
          ["ELECTRONICS", 40.96],
          ["ACTIVITY", 22.48],
          ["MEDICAL SUPPLIES", 47.97],
        ]}
        options={{
          title: "Commodities in Year 2019",
          width: 600,
          height: 600,
        }}
      />
    </div>
  );
};

export default PieChart;
