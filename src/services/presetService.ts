import { PresetDto } from '../dtos/PresetDto';

interface PresetResponse {
    message: string;
    preset: PresetDto;
}

let presets: PresetDto[] = [
    { id: 1, name: 'Onboarding', creatorId: '1'},
    { id: 2, name: 'Bug Fixing', creatorId: '1' },
    { id: 3, name: 'Feature Development', creatorId: '2'},
];

export const getPresets = async (): Promise<PresetDto[]> => {
    console.log('Mocked getPresets called');
    await new Promise(resolve => setTimeout(resolve, 500));
    return presets;
};

export const getPresetById = async (id: number): Promise<PresetDto> => {
    console.log(`Mocked getPresetById called with id: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const preset = presets.find(p => p.id === id);
    if (!preset) {
        throw new Error('Preset not found');
    }
    return preset;
};

export const getPresetsByCreatorId = async (creatorId: string): Promise<PresetDto[]> => {
    console.log(`Mocked getPresetsByCreatorId called with creatorId: ${creatorId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return presets.filter(p => p.creatorId === creatorId);
};

export const getPresetsByName = async (name: string): Promise<PresetDto[]> => {
    console.log(`Mocked getPresetsByName called with name: ${name}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return presets.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
};

export const getPresetsByTaskContent = async (taskContentId: number): Promise<PresetDto[]> => {
    console.log(`Mocked getPresetsByTaskContent called with taskContentId: ${taskContentId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return presets;
};

export const searchPresets = async (searchString: string): Promise<PresetDto[]> => {
    console.log(`Mocked searchPresets called with searchString: ${searchString}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return presets.filter(p => p.name.toLowerCase().includes(searchString.toLowerCase()));
};

export const addPreset = async (preset: PresetDto): Promise<PresetDto> => {
    console.log('Mocked addPreset called with preset:', preset);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPreset: PresetDto = { ...preset, id: Math.max(...presets.map(p => p.id)) + 1 };
    presets.push(newPreset);
    return newPreset;
};

export const editPreset = async (preset: PresetDto): Promise<PresetDto> => {
    console.log('Mocked editPreset called with preset:', preset);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = presets.findIndex(p => p.id === preset.id);
    if (index === -1) {
        throw new Error('Preset not found');
    }
    presets[index] = { ...preset};
    return presets[index];
};

export const deletePreset = async (id: number): Promise<void> => {
    console.log(`Mocked deletePreset called with id: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = presets.findIndex(p => p.id === id);
    if (index !== -1) {
        presets[index];
    }
};