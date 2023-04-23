import CurrentDTO from "../persistences/DTOs/current.dto.js";

export const currentSession = async (req, res) => { 
    try {
        console.log('aca',req.session);
        const current = new CurrentDTO(await req.session.userInfo)
        res.json(current)
    } catch (error) {
        console.log('error:',error);
    }
}