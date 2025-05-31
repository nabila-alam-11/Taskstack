import Sidebar from "../components/Sidebar";
import "../css/sidebar.css";
import "../css/report.css";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import useFetch from "../useFetch";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

const Report = () => {
  const { data: tasks } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/tasks"
  );
  const { data: user } = useFetch(
    "https://workasana-backend-eight.vercel.app/auth/me"
  );

  const { data: tasksCompleted } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/tasks/last-week"
  );

  console.log(tasks);
  const userData = tasks?.filter((task) =>
    task?.owners?.some((owner) => owner?.name === user?.name)
  );

  console.log(tasksCompleted);

  const tasksCompletedByOwner = tasksCompleted?.filter((task) =>
    task?.owners?.some((owner) => owner?.name === user?.name)
  );

  console.log(tasksCompletedByOwner);

  if (!tasks || !user || !userData) {
    return (
      <div>
        <Sidebar />
        <div className="main">
          <h1 className="title">Reports</h1>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  const statusDistributionCount = userData?.reduce((acc, item) => {
    const status = item.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusDistributionData = {
    labels: Object.keys(statusDistributionCount),
    datasets: [
      {
        data: Object.values(statusDistributionCount),
        backgroundColor: ["#ebd234", "#1b4f33", "#4f2eab", "#ab2e8e"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  const COMPLETED = "Completed";
  const INCOMPLETE_STATUES = ["To Do", "In Progress", "Blocked"];

  const completedCount = userData?.filter(
    (task) => task.status === COMPLETED
  ).length;

  const incompleteCount = userData?.filter((task) =>
    INCOMPLETE_STATUES.includes(task.status)
  ).length;

  const dataForDonut = {
    labels: ["Completed Tasks", "Incomplete Tasks"],
    datasets: [
      {
        data: [completedCount, incompleteCount],
        backgroundColor: ["#eeaef8", "#b742ea"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%", // This creates the donut hole; adjust percentage as needed
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  // Tasks Completed last week
  const getLastWeekDates = () => {
    const today = new Date();
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - today.getDay() - 6);
    lastWeekStart.setHours(0, 0, 0, 0);

    const lastWeekEnd = new Date(lastWeekStart);
    lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
    lastWeekEnd.setHours(23, 59, 59, 999);

    return { lastWeekStart, lastWeekEnd };
  };

  const { lastWeekStart, lastWeekEnd } = getLastWeekDates();
  const completedLastWeekTasks = userData?.filter(
    (task) =>
      task.status === "Completed" &&
      new Date(task.updatedAt) >= lastWeekStart &&
      new Date(task.updatedAt) <= lastWeekEnd
  );

  const dailyCounts = Array(7).fill(0);

  completedLastWeekTasks.forEach((task) => {
    const day = new Date(task.updatedAt).getDay();
    dailyCounts[day] += 1;
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const barChartData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: "Tasks Completed",
        data: dailyCounts,
        backgroundColor: "green",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        stepSize: 1,
      },
    },
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
  };

  return (
    <div>
      <Sidebar />
      <div className="main">
        <h1 className="title">Reports</h1>
        <h3 className="report-heading">Report Overview</h3>
        <div style={{ width: "400px", height: "400px", marginLeft: "21rem" }}>
          {Object.keys(statusDistributionCount).length > 0 ? (
            <>
              <h3>Total Work Done Last Week</h3>
              <Bar data={barChartData} options={barChartOptions} />
              <Pie
                data={statusDistributionData}
                options={pieOptions}
                key={Object.keys(statusDistributionCount).join(",")} // safe + efficient key
              />
              <Pie data={dataForDonut} options={options} />
            </>
          ) : (
            <p>No task data to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
