const appRoutes = require('express').Router()
const axios = require('axios')
const mongoose = require('mongoose')
var cors = require('cors')
const nodemailer = require('nodemailer')

const Prospect = require('../models/Prospect')
const config = require('../utils/config')

appRoutes.get('/', (request, response) => {
  response.send('Hola Mundo!!!')
})

appRoutes.get('/today-is', (request, response) => {
  const dt1 = new Date()
  const dt2 = new Intl.DateTimeFormat('es-ES',{dateStyle: 'full'}).format(dt1)
  response.json({ hoyes: dt2 })
})

appRoutes.get('/prospects', (request, response) => {
  let sql = "select	sign"
  sql += " FROM prospects a"
  sql += " WHERE id_personal = '3-722-1667'"

  const params = [request.params.id_personal];
  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      const firma = results[0].sign.toString()
      response.json({sign: firma})
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.post('/apc-historial', async (req, res) => {

  await mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err))

    const {
      Nombre,
      Apellido_Paterno,
      Email,
    } = req.body

  const newProspect =  new Prospect({
    Email,
    Nombre,
    Apellido_Paterno,
  })

  await newProspect.save()
  let ID = newProspect._id
  console.log(ID)

  res.send(ID)
})
appRoutes.get('/tracking/:email', cors(), (req, res) => {

  const { email } = req.params

  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
  })
 
  Prospect.find({ "Email": email }, '_id', function (err, data) {
    if (err) return handleError(err);
    res.send(data)
  })
})


