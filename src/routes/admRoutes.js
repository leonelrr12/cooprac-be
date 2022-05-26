const admRoutes = require('express').Router()
const bcrypt = require('bcryptjs')
const config = require('../utils/config')
const logger = require('../utils/logger')


admRoutes.get('/', (request, response) => {
  response.send('Hola Mundo!!! Desde Admin Routes')
})



admRoutes.post('/rechazos', (request, response) => {
  let sql = "INSERT INTO rechazos ("
  sql += " name,celular,email,causas,is_active"
  sql += ") VALUES (?,?,?,?,1)"

  let { name,cellPhone: celular,email,causas } = request.body
  const params = [name,celular,email,causas]

  config.cnn.query(sql, params, (error, results, next) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    response.json({ message: 'Ok!' })
  })
})


admRoutes.post('/prospects', (request, response) => {
  let sql = "INSERT INTO prospects (id_personal,id_referido,idUser,name,fname,fname_2,lname,lname_2,"
  sql += " entity_f,estado,email,cellphone,phoneNumber,idUrl,socialSecurityProofUrl,"
  sql += " publicGoodProofUrl,workLetterUrl,payStubUrl,origin_idUser,gender,birthDate,"
  sql += " contractType,jobSector,occupation,paymentFrecuency,profession,"
  sql += " civil_status,province,district,sign,"
  sql += " loanPP,loanAuto,loanTC,loanHip,cashOnHand,plazo,apcReferenceUrl,apcLetterUrl,"

  sql += " residenceType,residenceMonthly,work_name,work_cargo,work_address,work_phone,work_phone_ext,work_month,"
  sql += " work_prev_name,work_prev_month,work_prev_salary,barrio_casa_calle,"
  sql += " salary,disponible,honorarios,viaticos,termConds,"
  sql += " weight,weightUnit,height,heightUnit,aceptaApc,nationality,"

  sql += " department,specialty,no_ip,phoneNumber_2,"
  sql += " work_phone_2,work_phone_ext_2,startDate,"
  sql += " doctor,doctorSpecialty,healthCenter,"
  sql += " cellPhone_2,socialSecurity,placeOfBirth,qaHealthy,monthlyPay,product,id_agente,"
  sql += " autoMarca,autoModelo,auto_aaaa,autoValor,autoAbono,hipoteca,hipoAbono,"
  sql += " reason, otherReason"

  sql += ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,"
  sql += "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,"
  sql += "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,"
  sql += "?,?,?,?,?,?,?,?,?,?)"

  let {
    id_personal,idUser,apcReferencesUrl,apcLetterUrl,sponsor,
    name,fname,fname_2,lname,lname_2,entity_f,estado,email,cellPhone,phoneNumber,
    idUrl,socialSecurityProofUrl,publicGoodProofUrl,workLetterUrl,payStubUrl,origin_idUser,
    gender,birthDate,contractType,jobSector,occupation,paymentFrecuency,profession,
    civil_status,province,district,sign,loanPP,
    loanAuto,loanTC,loanHip,cashOnHand,plazo,
    department,specialty,noIp,phoneNumber_2,
    work_phone_2,work_phone_ext_2,startDate,
    doctor,doctorSpecialty,healthCenter,
    cellPhone_2,socialSecurity,placeOfBirth,
    residenceType,residenceMonthly,work_name,work_cargo,work_address,
    work_phone,work_phone_ext,work_month,
    work_prev_name='N/A',work_prev_month=0,work_prev_salary=0,barrio_casa_calle,
    salary=0,disponible=0,honorarios=0,viaticos=0,termConds,nationality=0,
    weight, weightUnit, height, heightUnit, aceptaAPC: aceptaApc,
    qaHealthy,monthlyPay,product,
    marca, modelo, yyyyModelo, valorAuto, abonoAuto,
    hipoteca, abonoHipoteca,
    reason, otherReason
  } = request.body

  estado = 1 // Nuevo registro queda con estatus de nuevo

  if(paymentFrecuency === undefined) paymentFrecuency = 0

  birthDate = birthDate.slice(0,10)
  startDate = startDate.slice(0,10)
  const params = [
    id_personal,sponsor,idUser,name,fname,fname_2,lname,lname_2,entity_f,estado,email,cellPhone,
    phoneNumber,idUrl,socialSecurityProofUrl,publicGoodProofUrl,workLetterUrl,payStubUrl,origin_idUser,gender,
    birthDate,contractType,jobSector,occupation,paymentFrecuency,profession,civil_status,province,
    district,sign,loanPP,loanAuto,loanTC,loanHip,cashOnHand,plazo,apcReferencesUrl,apcLetterUrl,
    residenceType,residenceMonthly,work_name,work_cargo,work_address,work_phone,work_phone_ext,work_month,
    work_prev_name,work_prev_month,work_prev_salary,barrio_casa_calle,
    salary,disponible,honorarios,viaticos,termConds,
    weight, weightUnit, height, heightUnit, aceptaApc, nationality,

    department,specialty,noIp,phoneNumber_2,
    work_phone_2,work_phone_ext_2,startDate,
    doctor,doctorSpecialty,healthCenter,
    cellPhone_2,socialSecurity,placeOfBirth,qaHealthy,
    monthlyPay,product,config.ORIGEN.agente,

    marca,modelo,yyyyModelo,valorAuto,abonoAuto,
    hipoteca,abonoHipoteca,
    reason, otherReason
  ]

  config.cnn.query(sql, params, (error, results, next) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    // console.log('results', results, results.insertId)
    // console.log({ newId: results.insertId })
    response.json({ newId: results.insertId })
  })
})

