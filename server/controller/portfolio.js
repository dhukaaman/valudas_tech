const connectDB = require("../database/connection");

// Getting portfolio data
const getPortfolio = async (req, res) => {
  try {
    const query = `SELECT * FROM portfolio`;

    connectDB.query(query, (err, data) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ message: "Error retrieving portfolio data" });
      }
      return res.json(data);
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// inserting portfolio data
const insertPortfolio = async (req, res) => {
  try {
    const thumbnail = req.files.thumbnail
      ? req.files.thumbnail[0].filename
      : null;

    const {
      title,
      short_description,
      company_name,
      portfolio_photos,
      service_id,
      industry_id,
      technology_ids,
    } = req.body;

    // Insert into portfolio table
    const Que = `INSERT INTO portfolio (thumbnail, title, short_description, company_name, portfolio_photos, service_id, industry_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const portfolioData = [
      thumbnail,
      title,
      short_description,
      company_name,
      portfolio_photos,
      service_id,
      industry_id,
    ];

    connectDB.query(Que, portfolioData, (err, result) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ message: "Error inserting portfolio data" });
      }

      // Get the last inserted portfolio ID
      const portfolioId = result.insertId;

      // Get technology IDs based on technology names
      const tech_id_query = `SELECT id FROM technologies WHERE technology_name IN (?)`;
      connectDB.query(tech_id_query, [technology_ids], (err, techResults) => {
        if (err) {
          console.error(err.message);
          return res
            .status(500)
            .json({ message: "Error retrieving technology IDs" });
        }

        const ff = techResults[0].id;
        console.log(ff);
        // Insert into port_serv_tech table for each technology
        const junc_Ids = `INSERT INTO port_serv_tech (portfolio_id, service_id, technology_id) VALUES (?, ?, ?)`;
        const insertPromises = techResults.map((tech) => {
          return new Promise((resolve, reject) => {
            connectDB.query(
              junc_Ids,
              [portfolioId, service_id, tech.id],
              (err) => {
                if (err) {
                  console.error(err.message);
                  reject(err);
                } else {
                  resolve();
                }
              }
            );
          });
        });

        Promise.all(insertPromises)
          .then(() => {
            res.status(200).json({ message: "Added successfully" });
          })
          .catch((error) => {
            console.error(error.message);
            return res
              .status(500)
              .json({ message: "Error inserting portfolio data" });
          });
      });
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Updating portfolio
const updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params, "req.params");
    const {
      title,
      short_description,
      company_name,
      service_ids,
      technology_ids,
      portfolio_photos,
    } = req.body;

    console.log(req.body, "req.body");

    let thumbnail;
    if (req.files && req.files.thumbnail) {
      thumbnail = req.files.thumbnail[0].filename;
    } else {
      thumbnail = req.body.thumbnail || null;
    }

    const updatePortfolioQuery = `UPDATE portfolio SET thumbnail = ?, title = ?, short_description = ?, company_name = ?, portfolio_photos = ? WHERE id = ?`;
    const portfolioData = [
      thumbnail,
      title,
      short_description,
      company_name,
      portfolio_photos,
      id,
    ];

    connectDB.query(updatePortfolioQuery, portfolioData, async (err) => {
      if (err) {
        console.error("Error updating portfolio data:", err.message);
        return res
          .status(500)
          .json({ message: "Error updating portfolio data" });
      }

      // Delete existing associations in port_serv_tech
      const deletePortServTechQuery = `DELETE FROM port_serv_tech WHERE portfolio_id = ?`;
      connectDB.query(deletePortServTechQuery, [id], (err) => {
        if (err) {
          console.error(
            "Error deleting port_serv_tech associations:",
            err.message
          );
          return res
            .status(500)
            .json({ message: "Error updating portfolio data" });
        }

        // Insert new associations in port_serv_tech
        const insertPortServTechQuery = `INSERT INTO port_serv_tech (portfolio_id, service_id, technology_id) VALUES ?`;
        const portServTechData = [];

        service_ids.forEach((service_id) => {
          technology_ids.forEach((technology_id) => {
            portServTechData.push([id, service_id, technology_id]);
          });
        });

        if (portServTechData.length > 0) {
          connectDB.query(
            insertPortServTechQuery,
            [portServTechData],
            (err) => {
              if (err) {
                console.error(
                  "Error inserting port_serv_tech associations:",
                  err.message
                );
                return res
                  .status(500)
                  .json({ message: "Error updating portfolio data" });
              }
              res.sendStatus(200);
            }
          );
        } else {
          res.sendStatus(200);
        }
      });
    });
  } catch (error) {
    console.error("Error updating portfolio", error);
    res.status(500).json({ message: "Error updating portfolio" });
  }
};

// Deleting portfolio
const deletePortfolio = async (req, res) => {
  try {
    const { id: portfolio_id } = req.params;

    const deletePortServTechQuery = `DELETE FROM port_serv_tech WHERE portfolio_id = ?`;
    connectDB.query(deletePortServTechQuery, [portfolio_id], (err) => {
      if (err) {
        console.error(
          "Error deleting port_serv_tech associations:",
          err.message
        );
        return res.status(500).json({ message: "Error deleting portfolio" });
      }

      const deletePortfolioQuery = `DELETE FROM portfolio WHERE id = ?`;
      connectDB.query(deletePortfolioQuery, [portfolio_id], (err) => {
        if (err) {
          console.error("Error deleting portfolio:", err.message);
          return res.status(500).json({ message: "Error deleting portfolio" });
        }
        res.sendStatus(200);
      });
    });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPortfolio,
  insertPortfolio,
  updatePortfolio,
  deletePortfolio,
};
