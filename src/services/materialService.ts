
import { MaterialDto } from "../dtos/MaterialDto";
import { FileDto } from "../dtos/FileDto";

let files: FileDto[] = [
    { id: 1, name: 'document.pdf', type: 'application/pdf', source: '/files/document.pdf', dateOfUpload: new Date(), sizeInBytes: 1024, owner: '1' },
    { id: 2, name: 'image.png', type: 'image/png', source: '/files/image.png', dateOfUpload: new Date(), sizeInBytes: 2048, owner: '1' },
    { id: 3, name: 'presentation.pptx', type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', source: '/files/presentation.pptx', dateOfUpload: new Date(), sizeInBytes: 3072, owner: '2' },
];

let materials: MaterialDto[] = [
    { id: 1, name: 'Onboarding Documents', files: [files[0], files[1]] },
    { id: 2, name: 'Project Guidelines', files: [files[2]] }
];

const materialService = {
    getMaterial: async (materialId: number): Promise<MaterialDto> => {
        console.log(`Mocked getMaterial called with materialId: ${materialId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const material = materials.find(m => m.id === materialId);
        if (!material) {
            throw new Error('Material not found');
        }
        return material;
    },

    getAllMaterials: async (): Promise<MaterialDto[]> => {
        console.log('Mocked getAllMaterials called');
        await new Promise(resolve => setTimeout(resolve, 500));
        return materials;
    },

    getMaterialWithFiles: async (materialId: number): Promise<MaterialDto> => {
        console.log(`Mocked getMaterialWithFiles called with materialId: ${materialId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const material = materials.find(m => m.id === materialId);
        if (!material) {
            throw new Error('Material not found');
        }
        return material;
    },

    createMaterial: async (material: MaterialDto): Promise<MaterialDto> => {
        console.log('Mocked createMaterial called with material:', material);
        await new Promise(resolve => setTimeout(resolve, 500));
        const newMaterial: MaterialDto = { ...material, id: Math.max(...materials.map(m => m.id!)) + 1, files: [] };
        materials.push(newMaterial);
        return newMaterial;
    },

    removeFile: async (materialId: number, fileId: number) => {
        console.log(`Mocked removeFile called with materialId: ${materialId}, fileId: ${fileId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const material = materials.find(m => m.id === materialId);
        if (material && material.files) {
            material.files = material.files.filter(f => f.id !== fileId);
        }
        return { status: 200, data: 'File removed' };
    },

    removeFiles: async (materialId: number, fileIds: number[]) => {
        console.log(`Mocked removeFiles called with materialId: ${materialId}, fileIds: ${fileIds}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const material = materials.find(m => m.id === materialId);
        if (material && material.files) {
            material.files = material.files.filter(f => !fileIds.includes(f.id));
        }
        return { status: 200, data: 'Files removed' };
    },

    deleteMaterial: async (materialId: number) => {
        console.log(`Mocked deleteMaterial called with materialId: ${materialId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = materials.findIndex(m => m.id === materialId);
        if (index !== -1) {
            materials.splice(index, 1);
        }
        return { status: 200, data: 'Material deleted' };
    },

    addFile: async (materialId: number, fileId: number) => {
        console.log(`Mocked addFile called with materialId: ${materialId}, fileId: ${fileId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const material = materials.find(m => m.id === materialId);
        const file = files.find(f => f.id === fileId);
        if (material && file) {
            if (!material.files) {
                material.files = [];
            }
            material.files.push(file);
        }
        return { status: 200, data: 'File added' };
    },

    addFiles: async (materialId: number, fileIds: number[]) => {
        console.log(`Mocked addFiles called with materialId: ${materialId}, fileIds: ${fileIds}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const material = materials.find(m => m.id === materialId);
        if (material) {
            if (!material.files) {
                material.files = [];
            }
            for (const fileId of fileIds) {
                const file = files.find(f => f.id === fileId);
                if (file) {
                    material.files.push(file);
                }
            }
        }
        return { status: 200, data: 'Files added' };
    },

    editMaterial: async (materialId: number, name: string) => {
        console.log(`Mocked editMaterial called with materialId: ${materialId}, name: ${name}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const material = materials.find(m => m.id === materialId);
        if (material) {
            material.name = name;
        }
        return { status: 200, data: 'Material edited' };
    },
}

export default materialService;
