const getCurrentSession = async () => {
    const currentSession = await fetch("http://localhost:3030/api/sessions/current", {method: "GET",credentials: "include"});
    return currentSession.json();
  };

export const verificarAdmin = async (req,res,next)=>{
    const sessionRol = req.session.userInfo.rol
     if(sessionRol === 'admin'){
         next()
     } else {
         console.log('No estas autorizado para realizar esta operacion')
     }
 }
 
 export const verificarUsuario = async (req,res,next)=>{
    const sessionRol = req.session.userInfo.rol
      if(sessionRol === 'user'){
          next()
      } else {
        console.log('No estas autorizado para realizar esta operacion')
      }
  }