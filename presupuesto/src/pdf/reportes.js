// const PDFDocument = require("pdfkit-table");
const PDFDocument = require("pdfkit-construct");
const fs = require("fs");

const presupuestoConsolidado = (cuentas) => {
  const cuentasFormat = [
    ...cuentas.map((cta) => ({
      ...cta,
      montoInicial: formatNumber(cta.montoInicial),
      montoModMes: formatNumber(cta.montoModMes),
      montoModAcm: formatNumber(cta.montoModAcm),
    })),
  ];
  const doc = new PDFDocument({
    bufferPages: true,
    size: "LEGAL",
    font: "Helvetica",
    layout: "landscape",
    margin: 20,
  });

  // console.log(cuentasFormat);

  doc.pipe(fs.createWriteStream("./file-table.pdf"));

  doc.setDocumentHeader({}, () => {
    // doc
    //   .lineJoin("miter")
    //   .rect(0, 0, doc.page.width, doc.header.options.heightNumber)
    //   .fill("#ededed");

    doc
      .fill("#115dc8")
      .fontSize(20)
      .text("Hello world header", doc.header.x, doc.header.y);
  });

  // set the footer to render in every page
  doc.setDocumentFooter({}, () => {
    // doc
    //   .lineJoin("miter")
    //   .rect(0, doc.footer.y, doc.page.width, doc.footer.options.heightNumber)
    //   .fill("#c2edbe");

    doc
      .fill("#7416c8")
      .fontSize(8)
      .text("Hello world footer", doc.footer.x, doc.footer.y - 10);
  });

  doc.addTable(
    [
      { key: "cuentaNo", label: "Cuenta", align: "left" },
      {
        key: "nombreCuenta",
        label: "Denominacion",
        align: "left",
        width: 250,
      },
      { key: "montoInicial", label: "Asignacion", align: "right", width: 50 },
      { key: "montoModMes", label: "Modificaciones", align: "right" },
      { key: "montoModAcm", label: "Modificaciones", align: "right" },
    ],
    cuentasFormat,
    {
      // border: null,
      // width: "fill_body",
      // striped: true,
      // stripedColors: ["#f6f6f6", "#d6c4dd"],
      // cellsPadding: 10,
      // marginLeft: 45,
      // marginRight: 45,
      // headAlign: "center",
    }
  );

  doc.render();
  doc.setPageNumbers((p, count) => `Pag. ${p} / ${count}`, "top right");
  // this should be the last
  // for this to work you need to set bufferPages to true in constructor options

  // doc.pipe(res);
  doc.end();

  // const tablePresupuesto = {
  //   title: "Ejecucion Presupuestaria y financiera",
  //   subtitle: "Procuraduria General del Edo. Anzoategui.",
  //   width: 1180,
  //   headers: [
  //     { label: "Codigo", property: "cuentaNo", width: 70 },
  //     { label: "Denominacion Cuenta", property: "nombreCuenta", width: 200 },
  //     {
  //       label: "Asignacion Original",
  //       property: "montoInicial",
  //       width: 100,
  //       align: "right",
  //       renderer: (value, indexColumn, indexRow, row) => {
  //         // console.log(value, indexColumn, indexRow, row);
  //         return formatNumber(value);
  //       },
  //     },
  //     { label: "Ajustes", property: "montoModMes", width: 100 },
  //     { label: "Asignacion Ajustada", property: "montoModAcm", width: 100 },
  //     { label: "Comprometido", property: "montoCompAcm", width: 100 },
  //   ],
  //   datas: [
  //     ...cuentas,
  //     { montoInicial: { label: 30, options: { fontSize: 10, align: "right" } } },
  //   ],
  //   // rows: [["Name 4", "Age 4", "Year 4"]],
  //   options: {
  //     width: 900,
  //   },
  // };
  // doc.moveDown(3);
  // doc.table(tablePresupuesto);

  // doc.end();
  // return;

  // doc.addPage();

  // doc.moveDown(3);
  // doc.table(tableJson);

  // doc.addPage();

  // headerReport(doc);
  // let nlinea = 180;

  // const wrapNumber = {
  //   width: 100,
  //   align: "right",
  // };
  // cuentas.map((cta) => {
  //   doc.fontSize(8);
  //   doc.text(cta.cuentaNo, 10, nlinea);
  //   doc.text(cta.nombreCuenta, 80, nlinea, { width: 200, align: "left" });
  //   doc.text(formatNumber(cta.montoInicial), 230, nlinea, wrapNumber);
  //   doc.text(formatNumber(cta.montoModMes), 310, nlinea, wrapNumber);
  //   doc.text(formatNumber(cta.montoModAcm), 390, nlinea, wrapNumber);
  //   doc.text(formatNumber(cta.montoCompAcm), 470, nlinea, wrapNumber);
  //   doc.text(formatNumber(cta.montoCausAcm), 550, nlinea, wrapNumber);
  //   doc.text(formatNumber(cta.montoPagaAcm), 630, nlinea, wrapNumber);
  //   doc.text(formatNumber(21084247200.58), 750, nlinea);
  //   doc.text(formatNumber(21084247200.58), 830, nlinea);
  //   doc.text(formatNumber(21084247200.59), 910, nlinea);

  //   nlinea += 30;
  // });

  // doc.end();
};

const headerReport = (doc) => {
  const wraptext = { width: 100, align: "center" };

  doc.fontSize(18).text("Ejecución Presupuestaria y Financiera", 350, 50);

  doc.fontSize(10);
  doc.text("Procuraduría General del Estado Anzoátegui", 15, 100);
  doc.text("Pagina: 1 de 10", 900, 100);

  let nlinea = 140;

  doc.text("CODIGO", 10, nlinea);
  doc.text("DENOMINACION CUENTA", 80, nlinea, wraptext);
  doc.text("ASIGNACION ORIGINAL", 250, nlinea, wraptext);
  doc.text("AJUSTES", 360, nlinea);
  doc.text("ASIGNACION AJUSTADA", 410, nlinea, wraptext);
  doc.text("COMPROMETIDO", 500, nlinea);
  doc.text("CAUSADO", 595, nlinea);
  doc.text("PAGADO", 680, nlinea);
  doc.text("DISPONIBILIDAD MES", 740, nlinea, wraptext);
  doc.text("DISPONIBILIDAD ANO", 820, nlinea, wraptext);
  doc.text("DISPONIBILIDAD FINANCIERA", 900, nlinea, wraptext);

  doc.lineWidth(1);

  doc.rect(5, nlinea - 10, 980, 40).stroke();
  // doc
  //   .lineCap("butt")
  //   .moveTo(5, nlinea + 20)
  //   .lineTo(100, 20)
  //   .stroke();
};

const formatNumber = (number) =>
  new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2 }).format(number);

module.exports = { presupuestoConsolidado };
