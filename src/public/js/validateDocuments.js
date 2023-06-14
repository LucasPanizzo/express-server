export function validateDocuments(files){
    const requiredDocuments = ["identificacion", "domicilio", "cuentaStatus"];
    const uploadedDocuments = files.map((file) => {
      const documentName = file.name.split("-")[0];
      return documentName;
    });
  
    for (const document of requiredDocuments) {
      if (!uploadedDocuments.includes(document)) {
        return false;
      }
    }
  
    return true;
  };