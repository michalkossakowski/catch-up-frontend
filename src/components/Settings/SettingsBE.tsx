import { Form } from "react-bootstrap";


const SettingsBE: React.FC = () => {
    return(
        <>
           <h3>Settings kept in the database:</h3>
            <div className='settings-list'>
                <div className='single-setting'>
                    Placeholder
                    <Form>
                        <Form.Check 
                            type="switch"
                            id="placeholder-id"
                        />
                    </Form>
                </div>
                <div className='single-setting'>
                    Placeholder
                    <Form>
                        <Form.Check 
                            type="switch"
                            id="placeholder-id"
                        />
                    </Form>
                </div>
            </div>
        </>
    );

}

export default SettingsBE;