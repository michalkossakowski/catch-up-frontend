import { useEffect, useState } from "react";
import { Button, Card, CardBody, Nav, Navbar } from "react-bootstrap";
import "./SchoolingProgressBar.css";
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
    var schoolingPartProgressBar = schooling?.schoolingPartProgressBar;
    setLastElement(schoolingPartProgressBar?.[schoolingPartProgressBar.length - 1]?.order!);
  },[schooling])

  useEffect(() => {
    const fetchIcons = async () => {
      const iconsObj: { [key: number]: File | null } = {};
      if (schooling) {
        const file = schooling.iconFile ? await downloadIconFile(schooling.iconFile) : null;
        iconsObj[0] = file;
        await Promise.all(
          schooling.schoolingPartProgressBar.map(async (part, index) => {
            if (part.fileIcon) {
              const file = await downloadIconFile(part.fileIcon);
              iconsObj[index+1] = file;
            }
          })
        );
        setIcons(iconsObj);
      }
    };
  
    fetchIcons();
  }, [schooling]);

  const downloadIconFile = async (fileDto: FileDto): Promise<File> => {
    const blob = await fileService.downloadFile(fileDto.id!);
    return new File([blob], fileDto.name ?? "File Icon", { type: fileDto.type });
  }

  const schoolingIsDone = () => {
    return schooling?.schoolingPartProgressBar.every((part) => part.isDone) ?? false;
  }
  return (
    <>
      {noPlace ? 
        <>
          <div className={`d-flex position-sticky justify-content-between align-items-baseline top-0`}>
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
            <div className="position-absolute m-0 p-0 w-100 h-100" style={{ zIndex: 1000}}>
              <Card className="m-0 p-0  h-100">
                <CardBody className="align-items-center d-flex flex-column">
                  <Navbar expand="lg" className="flex-column p-0 m-0 w-100">
                  <Nav className="flex-column p-0 m-0  ">
                  <Nav.Link className="sidebar-navlink" href={schooling?.id ? `/Schooling/${schooling.id}` : "#"}>
                    <SchoolingProgressBarElement 
                      showVl = {false}
                      hide = {isOpen} 
                      isDone = {schoolingIsDone()} 
                      title={schooling?.title ?? ""} 
                      img={icons[0] ?? undefined}
                      Id={0}
                      />
                  </Nav.Link>
                  <hr className="border border-2 opacity-100 m-0"/>
                  {
                    schooling?.schoolingPartProgressBar?.map((part, index) => (
                      <Nav.Link key={index} className="sidebar-navlink" onClick={handleClickNavLink} href={part.id ? `/Schooling/${schooling.id}/part/${part.id}` : "#"}>
                        <SchoolingProgressBarElement 
                          showVl = {part.order != lastElement} 
                          hide = {isOpen} 
                          isDone = {part.isDone} 
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
        <div className="sidebar-container">
          <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
              <Navbar expand="lg" className="flex-column p-0 m-0">
              <Nav className="flex-column p-0 m-0" >
              <Nav.Link className="sidebar-navlink" href={schooling?.id ? `/Schooling/${schooling.id}` : "#"}>
                <SchoolingProgressBarElement 
                  showVl = {false}
                  hide = {isOpen} 
                  isDone = {schoolingIsDone()} 
                  title={schooling?.title ?? ""} 
                  img={icons[0] ?? undefined}
                  Id={0}
                  />
              </Nav.Link>
              <hr className="border border-2 opacity-100 m-0"/>
                  {
                    schooling?.schoolingPartProgressBar?.map((part, index) => (
                      <Nav.Link key={index} className="sidebar-navlink" href={part.id ? `/Schooling/${schooling.id}/part/${part.id}` : "#"}>
                        <SchoolingProgressBarElement 
                          showVl = {part.order != lastElement} 
                          hide = {isOpen} 
                          isDone = {part.isDone} 
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