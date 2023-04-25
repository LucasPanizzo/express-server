export const logoutController = (req,res)=>{
    try {
        req.session.destroy((error) => {
          if (error) console.log(error)
          res.redirect('/')
        })
    } catch (error) {
        console.log(error);
    }
}