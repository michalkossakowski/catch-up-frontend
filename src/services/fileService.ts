import { FileDto } from '../dtos/FileDto';

let files: FileDto[] = [
    { id: 1, name: 'document.pdf', type: 'application/pdf', source: '/files/document.pdf', dateOfUpload: new Date(), sizeInBytes: 1024, owner: '1' },
    { id: 2, name: 'image.png', type: 'image/png', source: '/files/image.png', dateOfUpload: new Date(), sizeInBytes: 2048, owner: '1' },
    { id: 3, name: 'presentation.pptx', type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', source: '/files/presentation.pptx', dateOfUpload: new Date(), sizeInBytes: 3072, owner: '2' },
];

const fileService =
{
    uploadFile: async (
        file: File,
        materialId?: number, 
        ownerId?: string,
        dateOfUpload?: Date,
         onProgress?: (percent: number) => void
    ): Promise<{ message: string; fileDto: FileDto; materialId: number }> => {
        console.log('Mocked uploadFile called with:', { file, materialId, ownerId, dateOfUpload });
        await new Promise(resolve => setTimeout(resolve, 1000));
        onProgress?.(100);
        const newFile: FileDto = {
            id: Math.max(...files.map(f => f.id)) + 1,
            name: file.name,
            type: file.type,
            source: `/files/${file.name}`,
            dateOfUpload: dateOfUpload || new Date(),
            sizeInBytes: file.size,
            owner: ownerId || '1',
        };
        files.push(newFile);
        return { message: 'File uploaded successfully', fileDto: newFile, materialId: materialId || 0 };
    },

    downloadFile: async (fileId: number): Promise<Blob> => {
        console.log(`Mocked downloadFile called with fileId: ${fileId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const file = files.find(f => f.id === fileId);
        if (!file) {
            throw new Error('File not found');
        }
        return new Blob([`Mock content for ${file.name}`], { type: 'text/plain' });
    },

    getFileById: async (fileId: number): Promise<FileDto> => {
        console.log(`Mocked getFileById called with fileId: ${fileId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const file = files.find(f => f.id === fileId);
        if (!file) {
            throw new Error('File not found');
        }
        return file;
    },

    getAllFiles: async (): Promise<FileDto[]> => {
        console.log('Mocked getAllFiles called');
        await new Promise(resolve => setTimeout(resolve, 500));
        return files;
    },

    getAllFilesPagination: async (page: number, pageSize: number): Promise<{ files: FileDto[], totalCount: number }> => {
        console.log(`Mocked getAllFilesPagination called with page: ${page}, pageSize: ${pageSize}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const paginatedFiles = files.slice((page - 1) * pageSize, page * pageSize);
        return { files: paginatedFiles, totalCount: files.length };
    },

    getAllOwnedFiles: async (userId: string): Promise<FileDto[]> => {
        console.log(`Mocked getAllOwnedFiles called with userId: ${userId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return files.filter(f => f.owner === userId);
    },

    getAllOwnedFilesPagination: async (userId: string, page: number, pageSize: number): Promise<{ files: FileDto[], totalCount: number }> => {
        console.log(`Mocked getAllOwnedFilesPagination called with userId: ${userId}, page: ${page}, pageSize: ${pageSize}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const userFiles = files.filter(f => f.owner === userId);
        const paginatedFiles = userFiles.slice((page - 1) * pageSize, page * pageSize);
        return { files: paginatedFiles, totalCount: userFiles.length };
    },

    changeFile: async (fileDto: FileDto): Promise<FileDto> => {
        console.log('Mocked changeFile called with fileDto:', fileDto);
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = files.findIndex(f => f.id === fileDto.id);
        if (index === -1) {
            throw new Error('File not found');
        }
        files[index] = fileDto;
        return files[index];
    },

    findByQuestion: async (userId: string, question: string, page: number, pageSize: number): Promise<{ files: FileDto[], totalCount: number }> => {
        console.log(`Mocked findByQuestion called with userId: ${userId}, question: ${question}, page: ${page}, pageSize: ${pageSize}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        // This is a simplified search. A real implementation would be more complex.
        const userFiles = files.filter(f => f.owner === userId && f.name?.toLowerCase().includes(question.toLowerCase()));
        const paginatedFiles = userFiles.slice((page - 1) * pageSize, page * pageSize);
        return { files: paginatedFiles, totalCount: userFiles.length };
    }
}

export default fileService;
