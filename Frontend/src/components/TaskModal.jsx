import "../css/tasks.css";
import Select from "react-select";
import useFetch from "../useFetch";
import useTaskContext from "../contexts/TaskContext";
import { useState } from "react";

const TaskModal = () => {
  const { data: teams } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/teams"
  );
  const { data: projects } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/projects"
  );

  const { data: tags } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/tags"
  );

  const { data: users } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/users"
  );

  const { data: tasks } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/tasks"
  );

  const { addTask } = useTaskContext();

  const [formData, setFormData] = useState({
    name: "",
    project: "",
    team: "",
    tags: [],
    owners: [],
    timeToComplete: 0,
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      name: formData.name,
      project: formData.project,
      team: formData.team,
      owners: Array.isArray(formData.owners)
        ? formData.owners.map((owner) => owner.value)
        : [],
      tags: Array.isArray(formData.tags)
        ? formData.tags.map((tag) => tag.value)
        : [],
      timeToComplete: formData.timeToComplete,
      status: formData.status,
    };

    try {
      await addTask(newTask);
      setFormData({
        name: "",
        project: "",
        team: "",
        owners: [],
        tags: [],
        timeToComplete: 0,
        status: "",
      });
    } catch (error) {
      console.log("Failed to add task: ", error.message);
    }
  };

  const tagOptions =
    tags?.map((tag) => ({
      value: tag._id,
      label: tag.name,
    })) || [];

  const userOptions = users?.map((user) => ({
    value: user._id,
    label: user.name,
  }));

  const statusOptions = [...new Set(tasks?.map((task) => task.status))];

  return (
    <>
      <button
        className="addTask"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Add New Task +
      </button>

      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add New Task
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            {/* Modal Body */}
            <div className="modal-body">
              <form id="newTaskForm" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="project" className="form-label">
                    Project
                  </label>
                  <select
                    className="form-select"
                    id="project"
                    name="project"
                    style={{ height: "2.5rem" }}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Project --</option>

                    {projects?.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="team" className="form-label">
                    Team
                  </label>

                  <select
                    className="form-select"
                    id="team"
                    style={{ height: "2.5rem" }}
                    name="team"
                    onChange={handleChange}
                  >
                    <option value="">-- Select Team --</option>

                    {teams?.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="tags" className="form-label">
                    Tags
                  </label>
                  <Select
                    isMulti
                    id="tags"
                    options={tagOptions}
                    value={formData.tags}
                    name="tags"
                    onChange={(selectedOptions) => {
                      setFormData((prevData) => ({
                        ...prevData,
                        tags: selectedOptions || [],
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="owners" className="form-label">
                    Owners
                  </label>
                  <Select
                    isMulti
                    id="owners"
                    options={userOptions}
                    value={formData.owners}
                    name="owners"
                    onChange={(selectedOptions) => {
                      setFormData((prevData) => ({
                        ...prevData,
                        owners: selectedOptions || [],
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="time">
                    Completion Time
                  </label>
                  <input
                    id="time"
                    type="number"
                    className="form-control"
                    value={formData.timeToComplete}
                    name="timeToComplete"
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    id="status"
                    className="form-select"
                    style={{ height: "2.5rem" }}
                    name="status"
                    onChange={handleChange}
                    value={formData.status}
                  >
                    <option value="">-- Select Status --</option>
                    {statusOptions?.map((status, index) => (
                      <option key={index}>{status}</option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
            {/* Modal Footer */}
            <div className="modal-footer">
              <button type="submit" form="newTaskForm" className="add-task">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TaskModal;
