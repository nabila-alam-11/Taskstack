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
import "react-circular-progressbar/dist/styles.css";
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

  const userData = tasks?.filter((task) =>
    task?.owners?.some((owner) => owner?.name === user?.name)
  );

  // Tasks closed by Team
  const completedTasksByTeam = tasks
    ?.filter((task) => task?.status === "Completed")
    .reduce((acc, task) => {
      const teamName = task.team?.name || "Unknown Team";
      acc[teamName] = (acc[teamName] || 0) + 1;
      return acc;
    }, {});

  const tasksCompletedByOwner = tasksCompleted?.filter((task) =>
    task?.owners?.some((owner) => owner?.name === user?.name)
  );

  const teamNames = Object.keys(completedTasksByTeam || {});
  console.log(teamNames);
  const teamLables = teamNames?.map((team) =>
    team.length > 15 ? team.slice(0, 15) + "..." : team
  );
  console.log(teamLables);
  const completedCounts = Object.values(completedTasksByTeam || {});

  const completedTasksByTeamData = {
    labels: teamLables,
    datasets: [
      {
        label: "Completed Tasks",
        data: completedCounts,
        backgroundColor: "#b742ea",
        borderWidth: 1,
      },
    ],
  };

  const completeTasksByTeamOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "center",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 20,
          padding: 15,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
          },
        },
      },
    },
  };

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
        backgroundColor: ["#8539a3", "purple", "#ebbb38", "#f29bd9"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "center",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 20,
          padding: 15,
        },
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
        position: "top",
        align: "center",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 20,
          padding: 15,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  // Tasks Completed last week

  const dailyCounts = Array(7).fill(0);

  tasksCompletedByOwner?.forEach((task) => {
    const day = new Date(task.updatedAt || task.closedAt).getDay();
    dailyCounts[day] += 1;
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const barChartData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: "Tasks Completed",
        data: dailyCounts,
        backgroundColor: "#eeaef8",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "center",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 20,
          padding: 15,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 0.5,
          precision: 5,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Total days of work pending
  const today = new Date();

  const pendingTasks = userData?.filter((task) => task.status !== "Completed");

  const pendingWithDays = pendingTasks.map((task) => {
    const dueDate = new Date(task.dueOn);
    let pendingDays = 0;
    if (dueDate < today) {
      const diffTime = Math.abs(today - dueDate);
      pendingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return {
      taskName: task.name,
      status: task.status,
      pendingDays,
    };
  });
  const pendingDaysLabels = pendingWithDays.map((task) =>
    task.taskName.length > 15
      ? task.taskName.slice(0, 15) + "..."
      : task.taskName
  );
  const pendingDaysData = pendingWithDays.map((task) => task.pendingDays);
  const pendingDaysChartData = {
    labels: pendingDaysLabels,
    datasets: [
      {
        label: "Days Overdue",
        data: pendingDaysData,
        backgroundColor: "#f29bd9",
        borderWidth: 1,
      },
    ],
  };

  const pendingDaysChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "center",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 20,
          padding: 15,
        },
      },

      tooltip: {
        callbacks: {
          label: (context) => `${context.raw} day(s) overdue`,
        },
      },
      title: {
        display: true,
        text: "Tasks With Pending Days",
        font: {
          size: 18,
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Tasks",
          font: {
            size: 14,
            color: "purple",
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Days Overdue",
          font: {
            size: 14,
          },
        },
        ticks: {
          autoSkip: false,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Tasks closed by owner
  const completedTasksByUser = tasks?.filter(
    (task) =>
      task.status === "Completed" &&
      task?.owners?.some((owner) => owner?.name === user?.name)
  );

  const completedTaskLabels = completedTasksByUser?.map((task) =>
    task.name.length > 15 ? task.name.slice(0, 15) + "..." : task.name
  );

  const completedTaskData = completedTasksByUser?.map(() => 1);

  const completedTasksBarData = {
    labels: completedTaskLabels,
    datasets: [
      {
        label: "Completed Tasks",
        data: completedTaskData,
        backgroundColor: "#b742ea",
        borderWidth: 1,
      },
    ],
  };

  const completedTasksBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 20,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: () => "Completed",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: { size: 12 },
        },
      },
      x: {
        ticks: {
          font: { size: 12 },
          autoSkip: false,
        },
      },
    },
  };

  return (
    <div>
      <Sidebar />
      <div className="main">
        <h1 className="title mb-0">Reports</h1>
        <h3 className="report-heading text-center">Report Overview</h3>
        <div
          className="center-div"
          style={{
            height: "400px",
            marginLeft: "21rem",
          }}
        >
          {Object.keys(statusDistributionCount).length > 0 ? (
            <>
              <div className="d-flex">
                <div style={{ height: "20rem", width: "25rem" }} className="">
                  <h4 className="text-center">Total Work Done Last Week</h4>

                  <Bar data={barChartData} options={barChartOptions} />
                </div>
                <div
                  style={{
                    height: "20rem",
                    width: "25rem",
                    paddingInline: "0rem",
                    marginLeft: "2rem",
                  }}
                  className=""
                >
                  <h4 className="text-center">Tasks Status Distribution</h4>

                  <Pie
                    data={statusDistributionData}
                    options={pieOptions}
                    key={Object.keys(statusDistributionCount).join(",")}
                  />
                </div>
                <div style={{ width: "25rem", height: "20rem" }} className="">
                  <h4 className="text-center">
                    Completed vs Incompleted Tasks
                  </h4>
                  <Pie data={dataForDonut} options={options} />
                </div>
              </div>
              <div className="d-flex mt-5 mb-5">
                <div
                  style={{
                    width: "37rem",
                    height: "25rem",
                    margin: "2rem auto",
                  }}
                  className=""
                >
                  <h4 className="text-center mt-5">Tasks closed by Team</h4>

                  <Bar
                    data={completedTasksByTeamData}
                    options={completeTasksByTeamOptions}
                  />
                </div>
                <div
                  style={{
                    width: "35rem",
                    height: "25rem",
                    marginLeft: "5rem",
                    marginTop: "2rem",
                  }}
                  className=""
                >
                  <h4 className="text-center mt-5">
                    Total days of work pending
                  </h4>
                  <Bar
                    data={pendingDaysChartData}
                    options={pendingDaysChartOptions}
                  />
                </div>
              </div>

              <div>
                <div
                  style={{
                    width: "25rem",
                    margin: "2rem",
                    height: "30rem",
                    marginBlock: "5rem",
                  }}
                >
                  <h4 className="text-center mt-5">Tasks closed by Owner</h4>
                  <Bar
                    data={completedTasksBarData}
                    options={completedTasksBarOptions}
                  />
                </div>
              </div>
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
