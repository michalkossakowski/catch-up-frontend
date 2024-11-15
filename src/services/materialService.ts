import { MaterialDto } from "../dtos/MaterialDto"
import axios from 'axios';
const BASE_URL = 'https://localhost:7097/api/Material/';

const materialService = 
{
    getMaterial: async(materialId : number): Promise<MaterialDto> => {
        try
        {
            const response = await axios.get<{ message: string; materialDto: MaterialDto;}>(`${BASE_URL}Get/${materialId}`)
            console.log("Material got successfully:", response);
            return response.data.materialDto
        }
        catch(error)
        {
            console.error('Material get error:', error)
            throw error
        }   
    },
    getMaterialWithFiles: async(materialId : number): Promise<MaterialDto> => {
        try
        {
            const response = await axios.get<{ message: string; materialDto: MaterialDto;}>(`${BASE_URL}GetWithFiles/${materialId}`)
            console.log("Material got successfully:", response);
            return response.data.materialDto
        }
        catch(error)
        {
            console.error('Material get error:', error)
            throw error
        }   
    },
    createMaterial: async(material : MaterialDto): Promise<MaterialDto> => {
        try
        {
            const response = await axios.post<{ message: string; material: MaterialDto;}>(`${BASE_URL}Create/`, material)
            console.log("Material created:", response);
            return response.data.material
        }
        catch(error)
        {
            console.error('Creating material error:', error)
            throw error
        }   
    },
    removeFile: async(materialId: number, fileId: number) => {
        try 
        {
            const response = await axios.post(`${BASE_URL}RemoveFile/${materialId}/${fileId}`)
            console.log("File removed:", response)
        } 
        catch (error) 
        {
            console.error('Error removing file:', error)
            throw error
        }
    },
}
export default materialService