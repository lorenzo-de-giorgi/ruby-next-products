import Link from "next/link";

export default function RegisterPage() {
    return(
        <div className="container">
            <h1 className="text-center">Register</h1>
            <form className="d-flex flex-column">
                <input type="email" placeholder="Email" required className="form-control p-2 mb-3 mt-3"></input>
                <input type="text" placeholder="Username" required className="form-control p-2 mb-3"></input>
                <input type="password" placeholder="Password" required className="form-control p-2 mb-3"></input>
                <input type="password" placeholder="Confirm Password" required className="form-control p-2 mb-3"></input>
                <input type="text" placeholder="Name" required className="form-control p-2 mb-3"></input>
                <input type="text" placeholder="Surname" required className="form-control p-2 mb-3"></input>
                <input type="date" placeholder="Date Of Birth" required className="form-control p-2 mb-3"></input>
            </form>
            <p className="text-center mt-4">Sei già registrato? <Link href="/login">Accedi</Link></p>
        </div>
    )
}