const cron = require("node-cron");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const apiKey = "j8jDDK5I8IvxE4pRheZz0HMDSXW9hkAG";

module.exports = (app) => {
  const Encuestas_satisfaccion = app.db.models.Encuestas_satisfaccion;
  const Turnos_satisfaccion = app.db.models.Turnos_satisfaccion;

  /**
   *
   *  METODOS
   *
   */

  app
    .route("/api/Encuestas_satisfaccion")
    .get((req, res) => {
      if (!req.headers.apikey) {
        return res.status(403).send({
          error: "Forbidden",
          message: "Tu petición no tiene cabecera de autorización",
        });
      }

      if (req.headers.apikey === apiKey) {
        Encuestas_satisfaccion.findAll({
          include: [
            {
              model: Turnos_satisfaccion,
            },
          ],
          order: [["createdAt", "DESC"]],
        })
          .then((result) => res.json(result))
          .catch((error) => {
            res.status(402).json({
              msg: error,
            });
          });
      } else {
        return res.status(403).send({
          error: "Forbidden",
          message: "Cabecera de autorización inválida",
        });
      }
    })
    .post((req, res) => {
      if (!req.headers.apikey) {
        return res.status(403).send({
          error: "Forbidden",
          message: "Tu petición no tiene cabecera de autorización",
        });
      }

      if (req.headers.apikey === apiKey) {
        console.log(req.body);
        Encuestas_satisfaccion.create(req.body)
          .then((result) =>
            res.json({
              status: "success",
              body: result,
            })
          )
          .catch((error) =>
            res.json({
              status: "error",
              body: error,
            })
          );
      } else {
        return res.status(403).send({
          error: "Forbidden",
          message: "Cabecera de autorización inválida",
        });
      }
    });

  // Obtener la encuesta por COD_TURNO
  app.route("/api/Encuestas_satisfaccion/:COD_TURNO").get((req, res) => {
    if (!req.headers.apikey) {
      return res.status(403).send({
        error: "Forbidden",
        message: "Tu petición no tiene cabecera de autorización",
      });
    }

    if (req.headers.apikey === apiKey) {
      Encuestas_satisfaccion.findAll({
        where: req.params,
        include: [
          {
            model: Turnos_satisfaccion,
          },
        ],
      })
        .then((result) => res.json(result))
        .catch((error) => {
          res.status(404).json({
            msg: error.message,
          });
        });
    } else {
      return res.status(403).send({
        error: "Forbidden",
        message: "Cabecera de autorización inválida",
      });
    }
  });

  // Trae la cantidad de turnos enviados por rango de fecha desde hasta
  app.route("/api/Encuestas_satisfaccionFecha").post((req, res) => {
    if (!req.headers.apikey) {
      return res.status(403).send({
        error: "Forbidden",
        message: "Tu petición no tiene cabecera de autorización",
      });
    }

    if (req.headers.apikey === apiKey) {
      let fechaHoy = new Date().toISOString().slice(0, 10);
      let { fecha_desde, fecha_hasta } = req.body;

      if (fecha_desde === "" && fecha_hasta === "") {
        fecha_desde = fechaHoy;
        fecha_hasta = fechaHoy;
      }

      if (fecha_hasta == "") {
        fecha_hasta = fecha_desde;
      }

      if (fecha_desde == "") {
        fecha_desde = fecha_hasta;
      }

      console.log(req.body);

      Encuestas_satisfaccion.findAll({
        where: {
          createdAt: {
            [Op.between]: [
              fecha_desde + " 00:00:00",
              fecha_hasta + " 23:59:59",
            ],
          },
        },
        include: [
          {
            model: Turnos_satisfaccion,
          },
        ],
        order: [["createdAt", "DESC"]],
      })
        .then((result) => res.json(result))
        .catch((error) => {
          res.status(402).json({
            msg: error.menssage,
          });
        });
    } else {
      return res.status(403).send({
        error: "Forbidden",
        message: "Cabecera de autorización inválida",
      });
    }
  });

  // Obtener la encuesta por NRO DE CI del cliente
  // app.route("/api/Encuestas_satisfaccion/cedula/:pregunta1").get((req, res) => {
  //   Encuestas_satisfaccion.findAll({
  //     where: req.params,
  //     include: [
  //       {
  //         model: Turnos_satisfaccion,
  //       },
  //     ],
  //   })
  //     .then((result) => res.json(result))
  //     .catch((error) => {
  //       res.status(404).json({
  //         msg: error.message,
  //       });
  //     });
  // });

  // PAGINATION
  app.route("/api/Encuestas_satisfaccionFiltered").post((req, res) => {
    if (!req.headers.apikey) {
      return res.status(403).send({
        error: "Forbidden",
        message: "Tu petición no tiene cabecera de autorización",
      });
    }

    if (req.headers.apikey === apiKey) {
      var search_keyword = req.body.search.value
        .replace(/[^a-zA-Z 0-9.]+/g, "")
        .split(" ");

      return Encuestas_satisfaccion.count().then((counts) => {
        var condition = [];

        for (var searchable of search_keyword) {
          if (searchable !== "") {
            condition.push({
              pregunta1: {
                [Sequelize.Op.iLike]: `%${searchable}%`,
              },
            });
          }
        }

        var result = {
          data: [],
          recordsTotal: 0,
          recordsFiltered: 0,
        };

        if (!counts) {
          return res.json(result);
        }

        result.recordsTotal = counts;

        Encuestas_satisfaccion.findAndCountAll({
          offset: req.body.start,
          limit: req.body.length,
          where: {
            [Sequelize.Op.or]:
              condition.length > 0
                ? condition
                : [{ pregunta1: { [Sequelize.Op.iLike]: "%%" } }],
          },
          include: [
            {
              model: Turnos_satisfaccion,
              attributes: [
                "CLIENTE",
                "NRO_CERT",
                "SUCURSAL",
                "NOMBRE_COMERCIAL",
                "FECHA",
              ],
            },
          ],
          order: [["id_Encuestas_satisfaccion", "DESC"]],
        })
          .then((response) => {
            result.recordsFiltered = response.count;
            result.data = response.rows;
            res.json(result);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
          });
      });
    } else {
      return res.status(403).send({
        error: "Forbidden",
        message: "Cabecera de autorización inválida",
      });
    }
  });
};
