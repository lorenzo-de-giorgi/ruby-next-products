"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, Offcanvas } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Inventory() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [show, setShow] = useState(false); // Stato per gestire la visibilità dell'Offcanvas

    const handleClose = () => setShow(false); // Funzione per chiudere l'Offcanvas
    const handleShow = () => setShow(true);

    useEffect(() => {
        if(status === "loading") return;
        if(!session) router.push('/login');
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
                                <label htmlFor="productName" className="form-label">Nome Prodotto</label>
                                <input type="text" className="form-control" id="productName" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="productDescription" className="form-label">Descrizione</label>
                                <textarea className="form-control" id="productDescription" rows="3"></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="productCategory" className="form-label">Categoria</label>
                                <input type="text" className="form-control" id="productCategory" />
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