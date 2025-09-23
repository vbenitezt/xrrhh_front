

export const downloadPDF = (url) => {
    console.log("url", url);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'archivo.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}


export const downloadExcel = (url, name='archivo') => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

export const downloadAny = (url, name) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

