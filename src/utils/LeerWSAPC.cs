using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;

namespace APCRestAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class APCScoreController : ControllerBase
    {
        [HttpGet("{id}")]
        public string get(int id)
        {
            return "Hola, soy una API desde C# Core." + id;
        }

        [HttpPost]
        public APCFull post(InputData datos)
        {

            string usuarioconsulta = APCEncrypt.ScorePlusEncrypt.EncryptString(datos.usuarioconsulta);
            string claveConsulta = APCEncrypt.ScorePlusEncrypt.EncryptString(datos.claveConsulta);
            string IdentCliente = APCEncrypt.ScorePlusEncrypt.EncryptString(datos.IdentCliente);
            string TipoCliente = APCEncrypt.ScorePlusEncrypt.EncryptString(datos.TipoCliente);
            string Producto = APCEncrypt.ScorePlusEncrypt.EncryptString(datos.Producto);


            string ServiceResult = "";
            ServiceReferenceAPC.SCOREServiceClient ws = new ServiceReferenceAPC.SCOREServiceClient();
            Task.Run(async () =>
            {
                Task<string> ResultWS = ws.GetScoreAsync(usuarioconsulta, claveConsulta, IdentCliente, TipoCliente, Producto);

                ServiceResult = await ResultWS;
            }).GetAwaiter().GetResult();

            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.LoadXml(ServiceResult);
            //xmlDoc.LoadXml(Data());

            APCFull Result = UsingXMLDocument(xmlDoc);

            return Result;
        }


        public APCFull UsingXMLDocument(XmlDocument xmlDoc)
        {

            XmlNodeList ItemNodes = xmlDoc.SelectNodes("//Resultado");

            APCFull APC = new APCFull();
            Generales[] arrayG = new Generales[1];
            Resumen[] arrayR = new Resumen[1];
            Detalle[] arrayD = new Detalle[1];
            ReferenciasCanceladas[] arrayRC = new ReferenciasCanceladas[1];
            Movimientos[] arrayM = new Movimientos[1];


            // Validacion
            foreach (XmlNode ItemNode in ItemNodes)
            {
                //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
                foreach (XmlNode Item in ItemNode.SelectSingleNode("Validacion"))
                {
                    APC.Valido = Item.InnerText;

                }
            }
            if (APC.Valido == "0")
            {
                APC.Mensaje = "Error en Web Service de APC";
                return APC;
            }

            // Estatus
            foreach (XmlNode ItemNode in ItemNodes)
            {
                //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
                foreach (XmlNode Item in ItemNode.SelectSingleNode("Estatus"))
                {
                    APC.Estatus = Item.InnerText;
                }
            }
            if (APC.Estatus == "0")
            {
                APC.Mensaje = "Cliente no existe";
                return APC;
            }
            APC.Mensaje = "Ok";

            // Generales
            int i = 0;
            foreach (XmlNode ItemNode in ItemNodes)
            {
                //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
                if (ItemNode.SelectSingleNode("Generales") != null)
                {
                    foreach (XmlNode Item in ItemNode.SelectSingleNode("Generales"))
                    {
                        Generales g = new Generales();
                        foreach (XmlNode Item2 in Item)
                        {
                            switch (Item2.Name)
                            {
                                case "NOMBRE":
                                    g.NOMBRE = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "APELLIDO":
                                    g.APELLIDO = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "IDENT_CLIE":
                                    g.IDENT_CLIE = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "FEC_CREACION":
                                    g.FEC_CREACION = Item2.InnerText.Length > 0 ? APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText) : "";
                                    break;
                                case "NOM_ASOC":
                                    g.NOM_ASOC = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "FEC_DEFUNCION":
                                    g.FEC_DEFUNCION = Item2.InnerText.Length > 0 ? APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText) : "";
                                    break;
                            }
                        }
                        arrayG[i] = g;
                        i++;
                        Array.Resize<Generales>(ref arrayG, i);
                    }
                }
            }
            APC.GEN = arrayG;

            // Resumen
            i = 0;
            foreach (XmlNode ItemNode in ItemNodes)
            {
                //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
                if (ItemNode.SelectSingleNode("Resumen") != null)
                {
                    foreach (XmlNode Item in ItemNode.SelectSingleNode("Resumen"))
                    {
                        Resumen g = new Resumen();
                        foreach (XmlNode Item2 in Item)
                        {

                            switch (Item2.Name)
                            {
                                case "RELACION":
                                    g.RELACION = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "CANTIDAD":
                                    g.CANTIDAD = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "MONTO":
                                    g.MONTO = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "SALDO_ACTUAL":
                                    g.SALDO_ACTUAL = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                            }
                        }
                        arrayR[i] = g;
                        i++;
                        Array.Resize<Resumen>(ref arrayR, i + 1);
                    }
                }
            }
            APC.RES = arrayR;


            // Detalle
            i = 0;
            foreach (XmlNode ItemNode in ItemNodes)
            {
                //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
                if (ItemNode.SelectSingleNode("Detalle") != null)
                {
                    foreach (XmlNode Item in ItemNode.SelectSingleNode("Detalle"))
                    {
                        Detalle g = new Detalle();
                        foreach (XmlNode Item2 in Item)
                        {
                            switch (Item2.Name)
                            {
                                case "NOM_ASOC":
                                    g.NOM_ASOC = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "DESCR_CORTA_RELA":
                                    g.DESCR_CORTA_RELA = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "FEC_INICIO_REL":
                                    g.FEC_INICIO_REL = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "FEC_FIN_REL":
                                    g.FEC_FIN_REL = Item2.InnerText.Length > 0 ? APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText) : "";
                                    break;
                                case "MONTO_ORIGINAL":
                                    g.MONTO_ORIGINAL = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "NUM_PAGOS":
                                    g.NUM_PAGOS = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "DESCR_FORMA_PAGO":
                                    g.DESCR_FORMA_PAGO = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "IMPORTE_PAGO":
                                    g.IMPORTE_PAGO = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "FEC_ULTIMO_PAGO":
                                    g.FEC_ULTIMO_PAGO = Item2.InnerText.Length > 0 ? APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText) : "";
                                    break;
                                case "MONTO_ULTIMO_PAGO":
                                    g.MONTO_ULTIMO_PAGO = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "DESCR_OBS_CORTA":
                                    g.DESCR_OBS_CORTA = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "SALDO_ACTUAL":
                                    g.SALDO_ACTUAL = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "NUM_DIAS_ATRASO":
                                    g.NUM_DIAS_ATRASO = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "HISTORIA":
                                    g.HISTORIA = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "MONTO_CODIFICADO":
                                    g.MONTO_CODIFICADO = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "FEC_ACTUALIZACION":
                                    g.FEC_ACTUALIZACION = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "COD_GRUPO_ECON":
                                    g.COD_GRUPO_ECON = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "TIPO_ASOC":
                                    g.TIPO_ASOC = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "NUM_REFER":
                                    g.NUM_REFER = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                            }
                        }
                        arrayD[i] = g;
                        i++;
                        Array.Resize<Detalle>(ref arrayD, i + 1);
                    }
                }
            }
            APC.DET = arrayD;


            // ReferenciasCanceladas
            i = 0;
            foreach (XmlNode ItemNode in ItemNodes)
            {
                //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
                if (ItemNode.SelectSingleNode("ReferenciasCanceladas") != null)
                {
                    foreach (XmlNode Item in ItemNode.SelectSingleNode("ReferenciasCanceladas"))
                    {
                        ReferenciasCanceladas g = new ReferenciasCanceladas();
                        foreach (XmlNode Item2 in Item)
                        {
                            switch (Item2.Name)
                            {

                                case "NOM_ASOC":
                                    g.NOM_ASOC = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "DESCR_CORTA_RELA":
                                    g.DESCR_CORTA_RELA = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "FEC_INICIO_REL":
                                    g.FEC_INICIO_REL = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "FEC_FIN_REL":
                                    g.FEC_FIN_REL = Item2.InnerText.Length > 0 ? APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText) : "";
                                    break;
                                case "MONTO_ORIGINAL":
                                    APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "FEC_LIQUIDACION":
                                    g.FEC_LIQUIDACION = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "HISTORIA":
                                    g.HISTORIA = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "DESCR_OBS_CORTA":
                                    g.DESCR_OBS_CORTA = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "MONTO_CODIFICADO":
                                    g.MONTO_CODIFICADO = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "NUM_REFER":
                                    g.NUM_REFER = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "COD_GRUPO_ECON":
                                    g.COD_GRUPO_ECON = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "TIPO_ASOC":
                                    g.TIPO_ASOC = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                            }
                        }
                        arrayRC[i] = g;
                        i++;
                        Array.Resize<ReferenciasCanceladas>(ref arrayRC, i + 1);
                    }
                }
            }
            APC.REF = arrayRC;


            // Movimientos
            i = 0;
            foreach (XmlNode ItemNode in ItemNodes)
            {
                //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
                if (ItemNode.SelectSingleNode("Movimientos") != null)
                {
                    foreach (XmlNode Item in ItemNode.SelectSingleNode("Movimientos"))
                    {
                        Movimientos m = new Movimientos();
                        foreach (XmlNode Item2 in Item)
                        {
                            switch (Item2.Name)
                            {
                                case "NOM_ASOC":
                                    m.NOM_ASOC = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "FEC1":
                                    m.FEC1 = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                                case "IDENT_CLIE":
                                    m.IDENT_CLIE = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                    break;
                            }
                        }
                        arrayM[i] = m;
                        i++;
                        Array.Resize<Movimientos>(ref arrayM, i + 1);
                    }
                }
            }
            APC.MOV = arrayM;


            // Score
            Score gsc = new Score();
            foreach (XmlNode ItemNode in ItemNodes)
            {
                //TextBox1.Text = ItemNode.Name + " " + ItemNode.InnerXml;
                if (ItemNode.SelectSingleNode("Score") == null)
                {
                    //gsc.SCORE = "-1";
                    //gsc.PI = "-1";
                    //gsc.EXCLUSION = "";

                    //APC.SC = gsc;
                    return APC;
                }
                foreach (XmlNode Item in ItemNode.SelectSingleNode("Score"))
                {
                    foreach (XmlNode Item2 in Item)
                    {
                        switch (Item2.Name)
                        {
                            case "SCORE":
                                gsc.SCORE = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "PI":
                                gsc.PI = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                            case "EXCLUSION":
                                gsc.EXCLUSION = APCEncrypt.ScorePlusEncrypt.DecryptString(Item2.InnerText);
                                break;
                        }
                    }
                }
            }
            APC.SC = gsc;

            return APC;
        }


        public class APCFull
        {
            public string Valido { get; set; }
            public string Estatus { get; set; }
            public string Mensaje { get; set; }
            public Generales[] GEN { get; set; }
            public Resumen[] RES { get; set; }
            public Detalle[] DET { get; set; }
            public ReferenciasCanceladas[] REF { get; set; }
            public Movimientos[] MOV { get; set; }
            public Score SC { get; set; }

        }

        public class Generales
        {
            public string NOMBRE { get; set; }
            public string APELLIDO { get; set; }
            public string IDENT_CLIE { get; set; }
            public string FEC_CREACION { get; set; }
            public string NOM_ASOC { get; set; }
            public string FEC_DEFUNCION { get; set; }
        }

        public class Resumen
        {
            public string RELACION { get; set; }
            public string CANTIDAD { get; set; }
            public string MONTO { get; set; }
            public string SALDO_ACTUAL { get; set; }
        }

        public class Detalle
        {
            public string NOM_ASOC { get; set; }
            public string DESCR_CORTA_RELA { get; set; }
            public string FEC_INICIO_REL { get; set; }
            public string FEC_FIN_REL { get; set; }
            public string MONTO_ORIGINAL { get; set; }
            public string NUM_PAGOS { get; set; }
            public string DESCR_FORMA_PAGO { get; set; }
            public string IMPORTE_PAGO { get; set; }
            public string FEC_ULTIMO_PAGO { get; set; }
            public string MONTO_ULTIMO_PAGO { get; set; }
            public string DESCR_OBS_CORTA { get; set; }
            public string SALDO_ACTUAL { get; set; }
            public string NUM_DIAS_ATRASO { get; set; }
            public string HISTORIA { get; set; }
            public string MONTO_CODIFICADO { get; set; }
            public string FEC_ACTUALIZACION { get; set; }
            public string COD_GRUPO_ECON { get; set; }
            public string TIPO_ASOC { get; set; }
            public string NUM_REFER { get; set; }
        }

        public class ReferenciasCanceladas
        {
            public string NOM_ASOC { get; set; }
            public string DESCR_CORTA_RELA { get; set; }
            public string FEC_INICIO_REL { get; set; }
            public string FEC_FIN_REL { get; set; }
            public string MONTO_ORIGINAL { get; set; }
            public string FEC_LIQUIDACION { get; set; }
            public string HISTORIA { get; set; }
            public string DESCR_OBS_CORTA { get; set; }
            public string MONTO_CODIFICADO { get; set; }
            public string NUM_REFER { get; set; }
            public string COD_GRUPO_ECON { get; set; }
            public string TIPO_ASOC { get; set; }

        }

        public class Movimientos
        {
            public string NOM_ASOC { get; set; }
            public string FEC1 { get; set; }
            public string IDENT_CLIE { get; set; }
        }

        public class Score
        {
            public string SCORE { get; set; }
            public string PI { get; set; }
            public string EXCLUSION { get; set; }
        }

        public class InputData
        {
            public string usuarioconsulta { get; set; }
            public string claveConsulta { get; set; }
            public string IdentCliente { get; set; }
            public string TipoCliente { get; set; }
            public string Producto { get; set; }
        }
    }
}