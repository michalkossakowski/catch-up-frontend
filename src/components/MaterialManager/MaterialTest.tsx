import MaterialItem from "./MaterialItem";

const MaterialTest: React.FC = () => {
    return (
        <>
            <MaterialItem 
                enableRemoveFile={true}
                enableDownloadFile={true}
                enableEdittingMaterialName={true}
                enableAddingFile={true}
                enableEdittingFile={true}
                />
        </>
    );
};

export default MaterialTest;