appRoutes.post('/clientify-token', async (req, res) => {

  axios({
    method: "post",
    url: "https://api.clientify.net/v1/api-auth/obtain_token/", 
    data: {
      "username": "rsanchez2565@gmail.com",
      "password": "Acsorat25"
    },
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(result => res.json(result.data))
  .catch(error => console.log('error', error))
})


appRoutes.post('/email', async (req, res) => {

  const { email: euser, asunto, mensaje, telefono, monto, nombre, banco } = req.body

  let emails = null
  await axios.get(`http://localhost:3001/api/entities_f/${banco}`)
  .then(res => {
    const result = res.data
    emails = result[0].emails
  }).catch(() => {
    emails = null
  })

  if(emails === undefined) emails = null
  if(!emails) {
    console.log("Debe configurar lista de Emails en la Entidad Financiera.")
    return
  }
  emails += ",rsanchez2565@gmail.com"

  nodemailer.createTestAccount(( err, account ) => {
    const htmlEmail = `
      <h3>Nuevo Prospecto desde Finanservs.com</h3>
      <ul>
        <li>Email: ${euser}</li>
        <li>Nombre: ${nombre}</li>
        <li>Teléfono: ${telefono}</li>
        <li>Monto Solicitado: ${monto}</li>
      </ul>
      <h3>Mensaje</h3>
      <p>${mensaje}</p>
    `
  
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: config.EMAIL_PORT,
      auth: {
        user: config.EMAIL_USER, 
        pass: config.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    let mailOptions = {
      from: config.EMAIL_FROM,
      to: emails,
      subject: asunto,
      text: mensaje,
      html: htmlEmail
    }

    transporter.sendMail(mailOptions, ( err, info ) => {
      if(err) {
        return console.error("Estamos aqui", err)
      }
      console.log("Mensaje enviado: %s", info.envelope)
      console.log("Url del mensaje: %s", nodemailer.getTestMessageUrl(info))
    })
  })

})


appRoutes.post('/clientify', async (req, res) => {
  const { body } = req
  const { token, Tracking, entidad_seleccionada, prestamo_opciones,  
          first_name, last_name, email, phone, fecha_nacimiento, contrato_laboral, 
          meses_trabajo_actual, meses_trabajo_anterior, Salario, Sector, acepta_terminos_condiciones, 
          Institucion, Ocupacion, Profesion, Planilla, Genero, tipo_residencia, mensualidad_casa } = body

  const wDate = date => (date.getFullYear()+ "-" + (date.getMonth() + 1)  + "-" +  date.getDate())
  const wCapit = text => (text.toLowerCase().split(' ').map(w => w[0].toUpperCase() + w.substr(1)).join(' '))

  let Monto = 0, Letra = 0, Plazo = 0, Efectivo = 0

  const opciones = JSON.parse(prestamo_opciones)
  if(opciones.length) {
    const opcion = opciones.filter((item) => item.bank === entidad_seleccionada)
    Monto = opcion[0].loan
    Letra = opcion[0].monthlyFee
    Plazo = opcion[0].term
    Efectivo = opcion[0].cashOnHand
  }

  let wbanco = 'N/A'
  await axios.get(`http://localhost:3001/api/entities_f/${entidad_seleccionada}`)
  .then(res => {
    const result = res.data
    wbanco = result[0].name
  }).catch(() => {
    wbanco = 'N/A'
  })
  if(wbanco == undefined) wbanco = 'N/A'

  let wprof = 'N/A'
  await axios.get(`http://localhost:3001/api/profesions/${Profesion}`)
  .then(res => {
    const result = res.data
    wprof = result[0].profesion
  }).catch(() => {
    wprof = 'N/A'
  })
  if(wprof == undefined) wprof = 'N/A'

  let wocup = 'N/A'
  let URL = ""
  if(Profesion === '2') URL =  `http://localhost:3001/api/profesions_lw/${Ocupacion}`
  else if(Profesion === '4') URL = `http://localhost:3001/api/institutions/${Institucion}`
  else if(Profesion === '5') URL = `http://localhost:3001/api/profesions_acp/${Ocupacion}`
  else if(Profesion === '6') URL = `http://localhost:3001/api/ranges_pol/${Ocupacion}`
  else if(Profesion === '7') URL = `http://localhost:3001/api/planillas_j/${Planilla}`
  
  if(URL.length) {
    await axios.get(URL)
    .then(res => {
      const result = res.data
      wocup = result[0].ocupacion
    }).catch(() => {
      wocup = 'N/A'
    })
  }
  if(wocup == undefined) wocup = 'N/A'

  raw = JSON.stringify({
    first_name, 
    last_name, 
    email, 
    phone, 
    "birthday": wDate(new Date(fecha_nacimiento)),
    "google_id": "google_id",
    "facebook_id": "facebook_id",
    "custom_fields": [
      {"field": "Tracking", "value": Tracking}, 
      {"field": "contrato_laboral", "value": contrato_laboral}, 
      {"field": "meses_trabajo_actual", "value": Number(meses_trabajo_actual)},
      {"field": "meses_trabajo_anterior", "value": Number(meses_trabajo_anterior)},
      {"field": "Salario", "value": Number(Salario)},
      {"field": "Sector", "value": Sector}, 
      {"field": "Profesion", "value": wprof}, 
      {"field": "Ocupacion", "value": wocup}, 
      {"field": "Genero", "value": Genero},
      {"field": "acepta_terminos_condiciones", "value": acepta_terminos_condiciones},
      {"field": "tipo_residencia", "value": tipo_residencia === '1' ? "Casa Propia": 
                                            tipo_residencia === '2' ? "Padres o Familiares": 
                                            tipo_residencia === '3' ? "Casa Hipotecada": "Casa Alquilada"},
      {"field": "mensualidad_casa", "value": Number(mensualidad_casa)},
      {"field": "entidad_seleccionada", "value": wbanco},

      {"field": "Monto", "value": Number(Monto)},
      {"field": "Letra", "value": Number(Letra)},
      {"field": "Plazo", "value": Number(Plazo)}
    ]
  })

  const url = "https://api.clientify.net/v1/contacts/"
  const headers = {
    "Authorization": `Token ${token}`,
    "Content-Type": "application/json"
  }

  // console.log(raw)

  axios({
    method: "POST",
    url, 
    data: raw,
    headers: headers,
    redirect: 'follow'
  })
  .then(result => res.json(result.data))
  // .then(result => console.log(result.data))
  .catch(error => console.log('error', error))

})


appRoutes.put('/clientify', async (req, res) => {
  const { body } = req

  const { token, ID, Tracking, entidad_seleccionada, prestamo_opciones,
          first_name, last_name, email, phone, fecha_nacimiento, contrato_laboral, 
          meses_trabajo_actual, meses_trabajo_anterior, Salario, Sector, acepta_terminos_condiciones, 
          Institucion, Ocupacion, Profesion, Planilla, Genero, tipo_residencia, mensualidad_casa,

          donde_trabaja = 'N/A', Puesto = 'N/A', Cedula = 'N/A', 
          img_cedula = 'N/A',  img_ficha_css = 'N/A', img_servicio_publico = 'N/A', img_carta_trabajo = 'N/A', 
          img_comprobante_pago = 'N/A', img_autoriza_apc = 'N/A', img_referencias_apc = 'N/A', province, district, county, street = 'N/A'
        
        } = body

  const wDate = date => (date.getFullYear()+ "-" + (date.getMonth() + 1)  + "-" +  date.getDate())
  const wCapit = text => (text.toLowerCase().split(' ').map(w => w[0].toUpperCase() + w.substr(1)).join(' '))

  let Monto = 0, Letra = 0, Plazo = 0, Efectivo = 0

  const opciones = JSON.parse(prestamo_opciones)
  if(opciones.length) {
    const opcion = opciones.filter((item) => item.bank === entidad_seleccionada)
    Monto = opcion[0].loan
    Letra = opcion[0].monthlyFee
    Plazo = opcion[0].term
    Efectivo = opcion[0].cashOnHand
  }

  let wbanco = 'N/A'
  await axios.get(`http://localhost:3001/api/entities_f/${entidad_seleccionada}`)
  .then(res => {
    const result = res.data
    wbanco = result[0].name
  }).catch(() => {
    wbanco = 'N/A'
  })
  if(wbanco === undefined) wbanco = 'N/A'

  let wprof = 'N/A'
  await axios.get(`http://localhost:3001/api/profesions/${Profesion}`)
  .then(res => {
    const result = res.data
    wprof = result[0].profesion
  }).catch(() => {
    wprof = 'N/A'
  })
  if(wprof == undefined) wprof = 'N/A'

  let wocup = 'N/A'
  let URL = ""
  if(Profesion === '2') URL =  `http://localhost:3001/api/profesions_lw/${Ocupacion}`
  else if(Profesion === '4') URL = `http://localhost:3001/api/institutions/${Institucion}`
  else if(Profesion === '5') URL = `http://localhost:3001/api/profesions_acp/${Ocupacion}`
  else if(Profesion === '6') URL = `http://localhost:3001/api/ranges_pol/${Ocupacion}`
  else if(Profesion === '7') URL = `http://localhost:3001/api/planillas_j/${Planilla}`
  
  if(URL.length) {
    await axios.get(URL)
    .then(res => {
      const result = res.data
      wocup = result[0].ocupacion
    }).catch(() => {
      wocup = 'N/A'
    })
  }
  if(wocup == undefined) wocup = 'N/A'

  let wprov = 'N/A'
  await axios.get(`http://localhost:3001/api/provinces/${province}`)
  .then(res => {
    const result = res.data
    wprov = result[0].province
  }).catch(() => {
    wprov = 'N/A'
  })
  if(wprov == undefined) wprov = 'N/A'

  let wdist = 'N/A'
  await axios.get(`http://localhost:3001/api/districts/${district}`)
  .then(res => {
    const result = res.data
    wdist = result[0].district
  }).catch(() => {
    wdist = 'N/A'
  })
  if(wdist == undefined) wdist = 'N/A'


  raw = JSON.stringify({
    first_name, 
    last_name, 
    email, 
    phone, 
    "birthday": wDate(new Date(fecha_nacimiento)),
    "google_id": "google_id",
    "facebook_id": "facebook_id",
    "addresses": [
      {
        "street": street,
        "city": (wdist || '').length > 3 ? wCapit(wdist) : "N/A",
        "state": (wprov || '').length > 3 ? wCapit(wprov) : "N/A",
        "country": "Panamá",
        "type": 5
      }
    ],
    "custom_fields": [
      {"field": "Tracking", "value": Tracking}, 
      {"field": "donde_trabaja", "value": donde_trabaja},
      {"field": "Puesto", "value": Puesto},
      {"field": "tipo_residencia", "value": tipo_residencia === '1' ? "Casa Propia": 
                                            tipo_residencia === '2' ? "Padres o Familiares": 
                                            tipo_residencia === '3' ? "Casa Hipotecada": "Casa Alquilada"},
      {"field": "mensualidad_casa", "value": Number(mensualidad_casa)},
      {"field": "Cedula", "value": Cedula},
      {"field": "img_cedula", "value": img_cedula},
      {"field": "img_servicio_publico", "value": img_servicio_publico},
      {"field": "img_ficha_css", "value": img_ficha_css},
      {"field": "img_carta_trabajo", "value": img_carta_trabajo},
      {"field": "img_comprobante_pago", "value": img_comprobante_pago},
      {"field": "img_autoriza_apc", "value": img_autoriza_apc},
      {"field": "img_referencias_apc", "value": img_referencias_apc},

      {"field": "contrato_laboral", "value": contrato_laboral}, 
      {"field": "meses_trabajo_actual", "value": Number(meses_trabajo_actual)},
      {"field": "meses_trabajo_anterior", "value": Number(meses_trabajo_anterior)},
      {"field": "Salario", "value": Number(Salario)},
      {"field": "Sector", "value": Sector}, 
      {"field": "Profesion", "value": wprof}, 
      {"field": "Ocupacion", "value": wocup}, 
      {"field": "Genero", "value": Genero},
      {"field": "acepta_terminos_condiciones", "value": acepta_terminos_condiciones},

      {"field": "entidad_seleccionada", "value": wbanco},
      {"field": "Monto", "value": Monto},
      {"field": "Letra", "value": Letra},
      {"field": "Plazo", "value": Plazo}
    ]
  })

  // console.log(raw)

  const url = `https://api.clientify.net/v1/contacts/${ID}`
  const headers = {
    "Authorization": `Token ${token}`,
    "Content-Type": "application/json"
  }

  axios({
    method: "PUT",
    url, 
    data: raw,
    headers: headers,
    redirect: 'follow'
  })
  .then(result => res.json(result.data))
  // .then(result => console.log(result.data))
  .catch(error => console.log('error', error))

})

appRoutes.post('/clientify-rechazo', async (req, res) => {
  const { body } = req
  const { token, Tracking } = body

  raw = JSON.stringify({
    "custom_fields": [
      {"field": "Tracking", "value": Tracking}
    ]
  })

  const url = "https://api.clientify.net/v1/contacts/"
  const headers = {
    "Authorization": `Token ${token}`,
    "Content-Type": "application/json"
  }

  // console.log(raw)

  axios({
    method: "POST",
    url, 
    data: raw,
    headers: headers,
    redirect: 'follow'
  })
  .then(result => res.json(result.data))
  // .then(result => console.log(result.data))
  .catch(error => console.log('error', error))

})


appRoutes.put('/clientify-rechazo', async (req, res) => {
  const { body } = req
  const { token, ID = 0, Tracking } = body

  raw = JSON.stringify({
    "custom_fields": [
      {"field": "Tracking", "value": Tracking}
    ]
  })

  const url = `https://api.clientify.net/v1/contacts/${ID}`
  const headers = {
    "Authorization": `Token ${token}`,
    "Content-Type": "application/json"
  }

  axios({
    method: "PUT",
    url, 
    data: raw,
    headers: headers,
    redirect: 'follow'
  })
  .then(result => res.json(result.data))
  // .then(result => console.log(result.data))
  .catch(error => console.log('error', error))

})


appRoutes.post('/tracking', async (req, res) => {

  await mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err))

    const {
      Numero_Id,
      Nombre,
      Segundo_Nombre,
      Apellido_Paterno,
      Apellido_Materno,
      Email,
      Celular,
      Genero,
      Nacionalidad,
      Fecha_Nac,
      Terminos_Condiciones,
      Estado_Civil,
      Telefono_Casa,
      Provincia,
      Distrito,
      Corregimiento,
      Calle_No,

      Sector, 
      Profesion, 
      Institucion,
      Tipo_Residencia, 
      Tipo_Contrato_Res, 
      Mensualidad,
      Historial_Credito, 
      Frecuencia_Pago,

      Salario, 
      Servicios_Profesionales, 
      Viaticos,
      Tipo_Contrato,
      Meses_Trabajo_Actual,
      Compañia_Trabajo,
      Cargo,
      Direccion_Trabajo,
      Telefono_Trabajo,
      Extension_Trabajo,
      Trabajo_Anterior,
      Meses_Trabajo_Anterior,
    } = req.body

  // Historial_Credito, 
  const newProspect =  new Prospect({
    Email,
    Numero_Id,
    Prospect: {
      Nombre,
      Segundo_Nombre,
      Apellido_Paterno,
      Apellido_Materno,
      Email,
      Celular,
      Genero,
      Nacionalidad,
      Fecha_Nac,
      Terminos_Condiciones,
      Nacionalidad,
      Estado_Civil,
      Telefono_Casa,
      Provincia,
      Distrito,
      Corregimiento,
      Calle_No
    },

    Info: {
      Sector, 
      Profesion, 
      Institucion,
      Tipo_Residencia, 
      Tipo_Contrato_Res,
      Mensualidad,
      Historial_Credito,
      Frecuencia_Pago,
    },
    
    Ingresos: {
      Salario, 
      Servicios_Profesionales, 
      Viaticos
    },

    Trabajo_Actual: {
      Tipo_Contrato,
      Meses_Trabajo_Actual,
      Compañia_Trabajo,
      Cargo,
      Direccion_Trabajo,
      Telefono_Trabajo,
      Extension_Trabajo,
      Trabajo_Anterior,
      Meses_Trabajo_Anterior,
    },
  })

  let ID = newProspect._id
  await newProspect.save()

  res.send({"ID": ID})
})


appRoutes.put('/tracking', async (req, res) => {

  await mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err))

  const {
    Numero_Id,
    Nombre,
    Segundo_Nombre,
    Apellido_Paterno,
    Apellido_Materno,
    Email,
    Celular,
    Genero,
    Nacionalidad,
    Fecha_Nac,
    Terminos_Condiciones,
    Estado_Civil,
    Telefono_Casa,
    Provincia,
    Distrito,
    Corregimiento,
    Calle_No,

    Sector, 
    Profesion, 
    Institucion,
    Ocupacion,
    Planilla_CSS,
    Tipo_Residencia,  
    Mensualidad,
    Historial_Credito, 
    Frecuencia_Pago,

    Salario, 
    Servicios_Profesionales, 
    Viaticos,
    Tipo_Contrato,
    Meses_Trabajo_Actual,
    Compania_Trabajo,
    Cargo,
    Direccion_Trabajo,
    Telefono_Trabajo,
    Extension_Trabajo,
    Trabajo_Anterior,
    Meses_Trabajo_Anterior,

    Entidad_Seleccionada,
    Prestamo_Opciones,

    Img_ID,
    Img_Ficha_CSS,
    Img_Servicio_Publico,
    Img_Carta_Trabajo,
    Img_Comprobante_Pago,
    Img_Autoriza_APC,
    Img_Referencias_APC,
    
    Ref_Familia_Nombre,
    Ref_Familia_Apellido,
    Ref_Familia_Parentesco,
    Ref_Familia_Telefono,
    Ref_Familia_Casa_No,
    Ref_Familia_Empresa,
    Ref_Familia_Empresa_Telefono,
    Ref_Familia_Empresa_Extension,

    Ref_No_Familia_Nombre,
    Ref_No_Familia_Apellido,
    Ref_No_Familia_Parentesco,
    Ref_No_Familia_Telefono,
    Ref_No_Familia_Casa_No,
    Ref_No_Familia_Empresa,
    Ref_No_Familia_Empresa_Telefono,
    Ref_No_Familia_Empresa_Extension,

    id_param,
    Tracking,
  } = req.body
  
  // Historial_Credito, 
  const udtDatos =  {
    Email,
    Numero_Id,
    Tracking,
    Prospect: {
      Nombre,
      Segundo_Nombre,
      Apellido_Paterno,
      Apellido_Materno,
      Email,
      Celular,
      Genero,
      Nacionalidad,
      Fecha_Nac,
      Terminos_Condiciones,
      Nacionalidad,
      Estado_Civil,
      Telefono_Casa,
      Provincia,
      Distrito,
      Corregimiento,
      Calle_No
    },
    
    Info: {
      Sector, 
      Profesion, 
      Institucion,
      Ocupacion,
      Planilla_CSS,
      Tipo_Residencia, 
      Mensualidad,
      Historial_Credito,
      Frecuencia_Pago,
    },
    
    Ingresos: {
      Salario, 
      Servicios_Profesionales, 
      Viaticos
    },
    
    Entidad_Seleccionada,
    Prestamo_Opciones: Prestamo_Opciones ? JSON.parse(Prestamo_Opciones): "",
    Monto_Maximo: 0,

    Trabajo_Actual: {
      Tipo_Contrato,
      Meses_Trabajo_Actual,
      Compania_Trabajo,
      Cargo,
      Direccion_Trabajo,
      Telefono_Trabajo,
      Extension_Trabajo,
      Trabajo_Anterior,
      Meses_Trabajo_Anterior,
    },

    Documentos: {
      Img_ID,
      Img_Ficha_CSS,
      Img_Servicio_Publico,
      Img_Carta_Trabajo,
      Img_Comprobante_Pago,
      Img_Autoriza_APC,
      Img_Referencias_APC
    },

    Ref_Personal_Familia: {
      Ref_Familia_Nombre,
      Ref_Familia_Apellido,
      Ref_Familia_Parentesco,
      Ref_Familia_Telefono,
      Ref_Familia_Casa_No,
      Ref_Familia_Empresa,
      Ref_Familia_Empresa_Telefono,
      Ref_Familia_Empresa_Extension,
    },

    Ref_Personal_No_Familia: {
      Ref_No_Familia_Nombre,
      Ref_No_Familia_Apellido,
      Ref_No_Familia_Parentesco,
      Ref_No_Familia_Telefono,
      Ref_No_Familia_Casa_No,
      Ref_No_Familia_Empresa,
      Ref_No_Familia_Empresa_Telefono,
      Ref_No_Familia_Empresa_Extension,
    },
  }

  // console.log(udtDatos)
  try {
    const result = await Prospect.findByIdAndUpdate(id_param, udtDatos)
    // console.log(result)
    res.send(result)
  } catch(err)  {
    console.log(err)
    res.status(500).send(err)
  }
})

