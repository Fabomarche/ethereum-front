import React, { useEffect, useState } from 'react'
import config from '../../config/config'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Alert, ListGroup } from 'react-bootstrap'
import { FaHeart, FaEdit } from 'react-icons/fa';
import { IoMdCheckmark, IoMdClose } from 'react-icons/io'

import './style.css'

const Home = () => {
    const navigate = useNavigate()
    const [address, setAddress] = useState('')
    const [isWalletOld, setIsWalletOld] = useState(false)
    const [balance, setBalance] = useState(0)
    const [ethPrices, setEthPrices] = useState()
    const [selectedCurrency, setSelectedCurrency] = useState('usd');
    const [isOpenEditor, setIsOpenEditor] = useState(false)
    const [editorValue, setEditorValue] = useState(0)
    const [favouritesWallets, setFavouritesWallets] = useState([])

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/');
        }

        ethPricefetch()
        setFavouritesWallets(JSON.parse(localStorage.getItem('favourites')))
    }, [navigate]);

    const searchAddress = async (e) => {
        e.preventDefault()
        console.log('search')
        walletBalanceFetch()
        isWalletOldFetch()

    }

    const isWalletOldFetch = async () => {
        console.log("wallet ej")
        try {
            const response = await fetch(config.development.backendUrl + `/api/etherscan/txlist?address=${address}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            if (response.ok) {
                const data = await response.json();
                console.log("iswallet?")
                setIsWalletOld(data)
            } else {
                console.error('isWalletOld failed');
            }
        } catch (error) {
            console.error('Request error:', error);
        }
    }

    const walletBalanceFetch = async () => {
        console.log("balance ej")
        try {

            const response = await fetch(config.development.backendUrl + `/api/etherscan/balance?address=${address}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            if (response.ok) {
                const data = await response.json();
                setBalance(data.toFixed(2))
            } else {
                console.error('walletBalanceFetch failed');
            }

        } catch (err) {
            console.error('Request error:', err);
        }
    }

    const ethPricefetch = async () => {
        try {

            const response = await fetch(config.development.backendUrl + `/api/etherscan/ethprice`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            if (response.ok) {
                const data = await response.json();
                setEthPrices(data)
            } else {
                console.error('walletBalanceFetch failed');
            }

        } catch (err) {
            console.error('Request error:', err);
        }
    }

    const handleCurrencyChange = (event) => {
        setSelectedCurrency(event.target.value);
    };

    const openEditor = () => {
        setEditorValue(balance)
        setIsOpenEditor(true)
    }


    const cancelEdit = () => {
        setIsOpenEditor(false)
    }

    const confirmEdit = () => {
        setBalance(editorValue)
        setIsOpenEditor(false)
    }


    const addTofavourites = async () => {
        try {
            const response = await fetch(config.development.backendUrl + `/api/user/favourite`, {
                method: 'PUT',
                body: JSON.stringify({
                    address: address,
                    userId: localStorage.getItem('userId')
                }),
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            if (response.ok) {
                const data = await response.json();
                setFavouritesWallets([...favouritesWallets, address])
                console.log({ data })

            } else {
                console.error('addTofavourites failed');
            }




        } catch (err) {
            console.log("error in add to favourites: ", err)
        }
    }

    const selectWallet = (address) => {
        setAddress(address)
        searchAddress()
    }

    return (
        <Col md={9} className='mt-5'>
            <Row>
                <Col>
                    <Form >
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Search Wallet's Address</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the wallet addres"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />

                        </Form.Group>

                        <Col className='mt-2' >

                            <Button onClick={e => searchAddress(e)} className='me-2' >
                                Search
                            </Button>

                            <Button onClick={addTofavourites} variant="outline-danger">
                                <FaHeart />
                            </Button>

                        </Col>
                    </Form>
                </Col>
            </Row>
            {isWalletOld &&
                <Row className='mt-3' >
                    <Alert variant="danger">Wallet is old!</Alert>
                </Row>
            }
            <Row className='mt-3'>
                <Col>
                    <Alert className='cards'>

                        {!isOpenEditor && <FaEdit className='edit-icon' onClick={openEditor} />}

                        {isOpenEditor ?
                            <Col>
                                <Row className='edit-icons-container'>
                                    <IoMdClose className='cancel-icon' onClick={cancelEdit} />
                                    <IoMdCheckmark className='confirm-icon' onClick={confirmEdit} />
                                </Row>


                                <Form.Control
                                    type='text'
                                    onChange={e => setEditorValue(e.target.value)}
                                    value={editorValue}
                                />
                            </Col>

                            :

                            <span>eth {balance}</span>

                        }



                    </Alert>
                </Col>

                <Col>
                    <Alert className='cards'>
                        <Form.Select onChange={handleCurrencyChange} value={selectedCurrency} className='w-50 mb-2'>
                            <option value="usd">USD</option>
                            <option value="euro">Euro</option>
                        </Form.Select>

                        {balance && ethPrices &&

                            <span>{(balance * ethPrices[selectedCurrency]).toFixed(2)} $</span>

                        }
                        {console.log(ethPrices && ethPrices[selectedCurrency])}

                    </Alert>
                </Col>
            </Row>
            <Row>
                <ListGroup>
                    <ListGroup.Item variant='primary'>Favourites Wallets</ListGroup.Item>
                    {favouritesWallets.map(address => <ListGroup.Item action onClick={() => selectWallet(address)}>{address}</ListGroup.Item>)}
                </ListGroup>
            </Row>
        </Col>
    )
}

export default Home