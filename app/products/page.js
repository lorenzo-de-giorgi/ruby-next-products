import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye, faPen } from '@fortawesome/free-solid-svg-icons';

export default function Inventory() {
    return(
        <div className="container">
            <h1 className="text-center">Inventario</h1>
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