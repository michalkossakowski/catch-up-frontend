import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

interface TooltipButtonProps {
    tooltipText: string;
    onClick: () => void;
    variant?: string;
    placement?: "top" | "bottom" | "left" | "right";
    children: React.ReactNode;
}

const TooltipButton: React.FC<TooltipButtonProps> = ({ tooltipText, onClick, variant, children, placement }) => (
  <OverlayTrigger placement="top" overlay={<Tooltip>{tooltipText}</Tooltip>}  key={placement}>
    <Button variant={variant || "outline-secondary"} onClick={onClick}>
      {children}
    </Button>
  </OverlayTrigger>
);
export default TooltipButton;
