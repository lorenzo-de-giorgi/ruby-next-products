"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, Offcanvas, FormSelect, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import Link from "next/link";

export default function Inventory() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [productTypes, setProductTypes] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const router = useRouter();
    const { data: session, status } = useSession();

    // Stati per gestire la visibilità dei diversi Offcanvas
    const [showCreationOffCanvas, setShowCreationOffCanvas] = useState(false);
    const [showUpdateOffCanvas, setShowUpdateOffCanvas] = useState(false);

    // Funzioni per chiudere gli Offcanvas
    const handleCloseCreationOffCanvas = () => setShowCreationOffCanvas(false);
    const handleCloseUpdateOffCanvas = () => setShowUpdateOffCanvas(false);

    // Funzioni per mostrare gli Offcanvas
    const handleShowCreationOffCanvas = () => {
        setName('');
        setDescription('');
        setSelectedType('');
        setSelectedProduct(null);
        setShowCreationOffCanvas(true);
    };

    const handleShowUpdateOffCanvas = (product) => {
        setName(product.name);
        setDescription(product.description);
        setSelectedType(product.category);
        setSelectedProduct(product);
        setShowUpdateOffCanvas(true);
    };

    const handleDetailClose = () => setShowDetail(false);
    const handleShowDetail = (product) => {
        setSelectedProduct(product);
        setShowDetail(true);
    };

    const handleSelectChange = (e) => setSelectedType(e.target.value);

    useEffect(() => {
        if (status === "loading") return;
        if (!session) router.push('/login');

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

        try {
            const userId = session.user.id;

            const productData = {
                user_id: userId,
                product_type_id: selectedType,
                name: name,
                description: description
            };

            const response = await axios.post('http://localhost:4567/create_product', productData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 201) {
                alert('Prodotto creato con successo');
                handleCloseCreationOffCanvas();
                router.reload();
            } else {
                alert(`Errore: ${response.data.error}`);
            }
        } catch (error) {
            console.error("Errore durante la creazione del prodotto", error);
            alert("Errore durante la creazione del prodotto");
        }
    };

    const handleProductUpdate = async (e) => {
        e.preventDefault();

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
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 200) {
                alert('Prodotto aggiornato con successo');
                handleCloseUpdateOffCanvas();
                setProducts(products.map(p => (p.id === selectedProduct.id ? response.data : p)));
            } else {
                alert(`Errore: ${response.data.error}`);
            }
        } catch (error) {
            console.error("Errore durante l'aggiornamento del prodotto", error);
            alert("Errore durante l'aggiornamento del prodotto");
        }
    };

    const handleProductDelete = async (productId) => {
        if (window.confirm("Sei sicuro di voler cancellare questo prodotto?")) {
            try {
                const response = await axios.delete(`http://localhost:4567/delete_product/${productId}`);
                if (response.status === 204) {
                    alert('Prodotto eliminato con successo');
                    setProducts(products.filter(product => product.id !== productId));
                } else {
                    alert(`Errore: ${response.data.error}`);
                }
            } catch (error) {
                console.error("Errore durante l'eliminazione del prodotto", error);
                alert("Errore durante l'eliminazione del prodotto");
            }
        }
    };

    if (status === "loading") return <div>Caricamento...</div>;

    if (!session) return null; // Prevent content flash before redirect

    return (
        <div className="container">
            <h1 className="text-center">Inventario</h1>
            <div className="d-flex justify-content-end me-5">
                <Button onClick={handleShowCreationOffCanvas}><FontAwesomeIcon icon={faPlus} /></Button>
                {/* Offcanvas for Product Creation */}
                <Offcanvas show={showCreationOffCanvas} onHide={handleCloseCreationOffCanvas} placement="end">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Aggiungi Prodotto</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <form onSubmit={handleProductCreation}>
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
                                <br />
                                <FormSelect id="productTypeSelect" value={selectedType} onChange={handleSelectChange}>
                                    <option value="">Scegli un tipo</option>
                                    {productTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.type}</option>
                                    ))}
                                </FormSelect>
                                {selectedType && <div>Tipo di prodotto selezionato: {selectedType}</div>}
                            </div>
                            <Button variant="primary" type="submit">Crea</Button>
                        </form>
                    </Offcanvas.Body>
                </Offcanvas>

                {/* Offcanvas for Product Update */}
                <Offcanvas show={showUpdateOffCanvas} onHide={handleCloseUpdateOffCanvas} placement="end">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Modifica Prodotto</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <form onSubmit={handleProductUpdate}>
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
                                <br />
                                <FormSelect id="productTypeSelect" value={selectedType} onChange={handleSelectChange}>
                                    <option value="">Scegli un tipo</option>
                                    {productTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.type}</option>
                                    ))}
                                </FormSelect>
                                {selectedType && <div>Tipo di prodotto selezionato: {selectedType}</div>}
                            </div>
                            <Button variant="primary" type="submit">Aggiorna</Button>
                        </form>
                    </Offcanvas.Body>
                </Offcanvas>
            </div>

            <table className="table table-striped mt-5">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Descrizione</th>
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
                                <Link href={`/products/${product.id}`}><Button variant="secondary" className="me-2"><FontAwesomeIcon icon={faEye} /></Button></Link>
                                <Button variant="warning" onClick={() => handleShowUpdateOffCanvas(product)} className="me-2"><FontAwesomeIcon icon={faPen} /></Button>
                                <Button variant="danger" onClick={() => handleProductDelete(product.id)}><FontAwesomeIcon icon={faTrash} /></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showDetail} onHide={handleDetailClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Dettagli Prodotto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProduct && (
                        <div>
                            <h5>Nome: {selectedProduct.name}</h5>
                            <p><strong>Descrizione:</strong> {selectedProduct.description}</p>
                            <p><strong>Categoria:</strong> {selectedProduct.category}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => handleProductDelete(selectedProduct.id)}><FontAwesomeIcon icon={faTrash} /></Button>
                    <Button variant="secondary" onClick={handleDetailClose}>Chiudi</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
