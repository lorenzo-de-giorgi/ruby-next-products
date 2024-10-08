// pages/products/[id].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const ProductDetails = () => {
    const router = useRouter();
    const { id } = router.query; // Get the product ID from the URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!id) return; // If ID is not available yet, return

            try {
                const response = await axios.get(`http://localhost:4567/products/${id}`);
                setProduct(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    if (loading) {
        return <div>Caricamento...</div>;
    }

    if (error) {
        return <div>Errore: {error}</div>;
    }

    if (!product) {
        return <div>Prodotto non trovato</div>;
    }

    return (
        <div className="container">
            <h1>{product.name}</h1>
            <p><strong>Descrizione:</strong> {product.description}</p>
            <p><strong>Categoria:</strong> {product.category}</p>
            <p><strong>Creato il:</strong> {new Date(product.created_at).toLocaleDateString()}</p>
            <button onClick={() => router.back()} className="btn btn-secondary">Indietro</button>
        </div>
    );
};

export default ProductDetails;
