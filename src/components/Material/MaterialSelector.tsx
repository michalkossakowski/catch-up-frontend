import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup, Form } from "react-bootstrap";
import { MaterialDto } from "../../dtos/MaterialDto";


interface MaterialSelectorProps {
    show: boolean;
    onHide: () => void;
    materials: MaterialDto[];
    toggleSelection: (id: number) => void;
    submitSelection: () => void;
    clearSelectedMaterials: () => void;
  }

const MaterialSelector: React.FC<MaterialSelectorProps> =  ({
    show,
    onHide,
    materials,
    toggleSelection,
    submitSelection,
    clearSelectedMaterials,
}) => {
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);

  useEffect(() => {
    if (show) {
      setSelectedMaterialId(null);
    }
  }, [show]);

  const handleRadioChange = (id: number) => {
    setSelectedMaterialId(id);
    toggleSelection(id);
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        clearSelectedMaterials();
        onHide();
      }}
      backdrop="static"
      aria-labelledby="materialSelectionLabel"
    >
      <Modal.Header closeButton>
        <Modal.Title id="materialSelectionLabel">Select Material</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {materials && materials.length > 0 ? (
          <ListGroup>
            {materials.map((material) => (
              <ListGroup.Item key={material.id}>
                <Form.Check
                  type="radio"
                  id={`material-${material.id}`}
                  name="materialSelection"
                  label={material.name}
                  value={material.id}
                  checked={selectedMaterialId === material.id}
                  onChange={() => handleRadioChange(material.id ?? 0)}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No materials available.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            clearSelectedMaterials();
            onHide();
          }}
        >
          Close
        </Button>
        {materials && materials.length > 0 && (
          <Button 
            variant="primary" 
            onClick={submitSelection}
            disabled={selectedMaterialId === null}
          >
            Submit
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default MaterialSelector;
