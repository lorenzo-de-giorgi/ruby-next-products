"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, Offcanvas, FormSelect } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

export default function Inventory() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [productTypes, setProductTypes] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const router = useRouter();
    const { data: session, status } = useSession();

    const [show, setShow] = useState(false); // Stato per gestire la visibilità dell'Offcanvas
    const handleClose = () => setShow(false); // Funzione per chiudere l'Offcanvas
    const handleShow = ( product = null ) => {
        if(product){
            setName(product.name);
            setDescription(product.description);
            setSelectedType(product.category);
            setSelectedProduct(product);
        } else {
            setName('');
            setDescription('');
            setSelectedType('');
            setSelectedProduct('');
        }
        setShow(true);
    }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleSelectChange = (e) => {
        setSelectedType(e.target.value);
    };

    useEffect(() => {
        if(status === "loading") return;
        if(!session) router.push('/login');

        const fetchProductTypes = async () => {
            try {
                const response = await axios.get('http://localhost:4567/product_types');
                setProductTypes(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:4567/products');
                setProducts(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProductTypes();
        fetchProducts(); 

    }, [session, status, router]);

    const handleProductCreation = async (e) => {
        e.preventDefault();

        if (!name || !description || !selectedType) {
            alert("Compila tutti i campi obbligatori");
            return;
        }

        if (!name || !description || !selectedType) {
            alert("Compila tutti i campi obbligatori");
            return;
        }

        try {
            // Ottienengo user_id dalla sessione
            const userId = session.user.id;

            const productData = {
            user_id: userId,
            product_type_id: selectedType,
            name: name,
            description: description
            };

            // Invio della richiesta al server
            const response = await axios.post('http://localhost:4567/create_product', productData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Gestisci la risposta del server
            if (response.status === 201) {
            alert('Prodotto creato con successo');
            handleClose(); // Chiudi l'Offcanvas dopo il successo
            router.reload(); // Ricarica la pagina o aggiorna la lista dei prodotti
            } else {
            alert(`Errore: ${response.data.error}`);
            }
        } catch (error) {
            console.error("Errore durante la creazione del prodotto", error);
            alert("Errore durante la creazione del prodotto");
        }
    }

    const handleProductUpdate = async (e) => {
        e.preventDefault();

        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:4567/products');
                setProducts(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        if (!name || !description || !selectedType) {
            alert("Compila tutti i campi obbligatori");
            return;
        }

        try {
            const userId = session.user.id;

            const productData = {
                user_id: userId,
                product_type_id: selectedType,
                name: name,
                description: description
            };

            const response = await axios.put(`http://localhost:4567/update_product/${selectedProduct.id}`, productData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                alert('Prodotto aggiornato con successo');
                handleClose();
                fetchProducts();
            } else {
                alert(`Errore: ${response.data.error}`);
            }
        } catch (error) {
            console.error("Errore durante l'aggiornamento del prodotto", error);
            alert("Errore durante l'aggiornamento del prodotto");
        }

    }

    const handleProductDelete = async (productId) => {
        if(window.confirm("Sei sicuro di voler cancellare questo prodotto?")){
            try {
                const response = await axios.delete(`http://localhos:4567/delete_product/${productId}`);
                if (response.status === 204) {
                    alert('Prodotto eliminato con successo');
                    // Ricarica i prodotti o aggiorna lo stato
                    setProducts(products.filter(product => product.id !== productId));
                } else {
                    alert(`Errore: ${response.data.error}`);
                }
            } catch (error) {
                console.error("Errore durante l'eliminazione del prodotto", error);
                alert("Errore durante l'eliminazione del prodotto");
            }
        }
    }

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
                        <Offcanvas.Title>{selectedProduct ? "Modifica Prodotto" : "Aggiungi Prodotto"}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
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
                                <FormSelect id="productTypeSelect" value={selectedType} onChange={handleSelectChange}>
                                    <option value="">Scegli un tipo</option>
                                    {productTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.type}</option>
                                    ))}
                                </FormSelect>
                                {selectedType && <div>Tipo di prodotto selezionato: {selectedType}</div>}
                            </div>
                            <Button onClick={selectedProduct ? handleProductUpdate : handleProductCreation} variant="primary" type="submit">
                                {selectedProduct ? "Salva" : "Aggiungi"}
                            </Button>
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
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.category}</td>
                            <td>
                                <Button variant="secondary" className="me-2"><FontAwesomeIcon icon={faEye} /></Button>
                                <Button variant="warning" onClick={() => handleShow(product)} className="me-2"><FontAwesomeIcon icon={faPen} /></Button>
                                <Button variant="danger" onClick={() => handleProductDelete(product.id)}><FontAwesomeIcon icon={faTrash} /></Button>
                            </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}