admRoutes.post('/ref_personales', (request, response) => {

  let { tipo,name,id_prospect,apellido,parentesco,cellphone,phonenumber,work_name,work_phonenumber,work_phone_ext } = request.body

  let sql = "INSERT INTO ref_person_family ("
  if(tipo==="0") {
    sql = "INSERT INTO ref_person_no_family ("
  }
  sql += " name,id_prospect,apellido,parentesco,cellphone,phonenumber,work_name,work_phonenumber,work_phone_ext"
  sql += ") VALUES (?,?,?,?,?,?,?,?,?)"

  if(parentesco === "undefined") parentesco = ""
  if(work_phone_ext === "undefined") work_phone_ext = ""

  const params = [name,id_prospect,apellido,parentesco,cellphone,phonenumber,work_name,work_phonenumber,work_phone_ext]

  config.cnn.query(sql, params, (error, results, next) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    console.log('results',results)
    response.send('Ok!')
  })
})

admRoutes.get('/prospects/aproach/:id_personal', (request, response) => {
  let sql = "select a.id,	id_personal, idUser, a.name, fname, fname_2, lname,"
  sql += " lname_2, b.name as entity, email ,a.cellphone,	phoneNumber,"
  sql += " idUrl as imag_id, socialSecurityProofUrl as 'Ficha Seguro Social',"
  sql += " publicGoodProofUrl as 'Recibo Entidad Publica', workLetterUrl as 'Carta de Trabajo',"
  sql += " payStubUrl as 'Comprobante de Pago',	origin_idUser, gender, birthDate, contractType,	"
  sql += " jobSector,	occupation,	paymentFrecuency,	profession,	residenceType,"
  sql += " civil_status, province, district, salary, fcreate, fupdate,"
  sql += " c.name as estado, fcreate, datediff(now(), fcreate) as dias,"
  sql += " quotation,	application, sign ,loanPP, loanAuto, loanTC, loanHip, cashOnHand, plazo"
  sql += " FROM prospects a"
  sql += " INNER JOIN entities_f b ON b.id_ruta=a.entity_f"
  sql += " INNER JOIN estados_tramite c ON c.id=a.estado"
  sql += " WHERE id_personal = ? and entity_f='810'"

  // console.log(sql)
  const params = [request.params.id_personal];
  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results?.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

module.exports = admRoutes