import jsPDF from "jspdf";


export const pdfFromElement = (html) => {  
    const doc = new jsPDF({
        format: 'a4',
        unit: 'px',
    });

    // Adding the fonts.
    // doc.setFont('Inter-Regular', 'normal');

    doc.html(html, {
        async callback(doc) {
            await doc.save('document');
        },
    });
};


export const dowloadPDF = (url) => {
    // const url = window.URL.createObjectURL(blob);
    // Crea un enlace temporal y haz clic en él para descargar el PDF
    const a = document.createElement('a');
    a.href = url;
    a.download = 'archivo.pdf'; // Nombre del archivo a descargar
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}
