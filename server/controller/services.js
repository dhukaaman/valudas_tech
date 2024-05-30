const connectDB = require("../database/connection");

// get
const getServices = async (req, res) => {
  try {
    const Que = `SELECT * FROM services`;
    connectDB.query(Que, (err, data) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ message: "error got from getting services" });
      }
      return res.json(data);
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "intrnal server error " });
  }
};

//post
const postServices = async (req, res) => {
  try {
    const { service_name, service_tagline, service_description } = req.body;

    const Que = `INSERT INTO services (service_name, service_tagline, service_description) VALUES (?,?,?)`;
    const data = [service_name, service_tagline, service_description];

    connectDB.query(Que, data, (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Error posting services" });
      }
      return res.sendStatus(200);
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// update
const updateServices = async (req, res) => {
  try {
    const { id } = req.params;
    const { service_name, service_tagline, service_description } = req.body;

    const Que =
      "UPDATE `services` SET `service_name`=?, `service_tagline` =?, `service_description` =? WHERE `id`=?";

    const data = [service_name, service_tagline, service_description, id];

    connectDB.query(Que, data, (err) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ message: "error got from updating services" });
      }
      return res.sendStatus(200);
    });
  } catch (error) {
    console.error(err.message);
    return res.status(500).json({ message: "internal server error" });
  }
};

// delete
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const Que = `DELETE FROM services WHERE id = ?`;

    connectDB.query(Que, [id], (err) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ message: "error got form deleting service" });
      }
      return res.sendStatus(200);
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "internal serever error" });
  }
};

// getting data with serviceId
const getParentData = async (req, res) => {
  try {
    const Que = `SELECT * FROM services WHERE services_id = 0`;

    connectDB.query(Que, (err, data) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ message: "error got from getting services parent data " });
      }
      return res.json(data);
    });
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  getServices,
  postServices,
  updateServices,
  deleteService,
  getParentData,
};