appRoutes.get('/tracking/:email', cors(), (req, res) => {

  const { email } = req.params

  // return res.send(email)

  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
  })
 
  Prospect.find({ "Email": email }, '_id', function (err, data) {
    if (err) return handleError(err);
    // 'athletes' contains the list of athletes that match the criteria.
    res.send(data)
  })
})

appRoutes.get('/tracking/id/:id', (req, res) => {

  const { id } = req.params

  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
  })
 
  Prospect.findById({ "_id": id }, function(err, data) {
    if(err){
        console.log(err)
    }
    else{
        res.send(data)
    }
  }) 
})

appRoutes.get('/tracking/delete/:id', (req, res) => {

  const { id } = req.params

  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
  })
 
  Prospect.findByIdAndRemove({ "_id": id }, function(err, result) {
    if(err){
        console.log(err)
    }
    else{
        res.send("Ok")
    }
  }) 
})

appRoutes.get('/tracking', (req, res) => {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
  })
 
  Prospect.find(function(err, data) {
      if(err){
          console.log(err)
      }
      else{
          res.send(data)
      }
  }) 
})

appRoutes.delete('/tracking', (req, res) => {
  const { id } = req.body
  Prospect.findByIdAndDelete(id, function (err) {
    if(err) console.log(err);
    console.log("Successful deletion");
    res.send("Ok!");
  });
});

