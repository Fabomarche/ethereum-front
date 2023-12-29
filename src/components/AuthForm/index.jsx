import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import config from '../../config/config';

const AuthForm = () => {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch(config.development.backendUrl + '/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log({ responseData })
                const token = responseData.token;
                const userId = responseData.userId
                const userFavourites = responseData.userFavourites
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                localStorage.setItem('favourites', JSON.stringify(userFavourites))
                navigate('/home')

            } else {
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Request error:', error);
        }
    };

    const HandleSignUp = async () => {
        try {
            const response = await fetch(config.development.backendUrl + '/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                handleToggleForm()
                console.error('Register success');

            } else {
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Request error:', error);
        }
    }

    const handleToggleForm = () => {
        setShowLogin(!showLogin);
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    {showLogin ? (
                        <>
                            <h2>Login</h2>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Button variant="primary" onClick={handleLogin}>
                                    Sign In
                                </Button>
                            </Form>
                            <p>
                                Not registered yet?{' '}
                                <span className="link" onClick={handleToggleForm}>
                                    Sign up here
                                </span>
                            </p>
                        </>
                    ) : (
                        <>
                            <h2>Sign Up</h2>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Button variant="success" onClick={HandleSignUp}>
                                    Sign Up
                                </Button>
                            </Form>
                            <p>
                                Already have an account?{' '}
                                <span className="link" onClick={handleToggleForm}>
                                    Log in here
                                </span>
                            </p>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default AuthForm;
