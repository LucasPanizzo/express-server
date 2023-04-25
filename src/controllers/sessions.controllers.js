import { currentSessionService } from "../services/users.services.js";

export const currentSession = async (req, res) => { 
    try {
        const current = await currentSessionService(await req.session.userInfo)
        res.json(current)
    } catch (error) {
        console.log('error:',error);
    }
}