appRoutes.post('/APC', (request, response) => {

  const { usuarioApc, claveApc, id, tipoCliente, productoApc, idMongo } = request.body

  const URL = "https://apirestapc20210918231653.azurewebsites.net/api/APCScore"
  // const URL = "http://localhost:5000/api/APCScore"

  const datos = []
  axios.post(URL,{"usuarioconsulta": usuarioApc, "claveConsulta": claveApc, "IdentCliente": id, "TipoCliente": tipoCliente, "Producto": productoApc})
  .then((res) => {
      const result = res.data
      const copia = {...result}

      if(result["estatus"] === "0") {
        datos.push({"status": false, "message": "Sin Referencias de Crédito!"})
        response.json(datos)
        return
      }

      let SCORE = "0"
      let PI = "0"
      let EXCLUSION = "0"
      if(result["sc"] !== null) {
        SCORE = result["sc"]["score"]
        PI = result["sc"]["pi"]
        EXCLUSION = result["sc"]["exclusion"]
      }

      Object.entries(result["det"]).forEach(([key, value]) => {
        if(value !== null) {
          value.status = true
          value.message = "Ok"
          value.score = SCORE
          value.pi = PI
          value.exclusion = EXCLUSION
          // delete value['montO_CODIFICADO']
          // delete value['coD_GRUPO_ECON']
          // delete value['tipO_ASOC']
          // delete value['montO_CODIFICADO']
          // delete value['feC_INICIO_REL']
          // delete value['feC_FIN_REL']
          // delete value['feC_ACTUALIZACION']
          datos.push(value)
        }
      });

      guardarRef(copia, idMongo)
      response.json(datos)
  }).catch((error) => {
      console.log(error)
      datos.push({"status": false, "message": "WS-APC No disponible."})
      response.json(datos)
  });
})


