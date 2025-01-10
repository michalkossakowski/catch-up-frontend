import React from "react";
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
  const handleCheckboxChange = (id: number) => {
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
        <Modal.Title id="materialSelectionLabel">Select Materials</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {materials && materials.length > 0 ? (
          <ListGroup>
            {materials.map((material) => (
              <ListGroup.Item key={material.id}>
                <Form.Check
                  type="checkbox"
                  id={`material-${material.id}`}
                  label={material.name}
                  value={material.id}
                  onChange={() => handleCheckboxChange(material.id ?? 0)}
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
          <Button variant="primary" onClick={submitSelection}>
            Submit
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default MaterialSelector;
