import axiosInstance from "../../axiosConfig";
import { MaterialDto } from "../dtos/MaterialDto"

const materialService = 
{
    getMaterial: async(materialId : number): Promise<MaterialDto> => {
        try
        {
            const response = await axiosInstance.get<MaterialDto>(`/Material/Get/${materialId}`)
            return response.data
        }
        catch(error)
        {
            console.error('Material get error:', error)
            throw error
        }   
    },
    getAllMaterials: async(): Promise<MaterialDto[]> => {
        try
        {
            const response = await axiosInstance.get<MaterialDto[]>(`/Material/GetAllMaterials`)
            return response.data
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
            const response = await axiosInstance.get<MaterialDto>(`/Material/GetWithFiles/${materialId}`)
            return response.data
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
            const response = await axiosInstance.post<MaterialDto>(`/Material/Create/`, material)
            return response.data
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
            const response = await axiosInstance.post(`/Material/RemoveFile/${materialId}/${fileId}`)
            return response
        } 
        catch (error) 
        {
            console.error('Error removing file:', error)
            throw error
        }
    },
    deleteMaterial: async(materialId: number) => {
        try 
        {
            const response = await axiosInstance.delete(`/Material/Delete/${materialId}`)
            return response
        } 
        catch (error) 
        {
            console.error('Error removing file:', error)
            throw error
        }
    },
    addFile: async(materialId: number, fileId: number) => {
        try 
        {
            const response = await axiosInstance.post(`/Material/AddFile/${materialId}/${fileId}`)
            return response
        } 
        catch (error) 
        {
            console.error('Error in adding file:', error)
            throw error
        }
    },

    editMaterial: async(materialId: number, name: string) => {
        try 
        {
            const response = await axiosInstance.put(`/Material/Edit/${materialId}/${name}`)
            console.log("Material edited:", response)
        } 
        catch (error) 
        {
            console.error('Error in editing material:', error)
            throw error
        }
    },
}
export default materialService