import { useEffect, useState } from "react";
import { Button, Card, CardBody, Nav, Navbar } from "react-bootstrap";
import "./SchoolingProgressBar.scss";
import SchoolingProgressBarElement from "./SchoolingProgressBarElement";
import fileService from "../../../services/fileService";
import { FileDto } from "../../../dtos/FileDto";
import { SchoolingDto } from "../../../dtos/SchoolingDto";

interface SchoolingProgressBarProps {
  onOpen(value: boolean): void;
  schooling?: SchoolingDto;
  resize?(isToSmall: boolean): void;
}
const SchoolingProgressBar: React.FC<SchoolingProgressBarProps> = ({
  onOpen,
  schooling,
  resize,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [lastElement, setLastElement] = useState<number>(0);
  const [icons, setIcons] = useState<{ [key: number]: File | null }>({});
  const [noPlace, setNoPlace] = useState(window.innerWidth < 1250);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1250px)");

    const handleMediaChange = (e: MediaQueryListEvent) => {
      console.log(e.matches);
      setNoPlace(e.matches)
      resize?.(e.matches)
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    handleClickNavLink()
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    onOpen(isOpen);
  },[isOpen])

  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleClickNavLink = () => {
    if (noPlace) {
      setIsOpen(false);
    }
  }
  useEffect(() => {
    var schoolingPartProgressBar = schooling?.schoolingParts;
    setLastElement(schoolingPartProgressBar?.[schoolingPartProgressBar.length - 1]?.order!);
  },[schooling])

  useEffect(() => {


  }, [schooling]);



  return (
    <>
      {noPlace ? 
        <>
          <div className={`schooling-progress-bar d-flex position-sticky justify-content-between align-items-baseline top-0`}>
            <div className="ps-4">
              <h3>View Course Content</h3>
            </div>
            <div className="pe-5">
              <Button
                onClick={() => {
                  toggleSidebar()
                }}
                className={`acc-button ${isOpen ? 'open' : 'closed'}`}
                >
                <i className="bi bi-chevron-down"></i>              
              </Button>
            </div>
          </div>
          <hr/>
          {isOpen 
            &&
            <div className="schooling-progress-bar position-absolute m-0 p-0 w-100 h-100" style={{ zIndex: 1000}}>
              <Card className="m-0 p-0  h-100 border-0">
                <CardBody className="align-items-center d-flex flex-column">
                  <Navbar expand="lg" className="flex-column p-0 m-0 w-100">
                  <Nav className="flex-column p-0 m-0  ">
                  <Nav.Link className="sidebar-navlink" href={schooling?.id ? `/Schooling/${schooling.id}` : "#"}>
                    <SchoolingProgressBarElement 
                      showVl = {false}
                      hide = {isOpen} 
                      title={schooling?.title ?? ""} 
                      img={icons[0] ?? undefined}
                      Id={0}
                      />
                  </Nav.Link>
                  <hr className="border border-1 opacity-100 m-0"/>
                  {
                    schooling?.schoolingParts?.map((part, index) => (
                      <Nav.Link key={index} className="sidebar-navlink" onClick={handleClickNavLink} href={part.id ? `/Schooling/${schooling.id}/part/${part.id}` : "#"}>
                        <SchoolingProgressBarElement 
                          showVl = {part.order != lastElement} 
                          hide = {isOpen} 
                          title={part.title ?? ""} 
                          img={icons[index+1] ?? undefined}
                          Id={part.id}
                          />
                      </Nav.Link>
                    ))
                  }                  
                  </Nav>
                  </Navbar>
                </CardBody>
              </Card>
            </div>
          }
        </>
      :
        <div className="schooling-progress-bar sidebar-container">
          <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
              <Navbar expand="lg" className="flex-column p-0 m-0">
              <Nav className="flex-column p-0 m-0" >
              <Nav.Link className="sidebar-navlink" href={schooling?.id ? `/Schooling/${schooling.id}` : "#"}>
                <SchoolingProgressBarElement 
                  showVl = {false}
                  hide = {isOpen}  
                  title={schooling?.title ?? ""} 
                  img={icons[0] ?? undefined}
                  Id={0}
                  />
              </Nav.Link>
              <hr className="border border-1 opacity-100 m-0"/>
                  {
                    schooling?.schoolingParts?.map((part, index) => (
                      <Nav.Link key={index} className="sidebar-navlink" href={part.id ? `/Schooling/${schooling.id}/part/${part.id}` : "#"}>
                        <SchoolingProgressBarElement 
                          showVl = {part.order != lastElement} 
                          hide = {isOpen} 
                          title={part.title ?? ""} 
                          img={icons[index+1] ?? undefined}
                          Id={part.id}
                          />
                      </Nav.Link>
                    ))
                  }
                </Nav>
              </Navbar>
          </div>
            <Button
              onClick={toggleSidebar}
              className={`sidebar-button ${isOpen ? 'open' : 'closed'}`}
            >
              <i className="bi bi-arrow-left-square"></i>
            </Button>
        </div>
      }
    </>    

  );
};
export default SchoolingProgressBar;