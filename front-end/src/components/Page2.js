import ComboChart from "../components/ComboChart";
import PieChart from "../components/PieChart";

const Page2 = () => {
  return (
    <div>
      <table>
        <tr>
          <td>
            <ComboChart />
          </td>
          <td>
            <PieChart />
          </td>
        </tr>
      </table>
    </div>
  );
};

export default Page2;