const guardarRef = async (refApc, idMongo) => {

  // console.log(refApc)
  const { nombre, apellido, idenT_CLIE, noM_ASOC, } = refApc.gen

  const Generales = {
    "Nombre": nombre + " " + apellido,
    "Id": idenT_CLIE,
    "Usuario": "WSACSORAT001",
    "Asociado": noM_ASOC
  }

  const Resumen = []
  Object.entries(refApc["res"]).forEach(([key, value]) => {
    if(value !== null) {
      const dato = {}
      for (var i in value) {
        switch(i) {
          case "relacion":
            dato.Relacion = value[i]
            break
          case "cantidad":
            dato.Cantidad = value[i]
            break
          case "monto":
            dato.Monto = value[i]
            break
          case "saldO_ACTUAL":
            dato.Saldo_Actual = value[i]
            break
          default:
            // code block
        }
      }
      Resumen.push(dato)
    }
  })

  const Referencias = []
  Object.entries(refApc["det"]).forEach(([key, value]) => {
    if(value !== null) {
      const dato = {}
      for (var i in value) {
        switch(i) {
          case "noM_ASOC":
            dato.Agente_Economico = value[i]
            break
          case "descR_CORTA_RELA":
            dato.Relacion = value[i]
            break
          case "montO_ORIGINAL":
            dato.Monto_Original = value[i]
            break
          case "saldO_ACTUAL":
            dato.Saldo_Actual = value[i]
            break
          case "nuM_REFER":
            dato.Referencia = value[i]
            break
          case "nuM_PAGOS":
            dato.Num_Pagos = value[i]
            break
          case "descR_FORMA_PAGO":
            dato.Forma_Pago = value[i]
            break
          case "importE_PAGO":
            dato.Letra = value[i]
            break
          case "montO_ULTIMO_PAGO":
            dato.Monto_Utimo_Pago = value[i]
            break
          case "feC_ULTIMO_PAGO":
            dato.Fec_Ultimo_pago = value[i]
            break
          case "descR_OBS_CORTA":
            dato.Observacion = value[i]
            break
          case "nuM_DIAS_ATRASO":
            dato.Dias_Atraso = value[i]
            break
          case "historia":
            dato.Historial = value[i]
            break
          case "feC_INICIO_REL":
            dato.Fec_Ini_Relacion = value[i]
            break
          case "feC_FIN_REL":
            dato.Fec_Vencimiento = value[i]
            break
          case "feC_ACTUALIZACION":
            dato.Fec_Actualiazacion = value[i]
            break
          default:
            // code block
        }
      }
      dato.Estado = "ACTULIZADA"
      dato.Fec_Prescripcion = ""
      Referencias.push(dato)
    }
  })

  const Ref_Canceladas = []
  Object.entries(refApc["ref"]).forEach(([key, value]) => {
    if(value !== null) {
      const dato = {}
      for (var i in value) {
        switch(i) {
          case "noM_ASOC":
            dato.Agente_Economico = value[i]
            break
          case "descR_CORTA_RELA":
            dato.Relacion = value[i]
            break
          case "montO_ORIGINAL":
            dato.Monto_Original = value[i]
            break
          case "nuM_REFER":
            dato.Referencia = value[i]
            break

          case "feC_INICIO_REL":
            dato.Fec_Ini_Relacion = value[i]
            break
          case "feC_FIN_REL":
            dato.Fec_Vencimiento = value[i]
            break
          case "feC_LIQUIDACION":
            dato.Fec_Cancelacion = value[i]
            break

          case "feC_ULTIMO_PAGO":
            dato.Fec_Ultimo_pago = value[i]
            break
          case "descR_OBS_CORTA":
            dato.Observacion = value[i]
            break
          case "historia":
            dato.Historial = value[i]
            break

          default:
            // code block
        }
      }
      dato.Fec_Prescripcion = ""
      Ref_Canceladas.push(dato)
    }
  })

  const Score = {
    Score: 0,
    PI: 0,
    Exclusion: ""
  }

  if(refApc["sc"] !== null) {
    Score.Score = refApc["sc"]["score"]
    Score.PI = refApc["sc"]["pi"]
    Score.Exclusion = refApc["sc"]["exclusion"]
  }

  // console.log(Generales)
  // console.log(Resumen)
  // console.log(Referencias)
  // console.log(Ref_Canceladas)
  // console.log(Score)

  const udtDatos = {
    APC: {
      Generales,
      Resumen,
      Referencias,
      Ref_Canceladas,
      Score
    }
  }

  await mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err))

  try {
    await Prospect.findByIdAndUpdate(idMongo, udtDatos, {new: true})
  } catch(err)  {
    console.log(err)
  }

  return udtDatos
}


