import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DropdownButton, Dropdown } from "react-bootstrap";
import LogoutButton from "./LogoutButton";
import DeleteAccountButton from "./DeleteAccountButton";

export default function NavBar() {
    const { data: session } = useSession();
    const router = useRouter();
  
    return (
      <nav className='d-flex justify-content-between align-items-center py-3'>
        <div>
          <h1 href="/">Inventario Shop</h1>
        </div>
        <div>
          {session ? (
            <DropdownButton id="dropdown-basic-button" title={session.user.name} className='me-5 pe-3'>
              <Dropdown.Item href="#/action-1" className='text-center'><LogoutButton /></Dropdown.Item>
              <Dropdown.Item href="" className='text-center'><DeleteAccountButton /></Dropdown.Item>
            </DropdownButton>
          ) : (
            <>
              <Link href="/login" className='me-3 btn btn-dark'>Accedi</Link>
              <Link href="/register" className='btn btn-outline-dark'>Registrati</Link>
            </>
          )}
        </div>
      </nav>
    );
  }