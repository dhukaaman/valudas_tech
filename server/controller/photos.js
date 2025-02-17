const connectDB = require("../database/connection");

// getting photos
const getPhotos = async (req, res) => {
  try {
    const Que = `SELECT * FROM photos`;
    connectDB.query(Que, (err, data) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ message: "error got from getting photos" });
      }
      return res.json(data);
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "intrnal server error " });
  }
};

// inserting photos
const insertPhotos = async (req, res) => {
  try {
    const portfolio_photo = req.file.filename;

    const Que = `INSERT INTO photos (portfolio_photo) VALUES (?)`;
    const data = [portfolio_photo];

    connectDB.query(Que, data, (err) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ message: "error got from inserting image" });
      }
      return res.sendStatus(200);
    });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ message: "internel server error" });
  }
};

// updating photos
const updatePhotos = async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio_photo = req.file.filename;

    const Que = `UPDATE photos SET portfolio_photo =?  WHERE id =?`;
    const data = [portfolio_photo, id];

    connectDB.query(Que, data, (err) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ message: "error got from updating photos" });
      }

      return res.sendStatus(200);
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(400)
      .json({ message: "internel server error from updating photos" });
  }
};

// deleting photos
const deletePhotos = async (req, res) => {
  try {
    const { id } = req.params;
    const Que = `DELETE FROM photos WHERE id = ?`;

    connectDB.query(Que, [id], (err) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ message: "error got from deleting photosw" });
      }
      return res.sendStatus(200);
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(400)
      .json({ message: "internel server error from deleting photos" });
  }
};

module.exports = {
  getPhotos,
  insertPhotos,
  updatePhotos,
  deletePhotos,
};
