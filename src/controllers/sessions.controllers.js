import CurrentDTO from "../persistences/DTOs/current.dto.js";

export const currentSession = async (req, res) => { 
    try {
        const current = new CurrentDTO(await req.session.userInfo)
        console.log(await current.email);
        res.json(current)
    } catch (error) {
        console.log('error:',error);
    }
}