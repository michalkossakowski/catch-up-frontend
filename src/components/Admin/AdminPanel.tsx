import AddUser from './AddUser';
import {Alert} from 'react-bootstrap';

function AdminPanel({ isAdmin }: { isAdmin: boolean }) {

    return (
        <>
            <div className='d-flex justify-content-center p-4'>
                {isAdmin ? (
                    <AddUser/>
                ):
                (
                    <Alert className='alert' variant='danger'>
                        You don't have access to Admin Panel
                    </Alert>
                )}

            </div>
        </>
    );
}

export default AdminPanel;