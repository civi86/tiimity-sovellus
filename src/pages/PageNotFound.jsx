import { Link } from "react-router-dom";

export default function PageNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <h1 className="text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 animate-pulse">
                404
            </h1>
            <p className="mt-4 text-2xl md:text-3xl font-semibold text-gray-300">
                Etsimääsi sivua ei löytynyt :(
            </p>
            <p className="mt-2 text-gray-400">Ehkä eksyit matkalla...</p>
            <Link
                to="/dashboard"
                replace
                className="mt-8 px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transform transition-all duration-300 shadow-lg"
            >
                <span className="text-lg font-medium">Palaa Etusivulle</span>
            </Link>
        </div>
    );
}
