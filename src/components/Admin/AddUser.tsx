import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { addUser } from '../../services/userService';
import { UserDto } from '../../dtos/UserDto';
import './AddUser.css';
import NotificationToast from '../Toast/NotificationToast';

export default function UserEdit(): React.ReactElement {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [name, setName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [position, setPosition] = useState<string>('');

    const [isNameValid, setNameValid] = useState<boolean>(false);
    const [isSurnameValid, setSurnameValid] = useState<boolean>(false);
    const [isEmailValid, setEmailValid] = useState<boolean>(false);
    const [isPasswordValid, setPasswordValid] = useState<boolean>(false);
    const [isConfirmPasswordValid, setConfirmPasswordValid] = useState<boolean>(false);
    const [isPositionValid, setPositionValid] = useState<boolean>(false);
    const [isTypeValid, setTypeValid] = useState<boolean>(false);  

    const validRoles = ['Newbie', 'Mentor', 'HR', 'Admin'];
setName
    const validateName = (value: string) => {
        setNameValid(value.length >= 3);
        setName(value);
    };

    const validateSurname = (value: string) => {
        setSurnameValid(value.length >= 3);
        setSurname(value);
    };

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailValid(emailRegex.test(value));
        setEmail(value);
    };

    const validatePassword = (value: string) => {
        const isValid = /[^A-Za-z0-9]/.test(value) && /\d/.test(value) && /[a-z]/.test(value) && /[A-Z]/.test(value);
        setPasswordValid(isValid && value.length >= 6);
        setPassword(value);
    };

    const validateConfirmPassword = (value: string) => {
        setConfirmPasswordValid(value === password);
        setConfirmPassword(value);
    };

    const validatePosition = (value: string) => {
        setPositionValid(value.length >= 3);
        setPosition(value);
    };

    const validateType = (value: string) => {
        setTypeValid(validRoles.includes(value));
        setType(value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isNameValid 
            || !isSurnameValid 
            || !isEmailValid 
            || !isPasswordValid 
            || !isConfirmPasswordValid 
            || !isPositionValid
            || !isTypeValid) {
            return;
        }

        const newUser: UserDto = {
            id: undefined,
            name,
            surname,
            email,
            password,
            type,
            position,
        };

        await addUser(newUser);

        setToastMessage(`User successfully added !`);
        setShowToast(true);

        setName('');
        setSurname('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setType('');
        setPosition('');
        setNameValid(false);
        setSurnameValid(false);
        setEmailValid(false);
        setPasswordValid(false);
        setConfirmPasswordValid(false);
        setPositionValid(false);
        setTypeValid(false);
    };

    return (
        <section className="user-edit-box">
            <form onSubmit={handleSubmit} className="container-lg">
                <h2>Add New User</h2>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        className={`form-control ${!isNameValid ? 'is-invalid' : ''}`}
                        value={name}
                        onChange={(e) => validateName(e.target.value)}
                        required
                    />
                    {!isNameValid && (
                        <div className="invalid-feedback">
                            Name must be at least 3 characters long
                        </div>
                    )}
                </div>
                <br />
                <div className="form-group">
                    <label htmlFor="surname">Surname:</label>
                    <input
                        type="text"
                        id="surname"
                        className={`form-control ${!isSurnameValid ? 'is-invalid' : ''}`}
                        value={surname}
                        onChange={(e) => validateSurname(e.target.value)}
                        required
                    />
                    {!isSurnameValid && (
                        <div className="invalid-feedback">
                            Surname must be at least 3 characters long
                        </div>
                    )}
                </div>
                <br />
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className={`form-control ${!isEmailValid ? 'is-invalid' : ''}`}
                        value={email}
                        onChange={(e) => validateEmail(e.target.value)}
                        autoComplete="off"
                        required
                    />
                    {!isEmailValid && (
                        <div className="invalid-feedback">
                            Email must look like: 'example@domain.com'
                        </div>
                    )}
                </div>
                <br />
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        className={`form-control ${!isPasswordValid ? 'is-invalid' : ''}`}
                        value={password}
                        onChange={(e) => validatePassword(e.target.value)}
                        autoComplete="new-password"
                        required
                    />
                    {!isPasswordValid && (
                        <div className="invalid-feedback">
                            Password must be at least 6 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character.
                        </div>
                    )}
                </div>
                <br />
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className={`form-control ${!isConfirmPasswordValid ? 'is-invalid' : ''}`}
                        value={confirmPassword}
                        onChange={(e) => validateConfirmPassword(e.target.value)}
                        required
                    />
                    {!isConfirmPasswordValid && (
                        <div className="invalid-feedback">
                            Password confimation must match password
                        </div>
                    )}
                </div>
                <br />
                <div className="form-group">
                    <label htmlFor="type">User Type:</label>
                    <select
                        id="type"
                        className={`form-control ${!isTypeValid ? 'is-invalid' : ''}`}
                        value={type}
                        onChange={(e) => validateType(e.target.value)}
                        required
                    >
                        <option value="">Select User Type</option>
                        <option value="Newbie">Newbie</option>
                        <option value="Mentor">Mentor</option>
                        <option value="HR">HR</option>
                        <option value="Admin">Admin</option>
                    </select>
                    {!isTypeValid && (
                        <div className="invalid-feedback">
                            Type must be selected
                        </div>
                    )}
                </div>
                <br />
                <div className="form-group">
                    <label htmlFor="position">Position:</label>
                    <input
                        type="text"
                        id="position"
                        className={`form-control ${!isPositionValid ? 'is-invalid' : ''}`}
                        value={position}
                        onChange={(e) => validatePosition(e.target.value)}
                        required
                    />
                    {!isPositionValid && (
                        <div className="invalid-feedback">
                            Position must be at least 3 characters long.
                        </div>
                    )}
                </div>
                <div className="buttonBox">
                    <Button type="submit" variant="primary" disabled={!isNameValid || !isSurnameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isPositionValid || !isTypeValid}>
                        Add New User
                    </Button>
                </div>
            </form>

                <NotificationToast 
                    show={showToast} 
                    title={"User operation info"} 
                    message={toastMessage} 
                    color={"green"} 
                    onClose={() => setShowToast(false)} />
        </section>
    );
}