appRoutes.get('/sectors', (request, response) => {
  const sql = "SELECT * FROM sectors"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/profesions', (request, response) => {
  const sql = "SELECT * FROM profesions"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})
appRoutes.get('/profesions/:id', (request, response) => {
  let sql = "SELECT name as profesion"
  sql += " FROM profesions"
  sql += " WHERE id = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})


appRoutes.get('/profesions_acp', (request, response) => {
  const sql = "SELECT id, titulo as name FROM profesions_acp"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})
appRoutes.get('/profesions_acp/:id', (request, response) => {
  let sql = "SELECT titulo as ocupacion"
  sql += " FROM profesions_acp"
  sql += " WHERE id = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/profesions_lw', (request, response) => {
  const sql = "SELECT id, titulo as name FROM profesions_lw"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})
appRoutes.get('/profesions_lw/:id', (request, response) => {
  let sql = "SELECT titulo as ocupacion"
  sql += " FROM profesions_lw"
  sql += " WHERE id = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/planillas_j', (request, response) => {
  const sql = "SELECT * FROM planillas_j"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})
appRoutes.get('/planillas_j/:id', (request, response) => {
  let sql = "SELECT name as ocupacion"
  sql += " FROM planillas_j"
  sql += " WHERE id = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/ranges_pol', (request, response) => {
  const sql = "SELECT id, name FROM ranges_pol WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})
appRoutes.get('/ranges_pol/:id', (request, response) => {
  let sql = "SELECT name as ocupacion"
  sql += " FROM ranges_pol"
  sql += " WHERE id = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})


appRoutes.get('/laboral_sector_institution', (request, response) => {
  const sql = "SELECT * FROM institutions"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})
appRoutes.get('/institution/:id', (request, response) => {
  let sql = "SELECT name as ocupacion"
  sql += " FROM institutions"
  sql += " WHERE id = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})


appRoutes.get('/laboral_sector', (request, response) => {
  let sql = "select a.id_profesion as id, short_name as sector, id_sector, c.name as name"
  sql += " from sector_profesion a"
  sql += " inner join sectors b on b.id=a.id_sector"
  sql += " inner join profesions c on c.id=a.id_profesion"
  sql += " where is_active = true;"
  
  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/laboral_sector_entity_f', (request, response) => {
  // let sql = "select a.id_code, b.id, short_name as sector, c.id, c.name as name,"
  let sql = "select id_ruta as ruta, id_sector, id_profesion,"
  sql += " descto_ship as discount_capacity,"
  sql += " descto_chip as discount_capacity_mortgage,"
  sql += " deuda_ship as debt_capacity,"
  sql += " deuda_chip as debt_capacity_mortgage,"
  sql += " plazo_max,"
  sql += " tasa,"
  sql += " comision,"
  sql += " salario_min,"
  sql += " tasa_servicio,"
  sql += " seg_vida,"
  sql += " feci,"
  sql += " itbms,"
  sql += " notaria,"
  sql += " factor,"
  sql += " letraRetenida,"
  sql += " gastoLegal,"
  sql += " timbres,"
  sql += " servicioDescto,"
  sql += " mount_min,"
  sql += " mount_max, min_antiguedad"
  sql += " from entity_params a"
  sql += " inner join entities_f d on d.id = a.id_entity_f"
  sql += " inner join sector_profesion b on b.id=a.id_sector_profesion"
  // sql += " where d.is_active = 1"
  // sql += " where a.id_entity_f = ? and a.id_code = ? and a.id_profesion = ?"

  const params = [request.params.id,  request.params.id2, request.params.id3];

  config.cnn.query(sql, params, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/laboral_status', (request, response) => {
  const sql = "SELECT name, is_active FROM laboral_status  WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/payment_types', (request, response) => {
  const sql = "SELECT * FROM payments"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

// OWNER = '1',
// PARENTS = '2',
// MORTGAGE = '3',
// RENT = '4'

appRoutes.get('/housing_types', (request, response) => {
  const sql = "SELECT * FROM housings  WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

// CAR_PURCHASE = '0',
// WEDDING = '1',
// HOME_IMPROVEMENTS = '2',
// SCHOOL = '3',
// TRAVEL = '4',
// TEENAGE_PARTY = '5'

appRoutes.get('/purpose', (request, response) => {
  const sql = "SELECT * FROM purposes WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/marital_status', (request, response) => {
  const sql = "SELECT id, name FROM civil_status"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})



appRoutes.get('/provinces', (request, response) => {
  const sql = "SELECT * FROM provinces"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})
appRoutes.get('/provinces/:id', (request, response) => {
  let sql = "SELECT name as province"
  sql += " FROM provinces"
  sql += " WHERE id = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})


appRoutes.get('/districts', (request, response) => {
  const sql = "SELECT * FROM districts"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})
appRoutes.get('/districts/:id', (request, response) => {
  let sql = "SELECT name as district"
  sql += " FROM districts"
  sql += " WHERE id = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})


appRoutes.get('/counties', (request, response) => {
  const sql = "SELECT * FROM counties"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})
appRoutes.get('/counties/:id', (request, response) => {
  let sql = "SELECT name as countie"
  sql += " FROM counties"
  sql += " WHERE id = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})


appRoutes.get('/type_documents', (request, response) => {
  const sql = "SELECT id, name, id_name FROM type_documents WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})


appRoutes.get('/terms_loan', (request, response) => {
  const sql = "SELECT id, name FROM terms_loan WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/nationality', (request, response) => {
  const sql = "SELECT id, name FROM nationality WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/entities_f', (request, response) => {
  const sql = "SELECT id, name, id_ruta FROM entities_f WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})
appRoutes.get('/entities_f/:id', (request, response) => {
  let sql = "SELECT name, emails"
  sql += " FROM entities_f"
  sql += " WHERE id_ruta = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})


appRoutes.get('/sector_profesion', (request, response) => {
  let sql = "SELECT a.id, concat(b.name, ' - ', c.name) as name"
  sql += " FROM sector_profesion a"
  sql += " INNER JOIN sectors b ON b.id = a.id_sector"
  sql += " INNER JOIN profesions c ON c.id = a.id_profesion"
  sql += " WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})


//**********************************************//
//**********************************************//
//** Extraccion de tasas para Financomer */
//** 2021-08-04 LLRR */
//**********************************************//
//**********************************************//

appRoutes.get('/subgrupo_institution', (request, response) => {
  const sql = "SELECT id, name, tasa_mes_menor, tasa_mes_mayor, anios, plazo_maximo FROM subgrupo_inst"

  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})


module.exports = appRoutes