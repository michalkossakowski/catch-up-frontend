import axios from 'axios';

const API_URL = "http://localhost:7097/api/NewbieMentor";

const NewbieMentorService = {
    getAllMentors: () => axios.get(`${API_URL}/GetAllMentors`),
    getAllUnassignedNewbies: () => axios.get(`${API_URL}/GetAllUnassigned`),
    assignNewbieToMentor: (newbieId: string, mentorId: string) => axios.post(`${API_URL}/Assign/${newbieId}/${mentorId}`),
};

export default NewbieMentorService;
