export default function LoginPage() {
    return(
        <div className="container">
            <h1 className="text-center">Login</h1>
            <form className="d-flex flex-column">
                <input type="email" placeholder="Email" required className="form-control p-2 mb-3 mt-3"></input>
                <input type="password" placeholder="Password" required className="form-control p-2"></input>
            </form>
        </div>
    )
}