"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, Offcanvas } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

export default function Inventory() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [productTypes, setProductTypes] = useState([]);

    const router = useRouter();
    const { data: session, status } = useSession();

    const [show, setShow] = useState(false); // Stato per gestire la visibilità dell'Offcanvas
    const handleClose = () => setShow(false); // Funzione per chiudere l'Offcanvas
    const handleShow = () => setShow(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleSelectChange = (event) => {
        setSelectedType(event.target.value);
    };

    useEffect(() => {
        if(status === "loading") return;
        if(!session) router.push('/login');

        const fetchProductTypes = async () => {
            try {
                const response = await fetch('http://localhost:4567/product_types', {
                    method: 'GET', // Usa POST se stai seguendo il tuo design
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Errore nella risposta del server');
                }

                const data = await response.json();
                // console.log(data);
                setProductTypes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductTypes();

    }, [session, status, router]);

    if (status === "loading") {
        return <div>Caricamento...</div>
    }

    if (!session) {
        return null; // This will prevent the page content from flashing before redirect
    }
    return(
        <div className="container">
            <h1 className="text-center">Inventario</h1>
            <div className="d-flex justify-content-end me-5">
                <Button onClick={handleShow}><FontAwesomeIcon icon={faPlus} /></Button>
                <Offcanvas show={show} onHide={handleClose} placement="end">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Aggiungi Prodotto</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {/* Inserisci qui il contenuto dell'Offcanvas */}
                        <form>
                            <div className="mb-3">
                                <label htmlFor="productName" className="form-label">Nome Prodotto *</label>
                                <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-control" id="productName" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="productDescription" className="form-label">Descrizione *</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" id="productDescription" rows="3"></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="productCategory" className="form-label">Seleziona Tipo *</label>
                                <br></br>
                                <select id="productTypeSelect" value={selectedType} onChange={handleSelectChange}>
                                    <option value="">Scegli un tipo</option> {/* Opzione di default */}
                                    {productTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.type}</option>
                                    ))}
                                </select>
                                {/* Mostra il tipo selezionato */}
                                {selectedType && <div>Tipo di prodotto selezionato: {selectedType}</div>}
                            </div>
                            <Button variant="primary" type="submit">Aggiungi</Button>
                        </form>
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
            <table className="table table-striped mt-5">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Description</th>
                        <th scope="col">Categoria</th>
                        <th scope="col">Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            1
                        </td>
                        <td>
                            TV
                        </td>
                        <td>
                            Televisore Samsung 55"
                        </td>
                        <td>
                            Elettronica
                        </td>
                        <td>
                            <Button variant="secondary" className="me-2"><FontAwesomeIcon icon={faEye} /></Button>
                            <Button variant="warning" className="me-2"><FontAwesomeIcon icon={faPen} /></Button>
                            <Button variant="danger"><FontAwesomeIcon icon={faTrash} /></Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}