import { useState } from "react";
import "../css/tasks.css";
import useTeamContext from "../contexts/TeamContext";

const TeamModal = () => {
  const { addTeam } = useTeamContext();
  const [succcess, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTeam = {
      name: formData.name,
      description: formData.description,
    };

    try {
      await addTeam(newTeam);
      setFormData({
        name: "",
        description: "",
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 1000);
    } catch (error) {
      console.log(formData);

      console.log("Failed to add team ...: ", error.message);
    }
  };
  return (
    <>
      <button
        className="addTeam"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Add New Team +
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
                Add New Team
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="close"
              ></button>
            </div>
            {/* Modal Body */}
            <div className="modal-body">
              <form id="newTeamForm" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="description">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </form>
            </div>
            {/* Modal Footer */}
            <div className="modal-footer">
              <button type="submit" form="newTeamForm" className="add-task">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TeamModal;
